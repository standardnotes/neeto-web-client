import { destroyAllObjectProperties } from '@/Utils'
import {
  confirmDialog,
  GetItemTags,
  IsGlobalSpellcheckEnabled,
  KeyboardService,
  PIN_NOTE_COMMAND,
  STAR_NOTE_COMMAND,
} from '@standardnotes/ui-services'
import { StringEmptyTrash, Strings, StringUtils } from '@/Constants/Strings'
import {
  SNNote,
  NoteMutator,
  ContentType,
  SNTag,
  PrefKey,
  ApplicationEvent,
  EditorLineWidth,
  InternalEventBusInterface,
  MutationType,
  PrefDefaults,
  PreferenceServiceInterface,
  InternalEventHandlerInterface,
  InternalEventInterface,
  ItemManagerInterface,
  MutatorClientInterface,
  SyncServiceInterface,
  AlertService,
  ProtectionsClientInterface,
  LocalPrefKey,
} from '@standardnotes/snjs'
import { makeObservable, observable, action, computed, runInAction } from 'mobx'
import { AbstractViewController } from '../Abstract/AbstractViewController'
import { NavigationController } from '../Navigation/NavigationController'
import { NotesControllerInterface } from './NotesControllerInterface'
import { ItemGroupController } from '@/Components/NoteView/Controller/ItemGroupController'
import { CrossControllerEvent } from '../CrossControllerEvent'
import { ItemListController } from '../ItemList/ItemListController'

export class NotesController
  extends AbstractViewController
  implements NotesControllerInterface, InternalEventHandlerInterface
{
  shouldLinkToParentFolders: boolean
  lastSelectedNote: SNNote | undefined
  contextMenuOpen = false
  contextMenuClickLocation: { x: number; y: number } = { x: 0, y: 0 }
  contextMenuMaxHeight: number | 'auto' = 'auto'
  showProtectedWarning = false

  constructor(
    private itemListController: ItemListController,
    private navigationController: NavigationController,
    private itemControllerGroup: ItemGroupController,
    private keyboardService: KeyboardService,
    private preferences: PreferenceServiceInterface,
    private items: ItemManagerInterface,
    private mutator: MutatorClientInterface,
    private sync: SyncServiceInterface,
    private protections: ProtectionsClientInterface,
    private alerts: AlertService,
    private _isGlobalSpellcheckEnabled: IsGlobalSpellcheckEnabled,
    private _getItemTags: GetItemTags,
    eventBus: InternalEventBusInterface,
  ) {
    super(eventBus)

    makeObservable(this, {
      contextMenuOpen: observable,
      showProtectedWarning: observable,

      selectedNotes: computed,
      firstSelectedNote: computed,
      selectedNotesCount: computed,
      trashedNotesCount: computed,

      setContextMenuOpen: action,
      setContextMenuClickLocation: action,
      setShowProtectedWarning: action,
      unselectNotes: action,
    })

    this.shouldLinkToParentFolders = preferences.getValue(
      PrefKey.NoteAddToParentFolders,
      PrefDefaults[PrefKey.NoteAddToParentFolders],
    )

    eventBus.addEventHandler(this, ApplicationEvent.PreferencesChanged)
    eventBus.addEventHandler(this, CrossControllerEvent.UnselectAllNotes)

    this.disposers.push(
      this.keyboardService.addCommandHandler({
        command: PIN_NOTE_COMMAND,
        category: 'Current note',
        description: 'Pin current note',
        onKeyDown: () => {
          this.togglePinSelectedNotes()
        },
      }),
      this.keyboardService.addCommandHandler({
        command: STAR_NOTE_COMMAND,
        category: 'Current note',
        description: 'Star current note',
        onKeyDown: () => {
          this.toggleStarSelectedNotes()
        },
      }),
    )

    this.disposers.push(
      this.itemControllerGroup.addActiveControllerChangeObserver(() => {
        const controllers = this.itemControllerGroup.itemControllers

        const activeNoteUuids = controllers.map((controller) => controller.item.uuid)

        const selectedUuids = this.getSelectedNotesList().map((n) => n.uuid)

        for (const selectedId of selectedUuids) {
          if (!activeNoteUuids.includes(selectedId)) {
            this.itemListController.deselectItem({ uuid: selectedId })
          }
        }
      }),
    )
  }

  async handleEvent(event: InternalEventInterface): Promise<void> {
    if (event.type === ApplicationEvent.PreferencesChanged) {
      this.shouldLinkToParentFolders = this.preferences.getValue(
        PrefKey.NoteAddToParentFolders,
        PrefDefaults[PrefKey.NoteAddToParentFolders],
      )
    } else if (event.type === CrossControllerEvent.UnselectAllNotes) {
      this.unselectNotes()
    }
  }

  override deinit() {
    super.deinit()
    ;(this.lastSelectedNote as unknown) = undefined
    ;(this.itemListController as unknown) = undefined
    ;(this.navigationController as unknown) = undefined

    destroyAllObjectProperties(this)
  }

  public get selectedNotes(): SNNote[] {
    return this.itemListController.getFilteredSelectedItems<SNNote>(ContentType.TYPES.Note)
  }

  get firstSelectedNote(): SNNote | undefined {
    return Object.values(this.selectedNotes)[0]
  }

  get selectedNotesCount(): number {
    if (this.dealloced) {
      return 0
    }

    return Object.keys(this.selectedNotes).length
  }

  get trashedNotesCount(): number {
    return this.items.trashedItems.length
  }

  setContextMenuOpen = (open: boolean) => {
    this.contextMenuOpen = open
  }

  setContextMenuClickLocation(location: { x: number; y: number }): void {
    this.contextMenuClickLocation = location
  }

  async changeSelectedNotes(mutate: (mutator: NoteMutator) => void): Promise<void> {
    await this.mutator.changeItems(this.getSelectedNotesList(), mutate, MutationType.NoUpdateUserTimestamps)
    this.sync.sync().catch(console.error)
  }

  setHideSelectedNotePreviews(hide: boolean): void {
    this.changeSelectedNotes((mutator) => {
      mutator.hidePreview = hide
    }).catch(console.error)
  }

  setLockSelectedNotes(lock: boolean): void {
    this.changeSelectedNotes((mutator) => {
      mutator.locked = lock
    }).catch(console.error)
  }

  async setTrashSelectedNotes(trashed: boolean): Promise<void> {
    if (trashed) {
      const notesDeleted = await this.deleteNotes(false)
      if (notesDeleted) {
        runInAction(() => {
          this.contextMenuOpen = false
        })
      }
    } else {
      await this.changeSelectedNotes((mutator) => {
        mutator.trashed = trashed
      })
      runInAction(() => {
        this.contextMenuOpen = false
      })
    }
  }

  async deleteNotesPermanently(): Promise<void> {
    await this.deleteNotes(true)
  }

  async deleteNotes(permanently: boolean): Promise<boolean> {
    if (this.getSelectedNotesList().some((note) => note.locked)) {
      const text = StringUtils.deleteLockedNotesAttempt(this.selectedNotesCount)
      this.alerts.alert(text).catch(console.error)
      return false
    }

    const title = permanently ? Strings.deleteItemsPermanentlyTitle : Strings.trashItemsTitle
    let noteTitle = undefined
    if (this.selectedNotesCount === 1) {
      const selectedNote = this.getSelectedNotesList()[0]
      noteTitle = selectedNote.title.length ? `'${selectedNote.title}'` : 'this note'
    }
    const text = StringUtils.deleteNotes(permanently, this.selectedNotesCount, noteTitle)

    if (
      await confirmDialog({
        title,
        text,
        confirmButtonStyle: 'danger',
      })
    ) {
      this.itemListController.selectNextItem()
      if (permanently) {
        await this.mutator.deleteItems(this.getSelectedNotesList())
        void this.sync.sync()
      } else {
        await this.changeSelectedNotes((mutator) => {
          mutator.trashed = true
        })
      }
      return true
    }

    return false
  }

  togglePinSelectedNotes(): void {
    const notes = this.selectedNotes
    const pinned = notes.some((note) => note.pinned)

    if (!pinned) {
      this.setPinSelectedNotes(true)
    } else {
      this.setPinSelectedNotes(false)
    }
  }

  toggleStarSelectedNotes(): void {
    const notes = this.selectedNotes
    const starred = notes.some((note) => note.starred)

    if (!starred) {
      this.setStarSelectedNotes(true)
    } else {
      this.setStarSelectedNotes(false)
    }
  }

  setPinSelectedNotes(pinned: boolean): void {
    this.changeSelectedNotes((mutator) => {
      mutator.pinned = pinned
    }).catch(console.error)
  }

  setStarSelectedNotes(starred: boolean): void {
    this.changeSelectedNotes((mutator) => {
      mutator.starred = starred
    }).catch(console.error)
  }

  async setArchiveSelectedNotes(archived: boolean): Promise<void> {
    if (this.getSelectedNotesList().some((note) => note.locked)) {
      this.alerts.alert(StringUtils.archiveLockedNotesAttempt(archived, this.selectedNotesCount)).catch(console.error)
      return
    }

    await this.changeSelectedNotes((mutator) => {
      mutator.archived = archived
    })

    runInAction(() => {
      this.itemListController.deselectAll()
      this.contextMenuOpen = false
    })
  }

  async toggleArchiveSelectedNotes(): Promise<void> {
    const notes = this.selectedNotes
    const archived = notes.some((note) => note.archived)

    if (!archived) {
      await this.setArchiveSelectedNotes(true)
    } else {
      await this.setArchiveSelectedNotes(false)
    }
  }

  async setProtectSelectedNotes(protect: boolean): Promise<void> {
    const selectedNotes = this.getSelectedNotesList()
    if (protect) {
      await this.protections.protectNotes(selectedNotes)
      this.setShowProtectedWarning(true)
    } else {
      await this.protections.unprotectNotes(selectedNotes)
      this.setShowProtectedWarning(false)
    }

    void this.sync.sync()
  }

  unselectNotes(): void {
    this.itemListController.deselectAll()
  }

  getSpellcheckStateForNote(note: SNNote) {
    return note.spellcheck != undefined ? note.spellcheck : this._isGlobalSpellcheckEnabled.execute().getValue()
  }

  async toggleGlobalSpellcheckForNote(note: SNNote) {
    await this.mutator.changeItem<NoteMutator>(
      note,
      (mutator) => {
        mutator.toggleSpellcheck()
      },
      MutationType.NoUpdateUserTimestamps,
    )
    this.sync.sync().catch(console.error)
  }

  getEditorWidthForNote(note: SNNote) {
    return (
      note.editorWidth ??
      this.preferences.getLocalValue(LocalPrefKey.EditorLineWidth, PrefDefaults[LocalPrefKey.EditorLineWidth])
    )
  }

  async setNoteEditorWidth(note: SNNote, editorWidth: EditorLineWidth) {
    await this.mutator.changeItem<NoteMutator>(
      note,
      (mutator) => {
        mutator.editorWidth = editorWidth
      },
      MutationType.NoUpdateUserTimestamps,
    )
    this.sync.sync().catch(console.error)
  }

  async addTagToSelectedNotes(tag: SNTag): Promise<void> {
    const selectedNotes = this.getSelectedNotesList()
    await Promise.all(
      selectedNotes.map(async (note) => {
        await this.mutator.addTagToNote(note, tag, this.shouldLinkToParentFolders)
      }),
    )
    this.sync.sync().catch(console.error)
  }

  async removeTagFromSelectedNotes(tag: SNTag): Promise<void> {
    const selectedNotes = this.getSelectedNotesList()
    await this.mutator.changeItem(tag, (mutator) => {
      for (const note of selectedNotes) {
        mutator.removeItemAsRelationship(note)
      }
    })
    this.sync.sync().catch(console.error)
  }

  isTagInSelectedNotes(tag: SNTag): boolean {
    const selectedNotes = this.getSelectedNotesList()
    return selectedNotes.every((note) =>
      this._getItemTags
        .execute(note)
        .getValue()
        .find((noteTag) => noteTag.uuid === tag.uuid),
    )
  }

  setShowProtectedWarning(show: boolean): void {
    this.showProtectedWarning = show
  }

  async emptyTrash(): Promise<void> {
    if (
      await confirmDialog({
        text: StringEmptyTrash(this.trashedNotesCount),
        confirmButtonStyle: 'danger',
      })
    ) {
      await this.mutator.emptyTrash()
      this.sync.sync().catch(console.error)
    }
  }

  private getSelectedNotesList(): SNNote[] {
    return Object.values(this.selectedNotes)
  }
}

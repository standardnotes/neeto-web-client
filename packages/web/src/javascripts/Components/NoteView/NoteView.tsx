import { AbstractComponent } from '@/Components/Abstract/PureComponent'
import ChangeEditorButton from '@/Components/ChangeEditor/ChangeEditorButton'
import IframeFeatureView from '@/Components/ComponentView/IframeFeatureView'
import NotesOptionsPanel from '@/Components/NotesOptions/NotesOptionsPanel'
import PinNoteButton from '@/Components/PinNoteButton/PinNoteButton'
import ProtectedItemOverlay from '@/Components/ProtectedItemOverlay/ProtectedItemOverlay'
import { ElementIds } from '@/Constants/ElementIDs'
import { StringDeleteNote, STRING_DELETE_LOCKED_ATTEMPT, STRING_DELETE_PLACEHOLDER_ATTEMPT } from '@/Constants/Strings'
import { log, LoggingDomain } from '@/Logging'
import { debounce, isDesktopApplication, isMobileScreen } from '@/Utils'
import { classNames, compareArrayReferences, pluralize } from '@standardnotes/utils'
import {
  ApplicationEvent,
  ComponentArea,
  ComponentInterface,
  UIFeature,
  ComponentViewerInterface,
  ContentType,
  EditorLineWidth,
  IframeComponentFeatureDescription,
  isUIFeatureAnIframeFeature,
  isPayloadSourceRetrieved,
  NoteType,
  PayloadEmitSource,
  PrefDefaults,
  PrefKey,
  ProposedSecondsToDeferUILevelSessionExpirationDuringActiveInteraction,
  SNNote,
  VaultUserServiceEvent,
  LocalPrefKey,
} from '@standardnotes/snjs'
import { confirmDialog, DELETE_NOTE_KEYBOARD_COMMAND, KeyboardKey } from '@standardnotes/ui-services'
import { ChangeEventHandler, createRef, CSSProperties, FocusEvent, KeyboardEventHandler, RefObject } from 'react'
import { SuperEditor } from '../SuperEditor/SuperEditor'
import IndicatorCircle from '../IndicatorCircle/IndicatorCircle'
import LinkedItemBubblesContainer from '../LinkedItems/LinkedItemBubblesContainer'
import LinkedItemsButton from '../LinkedItems/LinkedItemsButton'
import MobileItemsListButton from '../NoteGroupView/MobileItemsListButton'
import EditingDisabledBanner from './EditingDisabledBanner'
import { reloadFont } from './FontFunctions'
import NoteViewFileDropTarget from './NoteViewFileDropTarget'
import { NoteViewProps } from './NoteViewProps'
import {
  transactionForAssociateComponentWithCurrentNote,
  transactionForDisassociateComponentWithCurrentNote,
} from './TransactionFunctions'
import { SuperEditorContentId } from '../SuperEditor/Constants'
import { NoteViewController } from './Controller/NoteViewController'
import { PlainEditor, PlainEditorInterface } from './PlainEditor/PlainEditor'
import { EditorMargins, EditorMaxWidths } from '../EditorWidthSelectionModal/EditorWidths'
import NoteStatusIndicator, { NoteStatus } from './NoteStatusIndicator'
import CollaborationInfoHUD from './CollaborationInfoHUD'
import Button from '../Button/Button'
import ModalOverlay from '../Modal/ModalOverlay'
import NoteConflictResolutionModal from './NoteConflictResolutionModal/NoteConflictResolutionModal'
import Icon from '../Icon/Icon'

function sortAlphabetically(array: ComponentInterface[]): ComponentInterface[] {
  return array.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
}

type State = {
  availableStackComponents: ComponentInterface[]
  editorComponentViewer?: ComponentViewerInterface
  editorComponentViewerDidAlreadyReload?: boolean
  editorStateDidLoad: boolean
  editorTitle: string
  isDesktop?: boolean
  editorLineWidth: EditorLineWidth
  noteLocked: boolean
  readonly?: boolean
  noteStatus?: NoteStatus
  saveError?: boolean
  showProtectedWarning: boolean
  spellcheck: boolean
  stackComponentViewers: ComponentViewerInterface[]
  syncTakingTooLong: boolean
  monospaceFont?: boolean
  editorFocused?: boolean
  paneGestureEnabled?: boolean
  noteLastEditedByUuid?: string
  updateSavingIndicator?: boolean
  editorFeatureIdentifier?: string
  noteType?: NoteType
  focusModeEnabled?: boolean

  conflictedNotes: SNNote[]
  showConflictResolutionModal: boolean
}

class NoteView extends AbstractComponent<NoteViewProps, State> {
  readonly controller!: NoteViewController

  onEditorComponentLoad?: () => void

  private removeTrashKeyObserver?: () => void
  private removeNoteStreamObserver?: () => void
  private removeComponentManagerObserver?: () => void
  private removeInnerNoteObserver?: () => void
  private removeVaultUsersEventHandler?: () => void

  private protectionTimeoutId: ReturnType<typeof setTimeout> | null = null
  private noteViewElementRef: RefObject<HTMLDivElement>
  private editorContentRef: RefObject<HTMLDivElement>
  private plainEditorRef?: PlainEditorInterface

  constructor(props: NoteViewProps) {
    super(props, props.application)

    this.controller = props.controller

    this.onEditorComponentLoad = () => {
      if (!this.controller || this.controller.dealloced) {
        return
      }
      this.application.desktopManager?.redoSearch()
    }

    this.debounceReloadEditorComponent = debounce(this.debounceReloadEditorComponent.bind(this), 25)

    const itemVault = this.application.vaults.getItemVault(this.controller.item)

    this.state = {
      availableStackComponents: [],
      editorStateDidLoad: false,
      editorTitle: '',
      editorLineWidth: PrefDefaults[LocalPrefKey.EditorLineWidth],
      isDesktop: isDesktopApplication(),
      noteStatus: undefined,
      noteLocked: this.controller.item.locked,
      readonly: itemVault ? this.application.vaultUsers.isCurrentUserReadonlyVaultMember(itemVault) : undefined,
      showProtectedWarning: false,
      spellcheck: true,
      stackComponentViewers: [],
      syncTakingTooLong: false,
      editorFeatureIdentifier: this.controller.item.editorIdentifier,
      noteType: this.controller.item.noteType,
      conflictedNotes: [],
      showConflictResolutionModal: false,
    }

    this.noteViewElementRef = createRef<HTMLDivElement>()
    this.editorContentRef = createRef<HTMLDivElement>()
  }

  override deinit() {
    super.deinit()
    ;(this.controller as unknown) = undefined

    this.removeNoteStreamObserver?.()
    ;(this.removeNoteStreamObserver as unknown) = undefined

    this.removeInnerNoteObserver?.()
    ;(this.removeInnerNoteObserver as unknown) = undefined

    this.removeComponentManagerObserver?.()
    ;(this.removeComponentManagerObserver as unknown) = undefined

    this.removeTrashKeyObserver?.()
    this.removeTrashKeyObserver = undefined

    this.removeVaultUsersEventHandler?.()
    this.removeVaultUsersEventHandler = undefined

    this.clearNoteProtectionInactivityTimer()
    ;(this.ensureNoteIsInsertedBeforeUIAction as unknown) = undefined

    this.onEditorComponentLoad = undefined
    ;(this.onPanelResizeFinish as unknown) = undefined
    ;(this.authorizeAndDismissProtectedWarning as unknown) = undefined
    ;(this.editorComponentViewerRequestsReload as unknown) = undefined
    ;(this.onTitleEnter as unknown) = undefined
    ;(this.onTitleChange as unknown) = undefined
    ;(this.onPanelResizeFinish as unknown) = undefined
    ;(this.stackComponentExpanded as unknown) = undefined
    ;(this.toggleStackComponent as unknown) = undefined
    ;(this.debounceReloadEditorComponent as unknown) = undefined
    ;(this.editorContentRef as unknown) = undefined
    ;(this.plainEditorRef as unknown) = undefined
  }

  getState() {
    return this.state as State
  }

  get note() {
    return this.controller.item
  }

  override shouldComponentUpdate(_nextProps: Readonly<NoteViewProps>, nextState: Readonly<State>): boolean {
    for (const key of Object.keys(nextState) as (keyof State)[]) {
      const prevValue = this.state[key]
      const nextValue = nextState[key]

      if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
        const areEqual = compareArrayReferences<unknown>(prevValue, nextValue)
        if (!areEqual) {
          log(LoggingDomain.NoteView, 'Rendering due to array state change', key, prevValue, nextValue)
          return true
        }
        continue
      }

      if (prevValue !== nextValue) {
        log(LoggingDomain.NoteView, 'Rendering due to state change', key, prevValue, nextValue)
        return true
      }
    }

    return false
  }

  override componentDidMount(): void {
    super.componentDidMount()

    this.removeVaultUsersEventHandler = this.application.vaultUsers.addEventObserver((event, data) => {
      if (event === VaultUserServiceEvent.InvalidatedUserCacheForVault) {
        const vault = this.application.vaults.getItemVault(this.note)
        if ((data as string) !== vault?.sharing?.sharedVaultUuid) {
          return
        }
        this.setState({
          readonly: vault ? this.application.vaultUsers.isCurrentUserReadonlyVaultMember(vault) : undefined,
        })
      }
    })

    this.registerKeyboardShortcuts()

    this.removeInnerNoteObserver = this.controller.addNoteInnerValueChangeObserver((note, source) => {
      this.onNoteInnerChange(note, source)
    })

    this.autorun(() => {
      const syncStatus = this.controller.syncStatus

      const isFocusModeEnabled = this.application.paneController.focusModeEnabled
      const didFocusModeChange = this.state.focusModeEnabled !== isFocusModeEnabled

      this.setState({
        showProtectedWarning: this.application.notesController.showProtectedWarning,
        noteStatus: syncStatus,
        saveError: syncStatus?.type === 'error',
        syncTakingTooLong: false,
        focusModeEnabled: isFocusModeEnabled,
      })

      if (!isFocusModeEnabled && didFocusModeChange) {
        this.controller.syncOnlyIfLargeNote()
      }
    })

    this.reloadEditorComponent().catch(console.error)
    this.reloadStackComponents().catch(console.error)

    const showProtectedWarning =
      this.note.protected &&
      (!this.application.hasProtectionSources() || !this.application.protections.hasUnprotectedAccessSession())
    this.setShowProtectedOverlay(showProtectedWarning)

    this.reloadPreferences().catch(console.error)

    if (this.controller.isTemplateNote) {
      setTimeout(() => {
        if (this.controller.templateNoteOptions?.autofocusBehavior === 'title') {
          this.focusTitle()
        }
      })
    }
  }

  setPlainEditorRef = (ref: PlainEditorInterface | null) => {
    this.plainEditorRef = ref || undefined
  }

  override componentDidUpdate(_prevProps: NoteViewProps, prevState: State): void {
    if (
      this.state.showProtectedWarning != undefined &&
      prevState.showProtectedWarning !== this.state.showProtectedWarning
    ) {
      this.reloadEditorComponent().catch(console.error)
    }
  }

  onNoteInnerChange(note: SNNote, source: PayloadEmitSource): void {
    log(LoggingDomain.NoteView, 'On inner note change', PayloadEmitSource[source])

    if (note.uuid !== this.note.uuid) {
      throw Error('Editor received changes for non-current note')
    }

    let title = this.state.editorTitle

    if (isPayloadSourceRetrieved(source)) {
      title = note.title
    }

    if (!this.state.editorTitle) {
      title = note.title
    }

    if (title !== this.state.editorTitle) {
      this.setState({
        editorTitle: title,
      })
    }

    if (note.last_edited_by_uuid !== this.state.noteLastEditedByUuid) {
      this.setState({
        noteLastEditedByUuid: note.last_edited_by_uuid,
      })
    }

    if (note.locked !== this.state.noteLocked) {
      this.setState({
        noteLocked: note.locked,
      })
    }

    if (note.editorIdentifier !== this.state.editorFeatureIdentifier || note.noteType !== this.state.noteType) {
      this.setState({
        editorFeatureIdentifier: note.editorIdentifier,
        noteType: note.noteType,
        editorTitle: note.title,
      })

      void this.reloadEditorComponent()
    }

    this.reloadSpellcheck().catch(console.error)

    this.reloadLineWidth()

    const isTemplateNoteInsertedToBeInteractableWithEditor = source === PayloadEmitSource.LocalInserted && note.dirty
    if (isTemplateNoteInsertedToBeInteractableWithEditor) {
      return
    }

    if (note.lastSyncBegan || note.dirty) {
      const currentStatus = this.controller.syncStatus
      const isWaitingToSyncLargeNote = currentStatus?.type === 'waiting'
      if (note.lastSyncEnd) {
        const hasStartedNewSync = note.lastSyncBegan && note.lastSyncBegan.getTime() > note.lastSyncEnd.getTime()
        const shouldShowSavedStatus = note.lastSyncBegan && note.lastSyncEnd.getTime() > note.lastSyncBegan.getTime()
        if (hasStartedNewSync) {
          this.controller.showSavingStatus()
        } else if (this.state.noteStatus && shouldShowSavedStatus && !isWaitingToSyncLargeNote) {
          this.controller.showAllChangesSavedStatus()
        }
      } else if (note.lastSyncBegan) {
        this.controller.showSavingStatus()
      }
    }
  }

  override componentWillUnmount(): void {
    if (this.state.editorComponentViewer) {
      this.application.componentManager?.destroyComponentViewer(this.state.editorComponentViewer)
    }

    super.componentWillUnmount()
  }

  override async onAppLaunch() {
    await super.onAppLaunch()
    this.streamItems()
  }

  override async onAppEvent(eventName: ApplicationEvent) {
    if (this.controller?.dealloced) {
      return
    }

    switch (eventName) {
      case ApplicationEvent.LocalPreferencesChanged:
      case ApplicationEvent.PreferencesChanged:
        void this.reloadPreferences()
        void this.reloadStackComponents()
        break
      case ApplicationEvent.HighLatencySync:
        this.setState({ syncTakingTooLong: true })
        break
      case ApplicationEvent.CompletedFullSync: {
        this.setState({ syncTakingTooLong: false })
        const isInErrorState = this.state.saveError
        /** if we're still dirty, don't change status, a sync is likely upcoming. */
        if (!this.note.dirty && isInErrorState) {
          this.controller.showAllChangesSavedStatus()
        }
        break
      }
      case ApplicationEvent.FailedSync:
        /**
         * Only show error status in editor if the note is dirty.
         * Otherwise, it means the originating sync came from somewhere else
         * and we don't want to display an error here.
         */
        if (this.note.dirty) {
          this.controller.showErrorSyncStatus()
        }
        break
      case ApplicationEvent.LocalDatabaseWriteError:
        this.controller.showErrorSyncStatus({
          type: 'error',
          message: 'Offline Saving Issue',
          description: 'Changes not saved',
        })
        break
      case ApplicationEvent.UnprotectedSessionBegan: {
        this.setShowProtectedOverlay(false)
        break
      }
      case ApplicationEvent.UnprotectedSessionExpired: {
        if (this.note.protected) {
          this.hideProtectedNoteIfInactive()
        }
        break
      }
    }
  }

  getSecondsElapsedSinceLastEdit(): number {
    return (Date.now() - this.note.userModifiedDate.getTime()) / 1000
  }

  hideProtectedNoteIfInactive(): void {
    const secondsElapsedSinceLastEdit = this.getSecondsElapsedSinceLastEdit()
    if (secondsElapsedSinceLastEdit >= ProposedSecondsToDeferUILevelSessionExpirationDuringActiveInteraction) {
      this.setShowProtectedOverlay(true)
    } else {
      const secondsUntilTheNextCheck =
        ProposedSecondsToDeferUILevelSessionExpirationDuringActiveInteraction - secondsElapsedSinceLastEdit
      this.startNoteProtectionInactivityTimer(secondsUntilTheNextCheck)
    }
  }

  startNoteProtectionInactivityTimer(timerDurationInSeconds: number): void {
    this.clearNoteProtectionInactivityTimer()
    this.protectionTimeoutId = setTimeout(() => {
      this.hideProtectedNoteIfInactive()
    }, timerDurationInSeconds * 1000)
  }

  clearNoteProtectionInactivityTimer(): void {
    if (this.protectionTimeoutId) {
      clearTimeout(this.protectionTimeoutId)
    }
  }

  authorizeAndDismissProtectedWarning = async () => {
    let showNoteContents = true

    if (this.application.hasProtectionSources()) {
      showNoteContents = await this.application.authorizeNoteAccess(this.note)
    }

    if (!showNoteContents) {
      return
    }

    this.setShowProtectedOverlay(false)
    this.focusTitle()
  }

  streamItems() {
    this.removeNoteStreamObserver = this.application.items.streamItems<SNNote>(ContentType.TYPES.Note, async () => {
      if (!this.note) {
        return
      }

      this.setState({
        conflictedNotes: this.application.items.conflictsOf(this.note.uuid) as SNNote[],
      })
    })
  }

  private createComponentViewer(component: UIFeature<IframeComponentFeatureDescription>) {
    if (!component) {
      throw Error('Cannot create component viewer for undefined component')
    }
    const viewer = this.application.componentManager.createComponentViewer(component, { uuid: this.note.uuid })
    return viewer
  }

  public editorComponentViewerRequestsReload = async (
    viewer: ComponentViewerInterface,
    force?: boolean,
  ): Promise<void> => {
    if (this.state.editorComponentViewerDidAlreadyReload && !force) {
      return
    }

    const component = viewer.getComponentOrFeatureItem()
    this.application.componentManager.destroyComponentViewer(viewer)
    this.setState(
      {
        editorComponentViewer: undefined,
        editorComponentViewerDidAlreadyReload: true,
      },
      () => {
        this.setState({
          editorComponentViewer: this.createComponentViewer(component),
          editorStateDidLoad: true,
        })
      },
    )
  }

  /**
   * Calling reloadEditorComponent successively without waiting for state to settle
   * can result in componentViewers being dealloced twice
   */
  debounceReloadEditorComponent() {
    this.reloadEditorComponent().catch(console.error)
  }

  private destroyCurrentEditorComponent() {
    const currentComponentViewer = this.state.editorComponentViewer
    if (currentComponentViewer) {
      this.application.componentManager.destroyComponentViewer(currentComponentViewer)
      this.setState({
        editorComponentViewer: undefined,
      })
    }
  }

  async reloadEditorComponent(): Promise<void> {
    log(LoggingDomain.NoteView, 'Reload editor component')
    if (this.state.showProtectedWarning) {
      this.destroyCurrentEditorComponent()
      return
    }

    const newUIFeature = this.application.componentManager.editorForNote(this.note)

    /** Component editors cannot interact with template notes so the note must be inserted */
    if (isUIFeatureAnIframeFeature(newUIFeature) && this.controller.isTemplateNote) {
      await this.controller.insertTemplatedNote()
    }

    const currentComponentViewer = this.state.editorComponentViewer

    if (currentComponentViewer) {
      const needsDestroy = currentComponentViewer.componentUniqueIdentifier !== newUIFeature.uniqueIdentifier
      if (needsDestroy) {
        this.destroyCurrentEditorComponent()
      }
    }

    if (isUIFeatureAnIframeFeature(newUIFeature)) {
      this.setState({
        editorComponentViewer: this.createComponentViewer(newUIFeature),
        editorStateDidLoad: true,
      })
    } else {
      reloadFont(this.state.monospaceFont)
      this.setState({
        editorStateDidLoad: true,
      })
    }
  }

  hasAvailableExtensions() {
    return this.application.actions.extensionsInContextOfItem(this.note).length > 0
  }

  onTitleEnter: KeyboardEventHandler<HTMLInputElement> = ({ key, currentTarget }) => {
    if (key !== KeyboardKey.Enter) {
      return
    }

    currentTarget.blur()
    this.plainEditorRef?.focus()
  }

  onTitleChange: ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    log(LoggingDomain.NoteView, 'Performing save after title change')

    const title = currentTarget.value

    this.setState({
      editorTitle: title,
    })

    this.controller
      .saveAndAwaitLocalPropagation({
        title: title,
        isUserModified: true,
        dontGeneratePreviews: true,
      })
      .catch(console.error)
  }

  focusTitle() {
    document.getElementById(ElementIds.NoteTitleEditor)?.focus()
  }

  setShowProtectedOverlay(show: boolean) {
    this.application.notesController.setShowProtectedWarning(show)
  }

  async deleteNote(permanently: boolean) {
    if (this.controller.isTemplateNote) {
      this.application.alerts.alert(STRING_DELETE_PLACEHOLDER_ATTEMPT).catch(console.error)
      return
    }

    if (this.note.locked) {
      this.application.alerts.alert(STRING_DELETE_LOCKED_ATTEMPT).catch(console.error)
      return
    }

    const title = this.note.title.length ? `'${this.note.title}'` : 'this note'
    const text = StringDeleteNote(title, permanently)
    if (
      await confirmDialog({
        text,
        confirmButtonStyle: 'danger',
      })
    ) {
      if (permanently) {
        this.performNoteDeletion(this.note)
      } else {
        this.controller
          .saveAndAwaitLocalPropagation({
            title: this.state.editorTitle,
            bypassDebouncer: true,
            dontGeneratePreviews: true,
            isUserModified: true,
            customMutate: (mutator) => {
              mutator.trashed = true
            },
          })
          .catch(console.error)
      }
    }
  }

  performNoteDeletion(note: SNNote) {
    this.application.mutator
      .deleteItem(note)
      .then(() => this.application.sync.sync())
      .catch(console.error)
  }

  onPanelResizeFinish = async (width: number, left: number, isMaxWidth: boolean) => {
    if (isMaxWidth) {
      await this.application.setPreference(PrefKey.EditorWidth, null)
    } else {
      if (width !== undefined && width !== null) {
        await this.application.setPreference(PrefKey.EditorWidth, width)
      }
    }
    if (left !== undefined && left !== null) {
      await this.application.setPreference(PrefKey.EditorLeft, left)
    }
    this.application.sync.sync().catch(console.error)
  }

  async reloadSpellcheck() {
    const spellcheck = this.application.notesController.getSpellcheckStateForNote(this.note)
    if (spellcheck !== this.state.spellcheck) {
      reloadFont(this.state.monospaceFont)
      this.setState({ spellcheck })
    }
  }

  reloadLineWidth() {
    const editorLineWidth = this.application.notesController.getEditorWidthForNote(this.note)

    this.setState({
      editorLineWidth,
    })
  }

  async reloadPreferences() {
    log(LoggingDomain.NoteView, 'Reload preferences')
    const monospaceFont = this.application.preferences.getLocalValue(
      LocalPrefKey.EditorMonospaceEnabled,
      PrefDefaults[LocalPrefKey.EditorMonospaceEnabled],
    )

    const updateSavingIndicator = this.application.getPreference(
      PrefKey.UpdateSavingStatusIndicator,
      PrefDefaults[PrefKey.UpdateSavingStatusIndicator],
    )

    const paneGestureEnabled = this.application.getPreference(
      PrefKey.PaneGesturesEnabled,
      PrefDefaults[PrefKey.PaneGesturesEnabled],
    )

    await this.reloadSpellcheck()

    this.reloadLineWidth()

    this.setState({
      monospaceFont,
      updateSavingIndicator,
      paneGestureEnabled,
    })

    reloadFont(monospaceFont)
  }

  async reloadStackComponents() {
    log(LoggingDomain.NoteView, 'Reload stack components')
    const enabledComponents = sortAlphabetically(
      this.application.componentManager
        .thirdPartyComponentsForArea(ComponentArea.EditorStack)
        .filter((component) => this.application.componentManager.isComponentActive(component)),
    )

    const needsNewViewer = enabledComponents.filter((component) => {
      const hasExistingViewer = this.state.stackComponentViewers.find(
        (viewer) => viewer.componentUniqueIdentifier.value === component.uuid,
      )
      return !hasExistingViewer
    })

    const needsDestroyViewer = this.state.stackComponentViewers.filter((viewer) => {
      const viewerComponentExistsInEnabledComponents = enabledComponents.find((component) => {
        return component.uuid === viewer.componentUniqueIdentifier.value
      })
      return !viewerComponentExistsInEnabledComponents
    })

    const newViewers: ComponentViewerInterface[] = []
    for (const component of needsNewViewer) {
      newViewers.push(
        this.application.componentManager.createComponentViewer(
          new UIFeature<IframeComponentFeatureDescription>(component),
          {
            uuid: this.note.uuid,
          },
        ),
      )
    }

    for (const viewer of needsDestroyViewer) {
      this.application.componentManager.destroyComponentViewer(viewer)
    }
    this.setState({
      availableStackComponents: enabledComponents,
      stackComponentViewers: newViewers,
    })
  }

  stackComponentExpanded = (component: ComponentInterface): boolean => {
    return !!this.state.stackComponentViewers.find(
      (viewer) => viewer.componentUniqueIdentifier.value === component.uuid,
    )
  }

  toggleStackComponent = async (component: ComponentInterface) => {
    if (!component.isExplicitlyEnabledForItem(this.note.uuid)) {
      await this.application.mutator.runTransactionalMutation(
        transactionForAssociateComponentWithCurrentNote(component, this.note),
      )
    } else {
      await this.application.mutator.runTransactionalMutation(
        transactionForDisassociateComponentWithCurrentNote(component, this.note),
      )
    }
    this.application.sync.sync().catch(console.error)
  }

  registerKeyboardShortcuts() {
    this.removeTrashKeyObserver = this.application.keyboardService.addCommandHandler({
      command: DELETE_NOTE_KEYBOARD_COMMAND,
      notTags: ['INPUT', 'TEXTAREA'],
      notElementIds: [SuperEditorContentId],
      onKeyDown: () => {
        this.deleteNote(false).catch(console.error)
      },
    })
  }

  ensureNoteIsInsertedBeforeUIAction = async () => {
    if (this.controller.isTemplateNote) {
      await this.controller.insertTemplatedNote()
    }
  }

  onEditorFocus = () => {
    this.setState({ editorFocused: true })
  }

  onEditorBlur = (event: FocusEvent) => {
    if (event.relatedTarget?.id === ElementIds.NoteOptionsButton) {
      return
    }
    this.setState({ editorFocused: false })
  }

  toggleConflictResolutionModal = () => {
    this.setState((state) => ({
      showConflictResolutionModal: !state.showConflictResolutionModal,
    }))
  }

  triggerSyncOnAction = () => {
    this.controller.syncNow()
  }

  override render() {
    if (this.controller.dealloced) {
      return null
    }

    if (this.state.showProtectedWarning || !this.application.isAuthorizedToRenderItem(this.note)) {
      return (
        <ProtectedItemOverlay
          showAccountMenu={() => this.application.showAccountMenu()}
          hasProtectionSources={this.application.hasProtectionSources()}
          onViewItem={this.authorizeAndDismissProtectedWarning}
          itemType={'note'}
        />
      )
    }

    const renderHeaderOptions = isMobileScreen() ? !this.state.editorFocused : true

    const editorMode =
      this.note.noteType === NoteType.Super
        ? 'super'
        : this.state.editorStateDidLoad && !this.state.editorComponentViewer
        ? 'plain'
        : this.state.editorComponentViewer
        ? 'component'
        : 'plain'

    const shouldShowConflictsButton = this.state.conflictedNotes.length > 0 && !this.state.readonly

    return (
      <div aria-label="Note" className="section editor sn-component h-full md:max-h-full" ref={this.noteViewElementRef}>
        {this.note && (
          <NoteViewFileDropTarget
            note={this.note}
            linkingController={this.application.linkingController}
            filesController={this.application.filesController}
            noteViewElement={this.noteViewElementRef.current}
          />
        )}

        {this.state.readonly && (
          <div className="bg-warning-faded flex items-center px-3.5 py-2 text-sm text-accessory-tint-3">
            <Icon type="pencil-off" className="mr-3" />
            You don't have permission to edit this note
          </div>
        )}

        {this.state.noteLocked && (
          <EditingDisabledBanner
            onClick={() => this.application.notesController.setLockSelectedNotes(!this.state.noteLocked)}
            noteLocked={this.state.noteLocked}
          />
        )}

        {this.note && (
          <div
            id="editor-title-bar"
            className="content-title-bar section-title-bar z-editor-title-bar w-full bg-default pt-4"
          >
            <div
              className={classNames(
                'mb-2 flex justify-between md:mb-0 md:flex-nowrap md:gap-4 xl:items-center',
                shouldShowConflictsButton ? 'items-center' : 'items-start',
                !renderHeaderOptions ? 'flex-nowrap gap-4' : 'flex-wrap gap-2 ',
              )}
            >
              <div className={classNames(this.state.noteLocked && 'locked', 'flex flex-grow items-center')}>
                <MobileItemsListButton />
                <div className="title flex-grow overflow-auto">
                  <input
                    className="input text-lg"
                    disabled={this.state.noteLocked || this.state.readonly}
                    id={ElementIds.NoteTitleEditor}
                    onChange={this.onTitleChange}
                    onFocus={(event) => {
                      event.target.select()
                    }}
                    onKeyUp={this.onTitleEnter}
                    spellCheck={false}
                    value={this.state.editorTitle}
                    autoComplete="off"
                  />
                </div>
                <NoteStatusIndicator
                  note={this.note}
                  status={this.state.noteStatus}
                  syncTakingTooLong={this.state.syncTakingTooLong}
                  updateSavingIndicator={this.state.updateSavingIndicator}
                />
              </div>
              {shouldShowConflictsButton && (
                <Button
                  id={ElementIds.ConflictResolutionButton}
                  className="flex items-center"
                  primary
                  colorStyle="warning"
                  small
                  onClick={this.toggleConflictResolutionModal}
                >
                  <Icon type="merge" size="small" className="mr-2" />
                  {this.state.conflictedNotes.length}{' '}
                  {pluralize(this.state.conflictedNotes.length, 'conflict', 'conflicts')}
                </Button>
              )}
              <div className="note-view-options-buttons flex items-center gap-3">
                {!this.state.readonly && renderHeaderOptions && (
                  <>
                    <LinkedItemsButton
                      linkingController={this.application.linkingController}
                      onClick={this.triggerSyncOnAction}
                      onClickPreprocessing={this.ensureNoteIsInsertedBeforeUIAction}
                    />
                    <ChangeEditorButton
                      noteViewController={this.controller}
                      onClick={this.triggerSyncOnAction}
                      onClickPreprocessing={this.ensureNoteIsInsertedBeforeUIAction}
                    />
                    <PinNoteButton
                      notesController={this.application.notesController}
                      onClickPreprocessing={this.ensureNoteIsInsertedBeforeUIAction}
                    />
                  </>
                )}
                <NotesOptionsPanel
                  notesController={this.application.notesController}
                  onClick={this.triggerSyncOnAction}
                  onClickPreprocessing={this.ensureNoteIsInsertedBeforeUIAction}
                  onButtonBlur={() => {
                    this.setState({
                      editorFocused: false,
                    })
                  }}
                />
              </div>
            </div>
            <div className="mb-1 mt-2.5 md:hidden">
              <CollaborationInfoHUD item={this.note} />
            </div>
            <div className="hidden md:block">
              <LinkedItemBubblesContainer
                item={this.note}
                linkingController={this.application.linkingController}
                readonly={this.state.readonly}
              />
            </div>
          </div>
        )}

        <div
          id={ElementIds.EditorContent}
          className={classNames(
            ElementIds.EditorContent,
            'z-editor-content overflow-auto sm:[&>*]:mx-[var(--editor-margin)] sm:[&>*]:max-w-[var(--editor-max-width)]',
          )}
          style={
            {
              '--editor-margin': EditorMargins[this.state.editorLineWidth],
              '--editor-max-width': EditorMaxWidths[this.state.editorLineWidth],
            } as CSSProperties
          }
          ref={this.editorContentRef}
        >
          {editorMode === 'component' && this.state.editorComponentViewer && (
            <div className="component-view relative flex-grow">
              {this.state.paneGestureEnabled && <div className="absolute left-0 top-0 h-full w-[20px] md:hidden" />}
              <IframeFeatureView
                key={this.state.editorComponentViewer.identifier}
                componentViewer={this.state.editorComponentViewer}
                onLoad={this.onEditorComponentLoad}
                requestReload={this.editorComponentViewerRequestsReload}
                readonly={this.state.readonly}
              />
            </div>
          )}

          {editorMode === 'plain' && (
            <PlainEditor
              application={this.application}
              spellcheck={this.state.spellcheck}
              ref={this.setPlainEditorRef}
              controller={this.controller}
              locked={this.state.noteLocked || !!this.state.readonly}
              onFocus={this.onEditorFocus}
              onBlur={this.onEditorBlur}
            />
          )}

          {editorMode === 'super' && (
            <div className={classNames('blocks-editor w-full flex-grow overflow-hidden')}>
              <SuperEditor
                key={this.note.uuid}
                application={this.application}
                linkingController={this.application.linkingController}
                filesController={this.application.filesController}
                spellcheck={this.state.spellcheck}
                controller={this.controller}
                readonly={this.state.readonly}
                onFocus={this.onEditorFocus}
                onBlur={this.onEditorBlur}
              />
            </div>
          )}
        </div>

        <div id="editor-pane-component-stack">
          {this.state.availableStackComponents.length > 0 && (
            <div
              id="component-stack-menu-bar"
              className="flex h-6 w-full items-center justify-between border-t border-solid border-border bg-contrast px-2 py-0 text-text"
            >
              <div className="flex h-full">
                {this.state.availableStackComponents.map((component) => {
                  const active = this.application.componentManager.isComponentActive(component)
                  return (
                    <div
                      key={component.uuid}
                      onClick={() => {
                        this.toggleStackComponent(component).catch(console.error)
                      }}
                      className="flex flex-grow cursor-pointer items-center justify-center [&:not(:first-child)]:ml-3"
                    >
                      <div className="flex h-full items-center [&:not(:first-child)]:ml-2">
                        {this.stackComponentExpanded(component) && active && <IndicatorCircle style="info" />}
                        {!this.stackComponentExpanded(component) && <IndicatorCircle style="neutral" />}
                      </div>
                      <div className="flex h-full items-center [&:not(:first-child)]:ml-2">
                        <div className="whitespace-nowrap text-xs font-bold">{component.name}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="sn-component">
            {this.state.stackComponentViewers.map((viewer) => {
              return (
                <div className="component-view component-stack-item" key={viewer.identifier}>
                  <IframeFeatureView key={viewer.identifier} componentViewer={viewer} />
                </div>
              )
            })}
          </div>
        </div>

        <ModalOverlay
          isOpen={this.state.showConflictResolutionModal}
          close={this.toggleConflictResolutionModal}
          className="md:h-full md:w-[70vw]"
        >
          <NoteConflictResolutionModal
            currentNote={this.note}
            conflictedNotes={this.state.conflictedNotes}
            close={this.toggleConflictResolutionModal}
          />
        </ModalOverlay>
      </div>
    )
  }
}

export default NoteView

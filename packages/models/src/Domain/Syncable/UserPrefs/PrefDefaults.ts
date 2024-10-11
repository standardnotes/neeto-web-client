import { NativeFeatureIdentifier } from '@standardnotes/features'
import { CollectionSort } from '../../Runtime/Collection/CollectionSort'
import { EditorFontSize } from './EditorFontSize'
import { EditorLineHeight } from './EditorLineHeight'
import { EditorLineWidth } from './EditorLineWidth'
import { PrefKey, PrefValue } from './PrefKey'
import { NewNoteTitleFormat } from './NewNoteTitleFormat'

export const PrefDefaults = {
  [PrefKey.TagsPanelWidth]: 220,
  [PrefKey.NotesPanelWidth]: 350,
  [PrefKey.EditorWidth]: null,
  [PrefKey.EditorLeft]: null,
  [PrefKey.DEPRECATED_EditorMonospaceEnabled]: false,
  [PrefKey.EditorSpellcheck]: true,
  [PrefKey.EditorResizersEnabled]: false,
  [PrefKey.DEPRECATED_EditorLineHeight]: EditorLineHeight.Normal,
  [PrefKey.DEPRECATED_EditorLineWidth]: EditorLineWidth.FullWidth,
  [PrefKey.DEPRECATED_EditorFontSize]: EditorFontSize.Normal,
  [PrefKey.SortNotesBy]: CollectionSort.CreatedAt,
  [PrefKey.SortNotesReverse]: false,
  [PrefKey.NotesShowArchived]: false,
  [PrefKey.NotesShowTrashed]: false,
  [PrefKey.NotesHidePinned]: false,
  [PrefKey.NotesHideProtected]: false,
  [PrefKey.NotesHideNotePreview]: false,
  [PrefKey.NotesHideDate]: false,
  [PrefKey.NotesHideTags]: false,
  [PrefKey.NotesHideEditorIcon]: false,
  [PrefKey.DEPRECATED_UseSystemColorScheme]: false,
  [PrefKey.DEPRECATED_UseTranslucentUI]: true,
  [PrefKey.DEPRECATED_AutoLightThemeIdentifier]: 'Default',
  [PrefKey.DEPRECATED_AutoDarkThemeIdentifier]: NativeFeatureIdentifier.TYPES.DarkTheme,
  [PrefKey.NoteAddToParentFolders]: true,
  [PrefKey.NewNoteTitleFormat]: NewNoteTitleFormat.CurrentDateAndTime,
  [PrefKey.CustomNoteTitleFormat]: 'YYYY-MM-DD [at] hh:mm A',
  [PrefKey.UpdateSavingStatusIndicator]: true,
  [PrefKey.PaneGesturesEnabled]: true,
  [PrefKey.MomentsDefaultTagUuid]: undefined,
  [PrefKey.ClipperDefaultTagUuid]: undefined,
  [PrefKey.DefaultEditorIdentifier]: NativeFeatureIdentifier.TYPES.PlainEditor,
  [PrefKey.SuperNoteExportFormat]: 'json',
  [PrefKey.SuperNoteExportEmbedBehavior]: 'reference',
  [PrefKey.SuperNoteExportUseMDFrontmatter]: true,
  [PrefKey.SuperNoteExportPDFPageSize]: 'A4',
  [PrefKey.SystemViewPreferences]: {},
  [PrefKey.AuthenticatorNames]: '',
  [PrefKey.ComponentPreferences]: {},
  [PrefKey.DEPRECATED_ActiveThemes]: [],
  [PrefKey.ActiveComponents]: [],
  [PrefKey.AlwaysShowSuperToolbar]: true,
  [PrefKey.AddImportsToTag]: true,
  [PrefKey.AlwaysCreateNewTagForImports]: true,
  [PrefKey.ExistingTagForImports]: undefined,
} satisfies {
  [key in PrefKey]: PrefValue[key]
}

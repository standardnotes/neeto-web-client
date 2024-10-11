import { LocalPrefKey, ApplicationStage } from '@standardnotes/services'
import { Migration } from '@Lib/Migrations/Migration'
import { PrefDefaults, PrefKey } from '@standardnotes/models'

export class Migration2_209_0 extends Migration {
  static override version(): string {
    return '2.209.0'
  }

  protected registerStageHandlers(): void {
    this.registerStageHandler(ApplicationStage.FullSyncCompleted_13, async () => {
      await this.migrateSyncedPreferencesToLocal()

      this.markDone()
    })
  }

  private async migrateSyncedPreferencesToLocal(): Promise<void> {
    this.services.preferences.setLocalValue(
      LocalPrefKey.EditorMonospaceEnabled,
      this.services.preferences.getValue(
        PrefKey.DEPRECATED_EditorMonospaceEnabled,
        PrefDefaults[LocalPrefKey.EditorMonospaceEnabled],
      ),
    )
    this.services.preferences.setLocalValue(
      LocalPrefKey.EditorFontSize,
      this.services.preferences.getValue(PrefKey.DEPRECATED_EditorFontSize, PrefDefaults[LocalPrefKey.EditorFontSize]),
    )
    this.services.preferences.setLocalValue(
      LocalPrefKey.EditorLineWidth,
      this.services.preferences.getValue(
        PrefKey.DEPRECATED_EditorLineWidth,
        PrefDefaults[LocalPrefKey.EditorLineWidth],
      ),
    )
    this.services.preferences.setLocalValue(
      LocalPrefKey.EditorLineHeight,
      this.services.preferences.getValue(
        PrefKey.DEPRECATED_EditorLineHeight,
        PrefDefaults[LocalPrefKey.EditorLineHeight],
      ),
    )
  }
}

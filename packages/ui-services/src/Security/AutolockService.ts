import {
  AbstractService,
  ApplicationEvent,
  ApplicationInterface,
  InternalEventBusInterface,
} from '@standardnotes/services'

const MILLISECONDS_PER_SECOND = 1000
const POLL_INTERVAL = 50

const LockInterval = {
  None: 0,
  Immediate: 1,
  OneMinute: 60 * MILLISECONDS_PER_SECOND,
  FiveMinutes: 300 * MILLISECONDS_PER_SECOND,
  TenMinutes: 600 * MILLISECONDS_PER_SECOND,
  OneHour: 3600 * MILLISECONDS_PER_SECOND,
}

const STORAGE_KEY_AUTOLOCK_INTERVAL = 'AutoLockIntervalKey'

export class AutolockService extends AbstractService {
  private unsubApp!: () => void

  private pollInterval: ReturnType<typeof setInterval> | undefined
  private lastFocusState?: 'hidden' | 'visible'
  private lockAfterDate?: Date

  constructor(
    protected application: ApplicationInterface,
    protected override internalEventBus: InternalEventBusInterface,
  ) {
    super(internalEventBus)
    this.addAppEventObserverAfterSubclassesFinishConstructing()
  }

  onAppLaunch() {
    this.beginPolling()
  }

  override deinit() {
    this.cancelAutoLockTimer()
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }

    ;(this.application as unknown) = undefined

    this.unsubApp()
    ;(this.unsubApp as unknown) = undefined

    super.deinit()
  }

  addAppEventObserverAfterSubclassesFinishConstructing() {
    setTimeout(() => {
      this.addAppEventObserver()
    }, 0)
  }

  addAppEventObserver() {
    if (this.application.isLaunched()) {
      void this.onAppLaunch()
    }

    this.unsubApp = this.application.addEventObserver(async (event: ApplicationEvent) => {
      if (event === ApplicationEvent.Launched) {
        void this.onAppLaunch()
      }
    })
  }

  private lockApplication() {
    if (!this.application.hasPasscode()) {
      throw Error('Attempting to lock application with no passcode')
    }
    this.application.lock().catch(console.error)
  }

  async setAutoLockInterval(interval: number) {
    return this.application.setValue(STORAGE_KEY_AUTOLOCK_INTERVAL, interval)
  }

  async getAutoLockInterval() {
    const interval = (await this.application.getValue(STORAGE_KEY_AUTOLOCK_INTERVAL)) as number
    if (interval) {
      return interval
    } else {
      return LockInterval.None
    }
  }

  async deleteAutolockPreference() {
    await this.application.removeValue(STORAGE_KEY_AUTOLOCK_INTERVAL)
    this.cancelAutoLockTimer()
  }

  /**
   *  Verify document is in focus every so often as visibilitychange event is
   *  not triggered on a typical window blur event but rather on tab changes.
   */
  beginPolling() {
    this.pollInterval = setInterval(async () => {
      const locked = await this.application.protections.isLocked()
      if (!locked && this.lockAfterDate && new Date() > this.lockAfterDate) {
        this.lockApplication()
      }
      const hasFocus = document.hasFocus()
      if (hasFocus && this.lastFocusState === 'hidden') {
        this.documentVisibilityChanged(true).catch(console.error)
      } else if (!hasFocus && this.lastFocusState === 'visible') {
        this.documentVisibilityChanged(false).catch(console.error)
      }
      /* Save this to compare against next time around */
      this.lastFocusState = hasFocus ? 'visible' : 'hidden'
    }, POLL_INTERVAL)
  }

  getAutoLockIntervalOptions() {
    return [
      {
        value: LockInterval.None,
        label: 'Off',
      },
      {
        value: LockInterval.Immediate,
        label: 'Immediately',
      },
      {
        value: LockInterval.OneMinute,
        label: '1m',
      },
      {
        value: LockInterval.FiveMinutes,
        label: '5m',
      },
      {
        value: LockInterval.TenMinutes,
        label: '10m',
      },
      {
        value: LockInterval.OneHour,
        label: '1h',
      },
    ]
  }

  async documentVisibilityChanged(visible: boolean) {
    if (visible) {
      this.cancelAutoLockTimer()
    } else {
      this.beginAutoLockTimer().catch(console.error)
    }
  }

  async beginAutoLockTimer() {
    const interval = await this.getAutoLockInterval()
    if (interval === LockInterval.None) {
      return
    }
    const addToNow = (seconds: number) => {
      const date = new Date()
      date.setSeconds(date.getSeconds() + seconds)
      return date
    }
    this.lockAfterDate = addToNow(interval / MILLISECONDS_PER_SECOND)
  }

  cancelAutoLockTimer() {
    this.lockAfterDate = undefined
  }
}

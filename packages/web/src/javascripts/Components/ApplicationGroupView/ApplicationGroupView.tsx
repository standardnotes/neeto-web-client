import { WebApplicationGroup } from '@/Application/WebApplicationGroup'
import { WebApplication } from '@/Application/WebApplication'
import { Component } from 'react'
import ApplicationView from '@/Components/ApplicationView/ApplicationView'
import { WebOrDesktopDevice } from '@/Application/Device/WebOrDesktopDevice'
import { ApplicationGroupEvent, ApplicationGroupEventData, DeinitSource } from '@standardnotes/snjs'
import { getPlatformString, isDesktopApplication } from '@/Utils'
import DeallocateHandler from '../DeallocateHandler/DeallocateHandler'
import { IS_CHROME } from '../../Constants/Constants'

type Props = {
  server: string
  device: WebOrDesktopDevice
  enableUnfinished: boolean
  websocketUrl: string
  onDestroy: () => void
}

type State = {
  activeApplication?: WebApplication
  dealloced?: boolean
  deallocSource?: DeinitSource
  deviceDestroyed?: boolean
}

const renderDialog = (message: string) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-passive-5" role="alert">
      <div
        className={
          'challenge-modal shadow-overlay-light relative flex max-w-125 flex-col items-center rounded border border-solid border-border bg-default p-6'
        }
      >
        <div className="text-base lg:text-xs">{message}</div>
      </div>
    </div>
  )
}

class ApplicationGroupView extends Component<Props, State> {
  applicationObserverRemover?: () => void
  private group?: WebApplicationGroup
  private application?: WebApplication

  constructor(props: Props) {
    super(props)

    if (props.device.isDeviceDestroyed()) {
      this.state = {
        deviceDestroyed: true,
      }

      return
    }

    this.group = new WebApplicationGroup(props.server, props.device, props.websocketUrl)

    window.mainApplicationGroup = this.group

    this.applicationObserverRemover = this.group.addEventObserver((event, data) => {
      if (event === ApplicationGroupEvent.PrimaryApplicationSet) {
        const castData = data as ApplicationGroupEventData[ApplicationGroupEvent.PrimaryApplicationSet]

        this.application = castData.application as WebApplication
        this.setState({ activeApplication: this.application })
      } else if (event === ApplicationGroupEvent.DeviceWillRestart) {
        const castData = data as ApplicationGroupEventData[ApplicationGroupEvent.DeviceWillRestart]

        this.setState({ dealloced: true, deallocSource: castData.source })
      }
    })

    this.state = {}

    this.group.initialize().catch(console.error)

    const platformString = getPlatformString()
    if (!document.body.classList.contains(platformString)) {
      document.body.classList.add(platformString)
    }
    if (IS_CHROME) {
      document.body.classList.add('chromium')
    }
  }

  deinit() {
    this.application = undefined

    this.applicationObserverRemover?.()
    ;(this.applicationObserverRemover as unknown) = undefined

    this.group?.deinit()
    ;(this.group as unknown) = undefined

    this.setState({ dealloced: true, activeApplication: undefined })

    const onDestroy = this.props.onDestroy

    onDestroy()
  }

  override render() {
    if (this.state.deviceDestroyed) {
      const message = `Secure memory has destroyed this application instance. ${
        isDesktopApplication()
          ? 'Restart the app to continue.'
          : 'Close this browser tab and open a new one to continue.'
      }`

      return renderDialog(message)
    }

    if (this.state.dealloced) {
      const message = this.state.deallocSource === DeinitSource.Lock ? 'Locking workspace...' : 'Switching workspace...'
      return renderDialog(message)
    }

    if (!this.group || !this.state.activeApplication || this.state.activeApplication.dealloced) {
      return null
    }

    return (
      <div
        id={this.state.activeApplication.identifier}
        className={'h-full'}
        key={this.state.activeApplication.ephemeralIdentifier}
      >
        <DeallocateHandler application={this.state.activeApplication}>
          <ApplicationView
            key={this.state.activeApplication.ephemeralIdentifier}
            mainApplicationGroup={this.group}
            application={this.state.activeApplication}
          />
        </DeallocateHandler>
      </div>
    )
  }
}

export default ApplicationGroupView

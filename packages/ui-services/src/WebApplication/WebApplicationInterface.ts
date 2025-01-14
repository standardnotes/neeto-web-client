import {
  ApplicationInterface,
  DesktopDeviceInterface,
  DesktopManagerInterface,
  MobileDeviceInterface,
  WebAppEvent,
} from '@standardnotes/services'
import { KeyboardService } from '../Keyboard/KeyboardService'
import { RouteServiceInterface } from '../Route/RouteServiceInterface'

export interface WebApplicationInterface extends ApplicationInterface {
  notifyWebEvent(event: WebAppEvent, data?: unknown): void
  handleMobileEnteringBackgroundEvent(): Promise<void>
  handleMobileGainingFocusEvent(): Promise<void>
  handleMobileLosingFocusEvent(): Promise<void>
  handleMobileResumingFromBackgroundEvent(): Promise<void>
  handleMobileColorSchemeChangeEvent(): void
  handleMobileKeyboardWillChangeFrameEvent(frame: {
    height: number
    contentHeight: number
    isFloatingKeyboard: boolean
  }): void
  handleMobileKeyboardDidChangeFrameEvent(frame: { height: number; contentHeight: number }): void
  handleReceivedFileEvent(file: { name: string; mimeType: string; data: string }): void
  handleReceivedTextEvent(item: { text: string; title?: string }): Promise<void>
  handleReceivedLinkEvent(item: { link: string; title: string }): Promise<void>
  handleOpenFilePreviewEvent(item: { id: string }): void
  isNativeMobileWeb(): boolean
  isWebApp(): boolean
  handleAndroidBackButtonPressed(): void
  addAndroidBackHandlerEventListener(listener: () => boolean): (() => void) | undefined
  setAndroidBackHandlerFallbackListener(listener: () => boolean): void
  handleInitialMobileScreenshotPrivacy(): void
  generateUUID(): string
  checkForSecurityUpdate(): Promise<boolean>

  get desktopManager(): DesktopManagerInterface | undefined
  get mobileDevice(): MobileDeviceInterface
  get isMobileDevice(): boolean
  get desktopDevice(): DesktopDeviceInterface | undefined
  get keyboardService(): KeyboardService
  get routeService(): RouteServiceInterface
}

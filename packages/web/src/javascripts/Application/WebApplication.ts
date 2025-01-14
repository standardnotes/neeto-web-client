import { WebCrypto } from '@/Application/Crypto'
import { WebOrDesktopDevice } from '@/Application/Device/WebOrDesktopDevice'
import {
  DeinitSource,
  Platform,
  SNApplication,
  DesktopDeviceInterface,
  isDesktopDevice,
  DeinitMode,
  PrefKey,
  SNTag,
  ContentType,
  DecryptedItemInterface,
  WebAppEvent,
  MobileDeviceInterface,
  MobileUnlockTiming,
  DecryptedItem,
  Environment,
  ApplicationOptionsDefaults,
  InternalFeatureService,
  InternalFeatureServiceInterface,
  NoteContent,
  SNNote,
  DesktopManagerInterface,
  FileItem,
  ApiVersion,
} from '@standardnotes/snjs'
import { action, computed, makeObservable, observable } from 'mobx'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { PanelResizedData } from '@/Types/PanelResizedData'
import { getBlobFromBase64, isDesktopApplication, isDev } from '@/Utils'
import {
  ArchiveManager,
  AutolockService,
  ChangelogService,
  Importer,
  IsGlobalSpellcheckEnabled,
  IsMobileDevice,
  IsNativeIOS,
  IsNativeMobileWeb,
  IsWebApp,
  KeyboardService,
  PluginsServiceInterface,
  RouteServiceInterface,
  ThemeManager,
  VaultDisplayServiceInterface,
  WebAlertService,
  WebApplicationInterface,
} from '@standardnotes/ui-services'
import { PreferencePaneId } from '@standardnotes/services'
import { MobileWebReceiver, NativeMobileEventListener } from '../NativeMobileWeb/MobileWebReceiver'
import { setCustomViewportHeight } from '@/setViewportHeightWithFallback'
import { FeatureName } from '@/Controllers/FeatureName'
import { VisibilityObserver } from './VisibilityObserver'
import { DevMode } from './DevMode'
import { ToastType, addToast, dismissToast } from '@standardnotes/toast'
import { WebDependencies } from './Dependencies/WebDependencies'
import { Web_TYPES } from './Dependencies/Types'
import { ApplicationEventObserver } from '@/Event/ApplicationEventObserver'
import { PaneController } from '@/Controllers/PaneController/PaneController'
import { LinkingController } from '@/Controllers/LinkingController'
import { MomentsService } from '@/Controllers/Moments/MomentsService'
import { FeaturesController } from '@/Controllers/FeaturesController'
import { FilesController } from '@/Controllers/FilesController'
import { ItemListController } from '@/Controllers/ItemList/ItemListController'
import { AndroidBackHandler } from '@/NativeMobileWeb/AndroidBackHandler'
import { SubscriptionController } from '@/Controllers/Subscription/SubscriptionController'
import { PurchaseFlowController } from '@/Controllers/PurchaseFlow/PurchaseFlowController'
import { AccountMenuController } from '@/Controllers/AccountMenu/AccountMenuController'
import { PreferencesController } from '@/Controllers/PreferencesController'
import { NotesController } from '@/Controllers/NotesController/NotesController'
import { ImportModalController } from '@/Components/ImportModal/ImportModalController'
import { SyncStatusController } from '@/Controllers/SyncStatusController'
import { HistoryModalController } from '@/Controllers/NoteHistory/HistoryModalController'
import { NavigationController } from '@/Controllers/Navigation/NavigationController'
import { FilePreviewModalController } from '@/Controllers/FilePreviewModalController'
import { OpenSubscriptionDashboard } from './UseCase/OpenSubscriptionDashboard'
import { ItemGroupController } from '@/Components/NoteView/Controller/ItemGroupController'
import { NoAccountWarningController } from '@/Controllers/NoAccountWarningController'
import { SearchOptionsController } from '@/Controllers/SearchOptionsController'
import { PersistenceService } from '@/Controllers/Abstract/PersistenceService'
import { removeFromArray } from '@standardnotes/utils'
import { FileItemActionType } from '@/Components/AttachedFilesPopover/PopoverFileItemAction'

export type WebEventObserver = (event: WebAppEvent, data?: unknown) => void

export class WebApplication extends SNApplication implements WebApplicationInterface {
  readonly enableUnfinishedFeatures: boolean = window?.enabledUnfinishedFeatures

  private readonly deps = new WebDependencies(this)

  private visibilityObserver?: VisibilityObserver
  private readonly webEventObservers: WebEventObserver[] = []
  private disposers: (() => void)[] = []

  public isSessionsModalVisible = false

  public devMode?: DevMode

  constructor(
    deviceInterface: WebOrDesktopDevice,
    platform: Platform,
    identifier: string,
    defaultSyncServerHost: string,
    webSocketUrl: string,
  ) {
    super({
      environment: deviceInterface.environment,
      platform: platform,
      deviceInterface: deviceInterface,
      crypto: WebCrypto,
      alertService: new WebAlertService(),
      identifier,
      defaultHost: defaultSyncServerHost,
      appVersion: deviceInterface.appVersion,
      webSocketUrl: webSocketUrl,
      /**
       * iOS file:// based origin does not work with production cookies
       */
      apiVersion: platform === Platform.Ios || platform === Platform.Android ? ApiVersion.v0 : ApiVersion.v1,
      loadBatchSize:
        deviceInterface.environment === Environment.Mobile ? 250 : ApplicationOptionsDefaults.loadBatchSize,
      sleepBetweenBatches:
        deviceInterface.environment === Environment.Mobile ? 250 : ApplicationOptionsDefaults.sleepBetweenBatches,
      allowMultipleSelection: deviceInterface.environment !== Environment.Mobile,
      allowNoteSelectionStatePersistence: deviceInterface.environment !== Environment.Mobile,
      u2fAuthenticatorRegistrationPromptFunction: startRegistration as unknown as (
        registrationOptions: Record<string, unknown>,
      ) => Promise<Record<string, unknown>>,
      u2fAuthenticatorVerificationPromptFunction: startAuthentication as unknown as (
        authenticationOptions: Record<string, unknown>,
      ) => Promise<Record<string, unknown>>,
    })

    makeObservable(this, {
      dealloced: observable,

      preferencesController: computed,

      isSessionsModalVisible: observable,

      openSessionsModal: action,
      closeSessionsModal: action,
    })

    this.createBackgroundServices()
  }

  private createBackgroundServices(): void {
    void this.mobileWebReceiver
    void this.autolockService
    void this.persistence
    if (this.environment !== Environment.Clipper) {
      void this.themeManager
    }
    void this.momentsService
    void this.routeService

    if (isDev) {
      this.devMode = new DevMode(this)
    }

    if (!this.isNativeMobileWeb()) {
      this.webOrDesktopDevice.setApplication(this)
    }

    const appEventObserver = this.deps.get<ApplicationEventObserver>(Web_TYPES.ApplicationEventObserver)
    this.disposers.push(this.addEventObserver(appEventObserver.handle.bind(appEventObserver)))

    if (this.isNativeMobileWeb()) {
      this.disposers.push(
        this.addEventObserver(async (event) => {
          this.mobileDevice.notifyApplicationEvent(event)
        }),
      )

      // eslint-disable-next-line no-console
      console.log = (...args) => {
        this.mobileDevice.consoleLog(...args)
      }
    }

    if (!isDesktopApplication()) {
      this.visibilityObserver = new VisibilityObserver((event) => {
        this.notifyWebEvent(event)
      })
    }
  }

  override deinit(mode: DeinitMode, source: DeinitSource): void {
    if (!this.isNativeMobileWeb()) {
      this.webOrDesktopDevice.removeApplication(this)
    }

    super.deinit(mode, source)

    for (const disposer of this.disposers) {
      disposer()
    }
    this.disposers.length = 0

    this.deps.deinit()

    try {
      this.webEventObservers.length = 0

      if (this.visibilityObserver) {
        this.visibilityObserver.deinit()
        ;(this.visibilityObserver as unknown) = undefined
      }
    } catch (error) {
      console.error('Error while deiniting application', error)
    }
  }

  public addWebEventObserver(observer: WebEventObserver): () => void {
    this.webEventObservers.push(observer)

    return () => {
      removeFromArray(this.webEventObservers, observer)
    }
  }

  public notifyWebEvent(event: WebAppEvent, data?: unknown): void {
    for (const observer of this.webEventObservers) {
      observer(event, data)
    }

    this.events.publish({ type: event, payload: data })
  }

  publishPanelDidResizeEvent(name: string, width: number, collapsed: boolean) {
    const data: PanelResizedData = {
      panel: name,
      collapsed,
      width,
    }

    this.notifyWebEvent(WebAppEvent.PanelResized, data)
  }

  public get desktopDevice(): DesktopDeviceInterface | undefined {
    if (isDesktopDevice(this.device)) {
      return this.device
    }

    return undefined
  }

  public getInternalFeatureService(): InternalFeatureServiceInterface {
    return InternalFeatureService.get()
  }

  isNativeIOS(): boolean {
    return this.deps.get<IsNativeIOS>(Web_TYPES.IsNativeIOS).execute().getValue()
  }

  get isMobileDevice(): boolean {
    return this.deps.get<IsMobileDevice>(Web_TYPES.IsMobileDevice).execute().getValue()
  }

  get hideOutboundSubscriptionLinks() {
    return this.isNativeIOS()
  }

  get mobileDevice(): MobileDeviceInterface {
    return this.device as MobileDeviceInterface
  }

  get webOrDesktopDevice(): WebOrDesktopDevice {
    return this.device as WebOrDesktopDevice
  }

  async checkForSecurityUpdate(): Promise<boolean> {
    return this.protocolUpgradeAvailable()
  }

  performDesktopTextBackup(): void | Promise<void> {
    return this.desktopManager?.saveDesktopBackup()
  }

  isGlobalSpellcheckEnabled(): boolean {
    return this.deps.get<IsGlobalSpellcheckEnabled>(Web_TYPES.IsGlobalSpellcheckEnabled).execute().getValue()
  }

  public getItemTags(item: DecryptedItemInterface) {
    return this.items.itemsReferencingItem<SNTag>(item).filter((ref) => {
      return ref.content_type === ContentType.TYPES.Tag
    })
  }

  public get version(): string {
    return (this.device as WebOrDesktopDevice).appVersion
  }

  async toggleGlobalSpellcheck() {
    const currentValue = this.isGlobalSpellcheckEnabled()
    return this.setPreference(PrefKey.EditorSpellcheck, !currentValue)
  }

  async handleMobileEnteringBackgroundEvent(): Promise<void> {
    await this.lockApplicationAfterMobileEventIfApplicable()
  }

  async handleMobileGainingFocusEvent(): Promise<void> {
    /** Optional override */
  }

  handleInitialMobileScreenshotPrivacy(): void {
    if (this.platform !== Platform.Android) {
      return
    }

    if (this.protections.getMobileScreenshotPrivacyEnabled()) {
      this.mobileDevice.setAndroidScreenshotPrivacy(true)
    } else {
      this.mobileDevice.setAndroidScreenshotPrivacy(false)
    }
  }

  async handleMobileLosingFocusEvent(): Promise<void> {
    if (this.protections.getMobileScreenshotPrivacyEnabled()) {
      this.mobileDevice.stopHidingMobileInterfaceFromScreenshots()
    }

    await this.lockApplicationAfterMobileEventIfApplicable()
  }

  async handleMobileResumingFromBackgroundEvent(): Promise<void> {
    if (this.protections.getMobileScreenshotPrivacyEnabled()) {
      this.mobileDevice.hideMobileInterfaceFromScreenshots()
    }
  }

  handleMobileColorSchemeChangeEvent() {
    void this.themeManager.handleMobileColorSchemeChangeEvent()
  }

  openSessionsModal = () => {
    this.isSessionsModalVisible = true
  }

  closeSessionsModal = () => {
    this.isSessionsModalVisible = false
  }

  handleMobileKeyboardWillChangeFrameEvent(frame: {
    height: number
    contentHeight: number
    isFloatingKeyboard: boolean
  }): void {
    if (frame.contentHeight > 0) {
      setCustomViewportHeight(frame.contentHeight, 'px', true)
    }
    if (frame.isFloatingKeyboard) {
      setCustomViewportHeight(100, 'vh', true)
    }
    this.notifyWebEvent(WebAppEvent.MobileKeyboardWillChangeFrame, frame)
  }

  handleMobileKeyboardDidChangeFrameEvent(frame: { height: number; contentHeight: number }): void {
    this.notifyWebEvent(WebAppEvent.MobileKeyboardDidChangeFrame, frame)
  }

  handleOpenFilePreviewEvent({ id }: { id: string }): void {
    const file = this.items.findItem<FileItem>(id)
    if (!file) {
      return
    }
    this.filesController
      .handleFileAction({
        type: FileItemActionType.PreviewFile,
        payload: {
          file,
        },
      })
      .catch(console.error)
  }

  handleReceivedFileEvent(file: { name: string; mimeType: string; data: string }): void {
    const filesController = this.filesController
    const blob = getBlobFromBase64(file.data, file.mimeType)
    const mappedFile = new File([blob], file.name, { type: file.mimeType })
    filesController.uploadNewFile(mappedFile).catch(console.error)
  }

  async handleReceivedTextEvent({ text, title }: { text: string; title?: string | undefined }) {
    const titleForNote = title || this.itemListController.titleForNewNote()

    const note = this.items.createTemplateItem<NoteContent, SNNote>(ContentType.TYPES.Note, {
      title: titleForNote,
      text: text,
      references: [],
    })

    const insertedNote = await this.mutator.insertItem(note)

    this.itemListController.selectItem(insertedNote.uuid, true).catch(console.error)

    addToast({
      type: ToastType.Success,
      message: 'Successfully created note from shared text',
    })
  }

  async handleReceivedLinkEvent({ link, title }: { link: string; title: string | undefined }) {
    const url = new URL(link)
    const paths = url.pathname.split('/')
    const finalPath = paths[paths.length - 1]
    const isImagePath = !!finalPath && /\.(png|svg|webp|jpe?g)/.test(finalPath)

    if (isImagePath) {
      const fetchToastUuid = addToast({
        type: ToastType.Loading,
        message: 'Fetching image from link...',
      })
      try {
        const imgResponse = await fetch(link)
        if (!imgResponse.ok) {
          throw new Error(`${imgResponse.status}: Could not fetch image`)
        }
        const imgBlob = await imgResponse.blob()
        const file = new File([imgBlob], finalPath, {
          type: imgBlob.type,
        })
        this.filesController.uploadNewFile(file).catch(console.error)
      } catch (error) {
        console.error(error)
      } finally {
        dismissToast(fetchToastUuid)
      }
      return
    }

    this.handleReceivedTextEvent({
      title: title,
      text: link,
    }).catch(console.error)
  }

  private async lockApplicationAfterMobileEventIfApplicable(): Promise<void> {
    const isLocked = await this.protections.isLocked()
    if (isLocked) {
      return
    }

    const hasBiometrics = this.protections.hasBiometricsEnabled()
    const hasPasscode = this.hasPasscode()
    const passcodeTiming = this.protections.getMobilePasscodeTiming()
    const biometricsTiming = this.protections.getMobileBiometricsTiming()

    const passcodeLockImmediately = hasPasscode && passcodeTiming === MobileUnlockTiming.Immediately
    const biometricsLockImmediately = hasBiometrics && biometricsTiming === MobileUnlockTiming.Immediately

    if (passcodeLockImmediately) {
      await this.lock()
    } else if (biometricsLockImmediately) {
      this.protections.softLockBiometrics()
    }
  }

  handleAndroidBackButtonPressed(): void {
    if (typeof this.androidBackHandler !== 'undefined') {
      this.androidBackHandler.notifyEvent()
    }
  }

  addAndroidBackHandlerEventListener(listener: () => boolean) {
    if (typeof this.androidBackHandler !== 'undefined') {
      return this.androidBackHandler.addEventListener(listener)
    }
    return
  }

  setAndroidBackHandlerFallbackListener(listener: () => boolean) {
    if (typeof this.androidBackHandler !== 'undefined') {
      this.androidBackHandler.setFallbackListener(listener)
    }
  }

  isAuthorizedToRenderItem(item: DecryptedItem): boolean {
    if (item.protected && this.hasProtectionSources()) {
      return this.protections.hasUnprotectedAccessSession()
    }

    return true
  }

  entitledToPerTagPreferences(): boolean {
    return this.hasValidFirstPartySubscription()
  }

  get entitledToFiles(): boolean {
    return this.featuresController.entitledToFiles
  }

  showPremiumModal(featureName?: FeatureName): void {
    void this.featuresController.showPremiumAlert(featureName)
  }

  hasValidFirstPartySubscription(): boolean {
    return this.subscriptionController.hasFirstPartyOnlineOrOfflineSubscription()
  }

  async openPurchaseFlow() {
    await this.purchaseFlowController.openPurchaseFlow()
  }

  addNativeMobileEventListener = (listener: NativeMobileEventListener) => {
    if (!this.mobileWebReceiver) {
      return
    }

    return this.mobileWebReceiver.addReactListener(listener)
  }

  showAccountMenu(): void {
    this.accountMenuController.setShow(true)
  }

  hideAccountMenu(): void {
    this.accountMenuController.setShow(false)
  }

  /**
   * Full U2F clients are only web browser clients. They support adding and removing keys as well as authentication.
   * The desktop and mobile clients cannot support adding keys.
   */
  get isFullU2FClient(): boolean {
    return this.environment === Environment.Web
  }

  openPreferences(pane?: PreferencePaneId): void {
    this.preferencesController.openPreferences()
    if (pane) {
      this.preferencesController.setCurrentPane(pane)
    }
  }

  generateUUID(): string {
    return this.options.crypto.generateUUID()
  }

  /**
   * Dependency
   * Accessors
   */

  get routeService(): RouteServiceInterface {
    return this.deps.get<RouteServiceInterface>(Web_TYPES.RouteService)
  }

  get androidBackHandler(): AndroidBackHandler {
    return this.deps.get<AndroidBackHandler>(Web_TYPES.AndroidBackHandler)
  }

  get vaultDisplayService(): VaultDisplayServiceInterface {
    return this.deps.get<VaultDisplayServiceInterface>(Web_TYPES.VaultDisplayService)
  }

  get desktopManager(): DesktopManagerInterface | undefined {
    return this.deps.get<DesktopManagerInterface | undefined>(Web_TYPES.DesktopManager)
  }

  get autolockService(): AutolockService | undefined {
    return this.deps.get<AutolockService | undefined>(Web_TYPES.AutolockService)
  }

  get archiveService(): ArchiveManager {
    return this.deps.get<ArchiveManager>(Web_TYPES.ArchiveManager)
  }

  get paneController(): PaneController {
    return this.deps.get<PaneController>(Web_TYPES.PaneController)
  }

  get linkingController(): LinkingController {
    return this.deps.get<LinkingController>(Web_TYPES.LinkingController)
  }

  get changelogService(): ChangelogService {
    return this.deps.get<ChangelogService>(Web_TYPES.ChangelogService)
  }

  get pluginsService(): PluginsServiceInterface {
    return this.deps.get<PluginsServiceInterface>(Web_TYPES.PluginsService)
  }

  get momentsService(): MomentsService {
    return this.deps.get<MomentsService>(Web_TYPES.MomentsService)
  }

  get themeManager(): ThemeManager {
    return this.deps.get<ThemeManager>(Web_TYPES.ThemeManager)
  }

  get keyboardService(): KeyboardService {
    return this.deps.get<KeyboardService>(Web_TYPES.KeyboardService)
  }

  get featuresController(): FeaturesController {
    return this.deps.get<FeaturesController>(Web_TYPES.FeaturesController)
  }

  get filesController(): FilesController {
    return this.deps.get<FilesController>(Web_TYPES.FilesController)
  }

  get filePreviewModalController(): FilePreviewModalController {
    return this.deps.get<FilePreviewModalController>(Web_TYPES.FilePreviewModalController)
  }

  get notesController(): NotesController {
    return this.deps.get<NotesController>(Web_TYPES.NotesController)
  }

  get importModalController(): ImportModalController {
    return this.deps.get<ImportModalController>(Web_TYPES.ImportModalController)
  }

  get navigationController(): NavigationController {
    return this.deps.get<NavigationController>(Web_TYPES.NavigationController)
  }

  get historyModalController(): HistoryModalController {
    return this.deps.get<HistoryModalController>(Web_TYPES.HistoryModalController)
  }

  get syncStatusController(): SyncStatusController {
    return this.deps.get<SyncStatusController>(Web_TYPES.SyncStatusController)
  }

  get itemListController(): ItemListController {
    return this.deps.get<ItemListController>(Web_TYPES.ItemListController)
  }

  get importer(): Importer {
    return this.deps.get<Importer>(Web_TYPES.Importer)
  }

  get subscriptionController(): SubscriptionController {
    return this.deps.get<SubscriptionController>(Web_TYPES.SubscriptionController)
  }

  get purchaseFlowController(): PurchaseFlowController {
    return this.deps.get<PurchaseFlowController>(Web_TYPES.PurchaseFlowController)
  }

  get persistence(): PersistenceService {
    return this.deps.get<PersistenceService>(Web_TYPES.PersistenceService)
  }

  get itemControllerGroup(): ItemGroupController {
    return this.deps.get<ItemGroupController>(Web_TYPES.ItemGroupController)
  }

  get noAccountWarningController(): NoAccountWarningController {
    return this.deps.get<NoAccountWarningController>(Web_TYPES.NoAccountWarningController)
  }

  get searchOptionsController(): SearchOptionsController {
    return this.deps.get<SearchOptionsController>(Web_TYPES.SearchOptionsController)
  }

  get openSubscriptionDashboard(): OpenSubscriptionDashboard {
    return this.deps.get<OpenSubscriptionDashboard>(Web_TYPES.OpenSubscriptionDashboard)
  }

  get mobileWebReceiver(): MobileWebReceiver | undefined {
    return this.deps.get<MobileWebReceiver | undefined>(Web_TYPES.MobileWebReceiver)
  }

  get accountMenuController(): AccountMenuController {
    return this.deps.get<AccountMenuController>(Web_TYPES.AccountMenuController)
  }

  get preferencesController(): PreferencesController {
    return this.deps.get<PreferencesController>(Web_TYPES.PreferencesController)
  }

  get isNativeMobileWebUseCase(): IsNativeMobileWeb {
    return this.deps.get<IsNativeMobileWeb>(Web_TYPES.IsNativeMobileWeb)
  }

  get isWebAppUseCase(): IsWebApp {
    return this.deps.get<IsWebApp>(Web_TYPES.IsWebApp)
  }
}

import {
  ArchiveManager,
  AutolockService,
  ChangelogService,
  GetItemTags,
  Importer,
  IsGlobalSpellcheckEnabled,
  IsMobileDevice,
  IsNativeIOS,
  IsNativeMobileWeb,
  IsWebApp,
  KeyboardService,
  PluginsService,
  RouteService,
  ThemeManager,
  ToastService,
  VaultDisplayService,
  WebApplicationInterface,
} from '@standardnotes/ui-services'
import { DependencyContainer } from '@standardnotes/utils'
import { Web_TYPES } from './Types'
import { BackupServiceInterface, GetHost, IsApplicationUsingThirdPartyHost, isDesktopDevice } from '@standardnotes/snjs'
import { DesktopManager } from '../Device/DesktopManager'
import { MomentsService } from '@/Controllers/Moments/MomentsService'
import { PersistenceService } from '@/Controllers/Abstract/PersistenceService'
import { FilePreviewModalController } from '@/Controllers/FilePreviewModalController'
import { PaneController } from '@/Controllers/PaneController/PaneController'
import { PreferencesController } from '@/Controllers/PreferencesController'
import { FeaturesController } from '@/Controllers/FeaturesController'
import { NavigationController } from '@/Controllers/Navigation/NavigationController'
import { NotesController } from '@/Controllers/NotesController/NotesController'
import { ItemListController } from '@/Controllers/ItemList/ItemListController'
import { NoAccountWarningController } from '@/Controllers/NoAccountWarningController'
import { AccountMenuController } from '@/Controllers/AccountMenu/AccountMenuController'
import { SubscriptionController } from '@/Controllers/Subscription/SubscriptionController'
import { PurchaseFlowController } from '@/Controllers/PurchaseFlow/PurchaseFlowController'
import { FilesController } from '@/Controllers/FilesController'
import { HistoryModalController } from '@/Controllers/NoteHistory/HistoryModalController'
import { ImportModalController } from '@/Components/ImportModal/ImportModalController'
import { ApplicationEventObserver } from '@/Event/ApplicationEventObserver'
import { SearchOptionsController } from '@/Controllers/SearchOptionsController'
import { LinkingController } from '@/Controllers/LinkingController'
import { SyncStatusController } from '@/Controllers/SyncStatusController'
import { ActionsMenuController } from '@/Controllers/ActionsMenuController'
import { ItemGroupController } from '@/Components/NoteView/Controller/ItemGroupController'
import { MobileWebReceiver } from '@/NativeMobileWeb/MobileWebReceiver'
import { AndroidBackHandler } from '@/NativeMobileWeb/AndroidBackHandler'
import { IsTabletOrMobileScreen } from '../UseCase/IsTabletOrMobileScreen'
import { PanesForLayout } from '../UseCase/PanesForLayout'
import { LoadPurchaseFlowUrl } from '../UseCase/LoadPurchaseFlowUrl'
import { GetPurchaseFlowUrl } from '../UseCase/GetPurchaseFlowUrl'
import { OpenSubscriptionDashboard } from '../UseCase/OpenSubscriptionDashboard'
import { HeadlessSuperConverter } from '@/Components/SuperEditor/Tools/HeadlessSuperConverter'

export class WebDependencies extends DependencyContainer {
  constructor(private application: WebApplicationInterface) {
    super()

    this.bind(Web_TYPES.SuperConverter, () => {
      return new HeadlessSuperConverter()
    })

    this.bind(Web_TYPES.Importer, () => {
      return new Importer(
        application.features,
        application.mutator,
        application.items,
        this.get<HeadlessSuperConverter>(Web_TYPES.SuperConverter),
        this.get<FilesController>(Web_TYPES.FilesController),
        this.get<LinkingController>(Web_TYPES.LinkingController),
        application.generateUuid,
        application.files,
      )
    })

    this.bind(Web_TYPES.IsNativeIOS, () => {
      return new IsNativeIOS(application.environment, application.platform)
    })

    this.bind(Web_TYPES.OpenSubscriptionDashboard, () => {
      return new OpenSubscriptionDashboard(application, application.legacyApi)
    })

    this.bind(Web_TYPES.IsNativeMobileWeb, () => {
      return new IsNativeMobileWeb(application.environment)
    })

    this.bind(Web_TYPES.IsWebApp, () => {
      return new IsWebApp(application.environment)
    })

    this.bind(Web_TYPES.IsGlobalSpellcheckEnabled, () => {
      return new IsGlobalSpellcheckEnabled(application.preferences)
    })

    this.bind(Web_TYPES.MobileWebReceiver, () => {
      if (!application.isNativeMobileWeb()) {
        return undefined
      }

      return new MobileWebReceiver(application)
    })

    this.bind(Web_TYPES.AndroidBackHandler, () => {
      if (!application.isNativeMobileWeb()) {
        return undefined
      }

      return new AndroidBackHandler()
    })

    this.bind(Web_TYPES.ItemGroupController, () => {
      return new ItemGroupController(
        application.items,
        application.mutator,
        application.sync,
        application.sessions,
        application.preferences,
        application.componentManager,
        application.alerts,
        this.get<IsNativeMobileWeb>(Web_TYPES.IsNativeMobileWeb),
      )
    })

    this.bind(Web_TYPES.RouteService, () => {
      return new RouteService(this.application, this.application.events)
    })

    this.bind(Web_TYPES.KeyboardService, () => {
      return new KeyboardService(application.platform, application.environment)
    })

    this.bind(Web_TYPES.ArchiveManager, () => {
      return new ArchiveManager(application)
    })

    this.bind(Web_TYPES.ThemeManager, () => {
      return new ThemeManager(application, application.preferences, application.componentManager, application.events)
    })

    this.bind(Web_TYPES.AutolockService, () => {
      return application.isNativeMobileWeb() ? undefined : new AutolockService(application, application.events)
    })

    this.bind(Web_TYPES.DesktopManager, () => {
      return isDesktopDevice(application.device)
        ? new DesktopManager(application, application.device, application.fileBackups as BackupServiceInterface)
        : undefined
    })

    this.bind(Web_TYPES.ChangelogService, () => {
      return new ChangelogService(application.environment, application.storage)
    })

    this.bind(Web_TYPES.PluginsService, () => {
      return new PluginsService(
        application.items,
        application.mutator,
        application.sync,
        application.legacyApi,
        application.alerts,
        application.options.crypto,
      )
    })

    this.bind(Web_TYPES.IsMobileDevice, () => {
      return new IsMobileDevice(this.get<IsNativeMobileWeb>(Web_TYPES.IsNativeMobileWeb))
    })

    this.bind(Web_TYPES.MomentsService, () => {
      return new MomentsService(
        this.get<FilesController>(Web_TYPES.FilesController),
        this.get<LinkingController>(Web_TYPES.LinkingController),
        application.storage,
        application.preferences,
        application.items,
        application.protections,
        application.desktopDevice,
        this.get<IsMobileDevice>(Web_TYPES.IsMobileDevice),
        application.events,
      )
    })

    this.bind(Web_TYPES.VaultDisplayService, () => {
      return new VaultDisplayService(application, application.events)
    })

    this.bind(Web_TYPES.PersistenceService, () => {
      return new PersistenceService(
        this.get<ItemListController>(Web_TYPES.ItemListController),
        this.get<NavigationController>(Web_TYPES.NavigationController),
        application.storage,
        application.items,
        application.sync,
        application.events,
      )
    })

    this.bind(Web_TYPES.FilePreviewModalController, () => {
      return new FilePreviewModalController(application.items)
    })

    this.bind(Web_TYPES.PaneController, () => {
      return new PaneController(
        application.preferences,
        this.get<KeyboardService>(Web_TYPES.KeyboardService),
        this.get<IsTabletOrMobileScreen>(Web_TYPES.IsTabletOrMobileScreen),
        this.get<PanesForLayout>(Web_TYPES.PanesForLayout),
        application.events,
      )
    })

    this.bind(Web_TYPES.PanesForLayout, () => {
      return new PanesForLayout(this.get<IsTabletOrMobileScreen>(Web_TYPES.IsTabletOrMobileScreen))
    })

    this.bind(Web_TYPES.GetHost, () => {
      return new GetHost(application.legacyApi)
    })

    this.bind(Web_TYPES.IsApplicationUsingThirdPartyHost, () => {
      return new IsApplicationUsingThirdPartyHost(this.get<GetHost>(Web_TYPES.GetHost))
    })

    this.bind(Web_TYPES.IsTabletOrMobileScreen, () => {
      return new IsTabletOrMobileScreen(application.environment)
    })

    this.bind(Web_TYPES.PreferencesController, () => {
      return new PreferencesController(this.get<RouteService>(Web_TYPES.RouteService), application.events)
    })

    this.bind(Web_TYPES.FeaturesController, () => {
      return new FeaturesController(application.features, application.events)
    })

    this.bind(Web_TYPES.NavigationController, () => {
      return new NavigationController(
        this.get<FeaturesController>(Web_TYPES.FeaturesController),
        this.get<VaultDisplayService>(Web_TYPES.VaultDisplayService),
        this.get<KeyboardService>(Web_TYPES.KeyboardService),
        this.get<PaneController>(Web_TYPES.PaneController),
        application.sync,
        application.mutator,
        application.items,
        application.preferences,
        application.alerts,
        application.changeAndSaveItem,
        application.events,
      )
    })

    this.bind(Web_TYPES.NotesController, () => {
      return new NotesController(
        this.get<ItemListController>(Web_TYPES.ItemListController),
        this.get<NavigationController>(Web_TYPES.NavigationController),
        this.get<ItemGroupController>(Web_TYPES.ItemGroupController),
        this.get<KeyboardService>(Web_TYPES.KeyboardService),
        application.preferences,
        application.items,
        application.mutator,
        application.sync,
        application.protections,
        application.alerts,
        this.get<IsGlobalSpellcheckEnabled>(Web_TYPES.IsGlobalSpellcheckEnabled),
        this.get<GetItemTags>(Web_TYPES.GetItemTags),
        application.events,
      )
    })

    this.bind(Web_TYPES.GetItemTags, () => {
      return new GetItemTags(application.items)
    })

    this.bind(Web_TYPES.SearchOptionsController, () => {
      return new SearchOptionsController(application.protections, application.events)
    })

    this.bind(Web_TYPES.LinkingController, () => {
      return new LinkingController(
        this.get<ItemListController>(Web_TYPES.ItemListController),
        this.get<FilesController>(Web_TYPES.FilesController),
        this.get<SubscriptionController>(Web_TYPES.SubscriptionController),
        this.get<NavigationController>(Web_TYPES.NavigationController),
        this.get<FeaturesController>(Web_TYPES.FeaturesController),
        this.get<ItemGroupController>(Web_TYPES.ItemGroupController),
        this.get<VaultDisplayService>(Web_TYPES.VaultDisplayService),
        application.preferences,
        application.items,
        application.mutator,
        application.sync,
        application.vaults,
        application.events,
      )
    })

    this.bind(Web_TYPES.ItemListController, () => {
      return new ItemListController(
        this.get<KeyboardService>(Web_TYPES.KeyboardService),
        this.get<PaneController>(Web_TYPES.PaneController),
        this.get<NavigationController>(Web_TYPES.NavigationController),
        this.get<SearchOptionsController>(Web_TYPES.SearchOptionsController),
        application.items,
        application.preferences,
        this.get<ItemGroupController>(Web_TYPES.ItemGroupController),
        this.get<VaultDisplayService>(Web_TYPES.VaultDisplayService),
        this.get<DesktopManager>(Web_TYPES.DesktopManager),
        application.protections,
        application.options,
        this.get<IsNativeMobileWeb>(Web_TYPES.IsNativeMobileWeb),
        application.changeAndSaveItem,
        application.events,
      )
    })

    this.bind(Web_TYPES.NoAccountWarningController, () => {
      return new NoAccountWarningController(application.sessions, application.events)
    })

    this.bind(Web_TYPES.AccountMenuController, () => {
      return new AccountMenuController(application.items, application.getHost, application.events)
    })

    this.bind(Web_TYPES.SubscriptionController, () => {
      return new SubscriptionController(
        application.subscriptions,
        application.sessions,
        application.features,
        application.events,
      )
    })

    this.bind(Web_TYPES.PurchaseFlowController, () => {
      return new PurchaseFlowController(
        application.sessions,
        application.subscriptions,
        application.legacyApi,
        application.alerts,
        application.mobileDevice,
        this.get<LoadPurchaseFlowUrl>(Web_TYPES.LoadPurchaseFlowUrl),
        this.get<IsNativeIOS>(Web_TYPES.IsNativeIOS),
        application.events,
      )
    })

    this.bind(Web_TYPES.LoadPurchaseFlowUrl, () => {
      return new LoadPurchaseFlowUrl(application, this.get<GetPurchaseFlowUrl>(Web_TYPES.GetPurchaseFlowUrl))
    })

    this.bind(Web_TYPES.GetPurchaseFlowUrl, () => {
      return new GetPurchaseFlowUrl(
        application,
        application.legacyApi,
        this.get<IsApplicationUsingThirdPartyHost>(Web_TYPES.IsApplicationUsingThirdPartyHost),
      )
    })

    this.bind(Web_TYPES.SyncStatusController, () => {
      return new SyncStatusController()
    })

    this.bind(Web_TYPES.ActionsMenuController, () => {
      return new ActionsMenuController()
    })

    this.bind(Web_TYPES.FilesController, () => {
      return new FilesController(
        this.get<NotesController>(Web_TYPES.NotesController),
        this.get<FilePreviewModalController>(Web_TYPES.FilePreviewModalController),
        this.get<ArchiveManager>(Web_TYPES.ArchiveManager),
        this.get<VaultDisplayService>(Web_TYPES.VaultDisplayService),
        application.vaults,
        application.items,
        application.files,
        application.mutator,
        application.sync,
        application.protections,
        application.alerts,
        application.platform,
        application.mobileDevice,
        this.get<IsNativeMobileWeb>(Web_TYPES.IsNativeMobileWeb),
        application.events,
      )
    })

    this.bind(Web_TYPES.HistoryModalController, () => {
      return new HistoryModalController(
        this.get<NotesController>(Web_TYPES.NotesController),
        this.get<KeyboardService>(Web_TYPES.KeyboardService),
        application.events,
      )
    })

    this.bind(Web_TYPES.ImportModalController, () => {
      return new ImportModalController(
        this.get<Importer>(Web_TYPES.Importer),
        this.get<NavigationController>(Web_TYPES.NavigationController),
        application.items,
        application.mutator,
        this.get<LinkingController>(Web_TYPES.LinkingController),
        application.preferences,
        application.events,
      )
    })

    this.bind(Web_TYPES.ToastService, () => {
      return new ToastService()
    })

    this.bind(Web_TYPES.ApplicationEventObserver, () => {
      return new ApplicationEventObserver(
        application,
        application.routeService,
        this.get<PurchaseFlowController>(Web_TYPES.PurchaseFlowController),
        this.get<AccountMenuController>(Web_TYPES.AccountMenuController),
        this.get<PreferencesController>(Web_TYPES.PreferencesController),
        this.get<SyncStatusController>(Web_TYPES.SyncStatusController),
        application.sync,
        application.sessions,
        application.subscriptions,
        this.get<ToastService>(Web_TYPES.ToastService),
        application.user,
      )
    })
  }
}

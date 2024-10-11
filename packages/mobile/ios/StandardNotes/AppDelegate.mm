#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <WebKit/WKWebsiteDataStore.h>
#import <TrustKit/TrustKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  
  [self configurePinning];
  
  [self disableUrlCache];
  
  [self clearWebEditorCache];
  
  self.moduleName = @"StandardNotes";
  self.initialProps = @{};
  
  BOOL success = [super application:application didFinishLaunchingWithOptions:launchOptions];
  if (success) {
    self.window.rootViewController.view.backgroundColor = [UIColor colorWithWhite:0.0 alpha:1.0];
    self.window.backgroundColor = [UIColor colorWithWhite:0.0 alpha:1.0];
  }
  return success;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}
 
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)disableUrlCache {
  // Disable NSURLCache for general network requests. Caches are not protected by NSFileProtectionComplete.
  // Disabling, or implementing a custom subclass are only two solutions. https://stackoverflow.com/questions/27933387/nsurlcache-and-data-protection
  NSURLCache *sharedCache = [[NSURLCache alloc] initWithMemoryCapacity:0 diskCapacity:0 diskPath:nil];
  [NSURLCache setSharedURLCache:sharedCache];
}

- (void)clearWebEditorCache {
  // Clear web editor cache after every app update
  NSString *lastVersionClearKey = @"lastVersionClearKey";
  NSString *lastVersionClear = [[NSUserDefaults standardUserDefaults] objectForKey:lastVersionClearKey];
  NSString *currentVersion = [[NSBundle mainBundle] objectForInfoDictionaryKey: @"CFBundleShortVersionString"];
  if(![currentVersion isEqualToString:lastVersionClear]) {
    // UIWebView
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
    
    // WebKit
    NSSet *websiteDataTypes = [WKWebsiteDataStore allWebsiteDataTypes];
    NSDate *dateFrom = [NSDate dateWithTimeIntervalSince1970:0];
    [[WKWebsiteDataStore defaultDataStore] removeDataOfTypes:websiteDataTypes modifiedSince:dateFrom completionHandler:^{}];
    
    [[NSUserDefaults standardUserDefaults] setObject:currentVersion forKey:lastVersionClearKey];
  }
}

- (void)configurePinning {
  if(@available(iOS 10, *)) {
    NSDictionary *trustKitConfig =
    @{
      kTSKSwizzleNetworkDelegates: @YES,
      
      // The list of domains we want to pin and their configuration
      kTSKPinnedDomains: @{
        @"standardnotes.org" : @{
          kTSKIncludeSubdomains:@YES,
          
          kTSKEnforcePinning:@YES,
          
          // Send reports for pin validation failures so we can track them
          kTSKReportUris: @[@"https://standard.report-uri.com/r/d/hpkp/reportOnly"],
          
          // The pinned public keys' Subject Public Key Info hashes
          kTSKPublicKeyHashes : @[
            @"Vjs8r4z+80wjNcr1YKepWQboSIRi63WsWXhIMN+eWys=",
            @"C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=",
            @"YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=",
            @"sRHdihwgkaib1P1gxX8HFszlD+7/gTfNvuAybgLPNis=",
            @"++MBgDH5WGvL9Bcn5Be30cRcL0f5O+NyoXuWtQdX1aI=",
            @"f0KW/FtqTjs108NpYj42SrGvOB2PpxIVM8nWxjPqJGE=",
            @"NqvDJlas/GRcYbcWE8S/IceH9cq77kg0jVhZeAPXq8k=",
            @"9+ze1cZgR9KO1kZrVDxA4HQ6voHRCSVNz4RdTCx4U8U="
          ],
        },
        @"standardnotes.com" : @{
          kTSKIncludeSubdomains:@YES,
          
          kTSKEnforcePinning:@YES,
          
          // Send reports for pin validation failures so we can track them
          kTSKReportUris: @[@"https://standard.report-uri.com/r/d/hpkp/reportOnly"],
          
          // The pinned public keys' Subject Public Key Info hashes
          kTSKPublicKeyHashes : @[
            @"Vjs8r4z+80wjNcr1YKepWQboSIRi63WsWXhIMN+eWys=",
            @"C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=",
            @"YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=",
            @"sRHdihwgkaib1P1gxX8HFszlD+7/gTfNvuAybgLPNis=",
            @"++MBgDH5WGvL9Bcn5Be30cRcL0f5O+NyoXuWtQdX1aI=",
            @"f0KW/FtqTjs108NpYj42SrGvOB2PpxIVM8nWxjPqJGE=",
            @"NqvDJlas/GRcYbcWE8S/IceH9cq77kg0jVhZeAPXq8k=",
            @"9+ze1cZgR9KO1kZrVDxA4HQ6voHRCSVNz4RdTCx4U8U="
          ],
        },
      }
    };
    
    [TrustKit initSharedInstanceWithConfiguration:trustKitConfig];
  }
}

@end

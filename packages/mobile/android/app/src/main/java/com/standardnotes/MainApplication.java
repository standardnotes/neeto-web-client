package com.standardnotes;

import android.app.Application;
import android.app.Activity;
import android.webkit.WebView;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.Field;
import java.util.List;

import com.facebook.react.modules.network.OkHttpClientProvider;

import android.annotation.SuppressLint;
import android.database.CursorWindow;
import android.os.Bundle;
import android.view.WindowManager;

import com.kristiansorens.flagsecure.FlagSecure;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();

      packages.add(new Fido2ApiPackage());
      packages.add(new CustomWebViewPackage());
      packages.add(new ReceiveSharingIntentPackage());

      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    @Override
    protected Boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @SuppressLint("NewApi")
  @Override
  public void onCreate() {
    super.onCreate();

    // Enable Remote debugging for WebViews
    String packageName = getApplicationContext().getPackageName();
    if (packageName.equals("com.standardnotes.dev")) {
      WebView.setWebContentsDebuggingEnabled(true);
    }

    rebuildOkHtttp();

    SoLoader.init(this, /* native exopackage */ false);

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }

    try {
      /*
       * This attempts to fix an error when loading big items fails so we try to change it to 10MB.
       * This API is only available from API 28 so it might fail on older devices.
       * Row too big to fit into CursorWindow requiredPos=0, totalRows=1
       */
      Field field = CursorWindow.class.getDeclaredField("sCursorWindowSize");
      field.setAccessible(true);
      field.set(null, 10 * 1024 * 1024);
    } catch (Exception e) {
      e.printStackTrace();
    }

    registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
      @Override
      public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
      }


      @Override
      public void onActivityStarted(Activity activity) {
        if(FlagSecure.instance != null && FlagSecure.instance.enabled) {
          activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
        }
      }

      @Override
      public void onActivityResumed(Activity activity) {

      }

      @Override
      public void onActivityPaused(Activity activity) {
      }

      @Override
      public void onActivityStopped(Activity activity) {
      }

      public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {

      }

      @Override
      public void onActivityDestroyed(Activity activity) {
      }

    });
  }

  private void rebuildOkHtttp() {
    OkHttpClientProvider.setOkHttpClientFactory(new CustomClientFactory());
  }
}

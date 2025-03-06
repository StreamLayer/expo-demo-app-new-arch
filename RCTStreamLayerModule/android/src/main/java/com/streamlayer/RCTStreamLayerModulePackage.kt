package com.streamlayer

import com.facebook.react.BaseReactPackage
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.common.annotations.UnstableReactNativeAPI

@OptIn(UnstableReactNativeAPI::class)
class RCTStreamLayerPackage : BaseReactPackage(), ReactPackage {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == RCTStreamLayerModuleModule.NAME) {
      RCTStreamLayerModuleModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
        RCTStreamLayerModuleModule.NAME to ReactModuleInfo(
          RCTStreamLayerModuleModule.NAME,
          RCTStreamLayerModuleModule.NAME,
          false, // canOverrideExistingModule
          false, // needsEagerInit
          false, // isCxxModule
          true   // isTurboModule
        )
      )
    }
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(RCTStreamLayerModuleViewManager())
  }

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(RCTStreamLayerModuleModule(reactContext))
  }
}

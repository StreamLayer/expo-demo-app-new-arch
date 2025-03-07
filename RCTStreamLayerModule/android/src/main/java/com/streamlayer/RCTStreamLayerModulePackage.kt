package com.streamlayer

import android.util.Log

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

  var _module: RCTStreamLayerModuleModule? = null
  
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        Log.d( "RCTStreamLayerPackage", "RCTStreamLayerModuleModule Has Been Created getModule")

    return if (name == RCTStreamLayerModuleModule.NAME) {
      val module = RCTStreamLayerModuleModule(reactContext)
      _module = module
      module
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    Log.d( "RCTStreamLayerPackage", "RCTStreamLayerModuleModule Has Been Created getReactModuleInfoProvider")
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


  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    Log.d( "RCTStreamLayerPackage", "RCTStreamLayerModuleModule Has Been Created createNativeModules")
    return listOf(RCTStreamLayerModuleModule(reactContext))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    Log.d( "RCTStreamLayerPackage", "RCTStreamLayerModuleViewManager Has Been Created createViewManagers")
    val manager = RCTStreamLayerModuleViewManager()
    manager.setStreamLayerModuleModule(_module)
    return listOf(manager)
  }

}

package com.streamlayer

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.ArrayList

class RCTStreamLayerModuleViewPackage : ReactPackage {
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    val viewManagers: MutableList<ViewManager<*, *>> = ArrayList()
    viewManagers.add(RCTStreamLayerModuleViewManager())
    return viewManagers
  }

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return emptyList()
  }
}

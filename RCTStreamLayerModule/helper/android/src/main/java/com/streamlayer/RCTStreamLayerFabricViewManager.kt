package com.streamlayer

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RCTStreamLayerFabricViewManagerInterface
import com.facebook.react.viewmanagers.RCTStreamLayerFabricViewManagerDelegate

@ReactModule(name = RCTStreamLayerFabricViewManager.NAME)
class RCTStreamLayerFabricViewManager : SimpleViewManager<RCTStreamLayerFabricView>(),
  RCTStreamLayerFabricViewManagerInterface<RCTStreamLayerFabricView> {
  private val mDelegate: ViewManagerDelegate<RCTStreamLayerFabricView>

  init {
    mDelegate = RCTStreamLayerFabricViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<RCTStreamLayerFabricView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): RCTStreamLayerFabricView {
    return RCTStreamLayerFabricView(context)
  }

  @ReactProp(name = "sourceURL")
  override fun setSourceURL(view: RCTStreamLayerFabricView, value: String?) {
    view.setSourceURL(value)
  }

  companion object {
    const val NAME = "RCTStreamLayerFabricView"
  }
}

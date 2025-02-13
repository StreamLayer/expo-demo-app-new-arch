package com.squareview

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.SquareViewViewManagerInterface
import com.facebook.react.viewmanagers.SquareViewViewManagerDelegate

@ReactModule(name = SquareViewViewManager.NAME)
class SquareViewViewManager : SimpleViewManager<SquareViewView>(),
  SquareViewViewManagerInterface<SquareViewView> {
  private val mDelegate: ViewManagerDelegate<SquareViewView>

  init {
    mDelegate = SquareViewViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<SquareViewView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): SquareViewView {
    return SquareViewView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: SquareViewView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  companion object {
    const val NAME = "SquareViewView"
  }
}

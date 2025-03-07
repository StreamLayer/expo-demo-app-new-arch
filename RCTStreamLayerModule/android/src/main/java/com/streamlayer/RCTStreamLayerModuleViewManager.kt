package com.streamlayer

import android.graphics.Color

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.StreamLayerModuleViewManagerInterface
import com.facebook.react.viewmanagers.StreamLayerModuleViewManagerDelegate

@ReactModule(name = RCTStreamLayerModuleViewManager.NAME)
class RCTStreamLayerModuleViewManager : SimpleViewManager<StreamLayerView>(),
    StreamLayerModuleViewManagerInterface<StreamLayerView> {

    private val delegate: ViewManagerDelegate<StreamLayerView> = StreamLayerModuleViewManagerDelegate(this)

    var _module: RCTStreamLayerModuleModule? = null

    fun setStreamLayerModuleModule(module: RCTStreamLayerModuleModule?) {
        _module = module
    }

    override fun getDelegate(): ViewManagerDelegate<StreamLayerView> {
        return delegate
    }

    override fun getName(): String {
        return NAME
    }

    public override fun createViewInstance(context: ThemedReactContext): StreamLayerView {
        val view = StreamLayerView(context.reactApplicationContext, context)
        _module?.setEmitter(view.commandReceiver)
        return view
    }

    override fun receiveCommand(view: StreamLayerView, commandId: String, args: ReadableArray?) {
        view.receiveCommand(commandId, args)
    }

    @ReactProp(name = "config")
    override fun setConfig(view: StreamLayerView, config: ReadableMap?) {
        view.setConfig(config)
    }

    @ReactProp(name = "applyWindowInsets", defaultBoolean = true)
    override fun setApplyWindowInsets(view: StreamLayerView, value: Boolean) {
        view.applyWindowInsets(value)
    }

    companion object {
        const val NAME = "RCTStreamLayerModuleView"
    }
}

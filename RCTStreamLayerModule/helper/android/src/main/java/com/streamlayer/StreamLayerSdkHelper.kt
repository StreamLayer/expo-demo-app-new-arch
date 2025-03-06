package com.streamlayer

import com.facebook.react.bridge.ReadableMap

object StreamLayerSdkHelper {
    fun initializeSdk(config: ReadableMap): String {
        // Здесь можно добавить логику инициализации SDK
        return "SDK Initialized with config: $config"
    }
}

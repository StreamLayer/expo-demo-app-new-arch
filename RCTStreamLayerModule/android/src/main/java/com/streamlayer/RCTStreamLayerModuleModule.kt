package com.streamlayer

import android.util.Log

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise

import com.streamlayer.R
import com.streamlayer.StreamLayerConfiguration
import com.streamlayer.BuildConfig
import com.streamlayer.ExoVideoPlayerProvider

import io.streamlayer.sdk.SLREventSession
import io.streamlayer.sdk.SLRInviteData
import io.streamlayer.sdk.SLRLogListener
import io.streamlayer.sdk.SLRTheme
import io.streamlayer.sdk.StreamLayer
import io.streamlayer.sdk.StreamLayerDemo


import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import org.json.JSONObject

@ReactModule(name = RCTStreamLayerModuleModule.NAME)
class RCTStreamLayerModuleModule(reactContext: ReactApplicationContext) :
    NativeRCTStreamLayerModuleSpec(reactContext) {

    init {
        Log.d( NAME, "Module Has Been Created $this")
    }
    // base coroutines scope
    private val scope = CoroutineScope(Dispatchers.Default)

    // event session support
    private var eventSession: SLREventSession? = null
    private var createEventSessionJob: Job? = null

    // auth support
    private var authJob: Job? = null
    private var logoutJob: Job? = null

    // demo streams job
    private var demoStreamsJob: Job? = null

    override fun getName(): String = NAME

    private var _emitter: StreamLayerViewCommandReceiver? = null

    fun setEmitter(emitter: StreamLayerViewCommandReceiver? ) {
        _emitter = emitter 
    }   

    override fun getDemoEvents(date: String,viewId: Number, promise: Promise) {
        Log.e(NAME, "receiveCommand is not set! $viewId")
        _emitter?.receiveCommand("777", viewId ) ?: Log.e(NAME, "receiveCommand is not set! $viewId")

        // Log.d(NAME, "getDemoEvents requested for date=$date")
        demoStreamsJob?.cancel()
        demoStreamsJob = scope.launch {
        runCatching {
            val array = Arguments.createArray()
            StreamLayerDemo.getDemoStreams(date).forEach {
            array.pushMap(it.toDomain().toMap())
            }
            array
        }.onSuccess {
            Log.d(NAME, "getDemoEvents onSuccess $it")
            promise.resolve(it)
        }.onFailure {
            Log.e(NAME, "getDemoEvents onFailure", it)
            promise.reject(it)
        }
        }
    }


    override fun initSdk(configParams: ReadableMap, promise: Promise) {
    val config = StreamLayerConfiguration(configParams)
        Log.d(
        NAME,
        "initSdk sdkKey=${config.sdkKey}" +
            " isLoggingEnabled=${config.isLoggingEnabled}" +
            " exoEnabled=${BuildConfig.EXTENSION_EXO_PLAYER}"
        )
        if (config.isLoggingEnabled) {
        // setup SL logger
        StreamLayer.setLogListener(object : SLRLogListener {
            override fun log(level: SLRLogListener.Level, msg: String) {
            when (level) {
                SLRLogListener.Level.DEBUG -> Log.d(NAME, msg)
                SLRLogListener.Level.VERBOSE -> Log.v(NAME, msg)
                SLRLogListener.Level.INFO -> Log.i(NAME, msg)
                SLRLogListener.Level.ERROR -> Log.e(NAME, msg)
                else -> {}
            }
            }
        })
        }
        StreamLayer.initializeApp(reactApplicationContext, config.sdkKey)
        StreamLayer.setGamificationOptions(
        isGlobalLeaderboardEnabled = config.isGlobalLeaderboardEnabled,
        isInvitesEnabled = config.isGamesInviteEnabled
        )
        if (BuildConfig.EXTENSION_EXO_PLAYER) {
        // setup SL video player
        StreamLayer.setVideoPlayerProvider(ExoVideoPlayerProvider(reactApplicationContext))
        }
        when (config.theme) {
        // setup SL theme
        StreamLayerConfiguration.Theme.Green -> {
            // set custom themes
            // TODO: add more attrs later
            StreamLayer.setCustomTheme(
            SLRTheme(
                mainTheme = R.style.GreenMainOverlayTheme,
                profileTheme = R.style.GreenProfileOverlayTheme,
                baseTheme = R.style.GreenBaseOverlayTheme,
                watchPartyTheme = R.style.GreenWatchPartyOverlayTheme,
                inviteTheme = R.style.GreenInviteOverlayTheme,
                gamesTheme = R.style.GreenGamesOverlayTheme,
                statisticsTheme = R.style.GreenStatisticsOverlayTheme,
                chatTheme = R.style.GreenMessengerOverlayTheme,
                notificationsStyle = SLRTheme.NotificationsStyle.DESIGN_NUMBER_ONE
            )
            )
        }

        else -> {}
        }
        promise.resolve(null)
    }

    override fun authorizationBypass(schema: String, token: String, promise: Promise) {
        // Аутентификация пользователя без логина
        promise.resolve(null)
    }

    override fun logout() {
        // Выход пользователя
    }

    override fun useAnonymousAuth(promise: Promise) {
        Log.d(NAME, "useAnonymousAuth")
        logoutJob?.cancel()
        authJob?.cancel()
        authJob = scope.launch {
        runCatching {
            StreamLayer.useAnonymousAuth()
        }.onSuccess {
            Log.d(NAME, "useAnonymousAuth onSuccess")
            promise.resolve(null)
        }.onFailure {
            Log.e(NAME, "useAnonymousAuth onFailure", it)
            promise.reject(it)
        }
        }
    }

    override fun isUserAuthorized(): Boolean {
        return true // Проверка авторизации пользователя
    }

    override fun isInitialized(promise: Promise) {
        Log.d(NAME, "isInitialized")
        runCatching {
            StreamLayer.isInitialized()
        }.onSuccess {
            Log.d(NAME, "isInitialized onSuccess result=$it")
            promise.resolve(true)
        }.onFailure { error ->
            Log.e(NAME, "isInitialized onFailure", error)
            promise.reject("IS_INITIALIZED_ERROR", "Failed to check initialization", error)
        }
    }


    override fun getInvite(json: ReadableMap, promise: Promise) {
        promise.resolve(mapOf("invite" to "Invite Data"))
    }

    override fun handleDeepLink(params: ReadableMap, promise: Promise) {
        promise.resolve(null)
    }

    override fun removeOverlay() {
        // Удаление оверлея
    }

    override fun createEventSession(name: String, promise: Promise) {
        try {
            // Реализуйте логику создания сессии события
            promise.resolve("Event session created for $name")
        } catch (e: Exception) {
            promise.reject("CREATE_EVENT_SESSION_ERROR", "Ошибка при создании сессии события", e)
        }
    }

    override fun releaseEventSession(promise: Promise) {
        try {
            // Реализуйте логику создания сессии события
            promise.resolve("Event session created for $name")
        } catch (e: Exception) {
            promise.reject("CREATE_EVENT_SESSION_ERROR", "Ошибка при создании сессии события", e)
        }
    }



    companion object {
        const val NAME = "RCTStreamLayerModule"
    }
}

import { NativeModules, Platform, TouchableHighlight, UIManager, findNodeHandle } from 'react-native';
import  NativeStreamLayer  from "../NativeRCTStreamLayerModule"

// import Config from 'react-native-config'

export interface StreamLayerDemoEvent {
  id: string,
  title?: string,
  subtitle?: string,
  previewUrl?: string,
  videoUrl?: string
}

export enum StreamLayerInviteGroupType {
  WatchParty = "WatchParty",
  Chat = "Chat"
}

export interface StreamLayerInviteUser {
  id?: string,
  tinodeUserId?: string,
  name?: string,
  username?: string,
  avatar?: string,
}

export interface StreamLayerInvite {
  linkId?: string,
  eventId?: string,
  externalEventId?: string,
  groupId?: string,
  externalGroupId?: string,
  gamification?: boolean,
  groupType?: StreamLayerInviteGroupType,
  user?: StreamLayerInviteUser
}

export enum StreamLayerTheme {
  Blue = "Blue",
  Green = "Green"
}

export interface StreamLayerConfiguration {
  sdkKey: string,
  theme?: StreamLayerTheme,
  isLoggingEnabled?: boolean,
  isGlobalLeaderboardEnabled?: boolean,
  isGamesInviteEnabled?: boolean
}

export interface DeepLinkParams {
  [key: string]: any;
}


export class StreamLayer {

  static isInitialized(): Promise<boolean> {
      return NativeStreamLayer.isInitialized();
  }

  static authorizationBypass(schema: string, token: string): Promise<void> {
    return NativeStreamLayer.authorizationBypass(schema, token)
  }

  static useAnonymousAuth(): Promise<void> {
    return NativeStreamLayer.useAnonymousAuth()
  }

  static isUserAuthorized(): boolean {
    return NativeStreamLayer.isUserAuthorized()
  }

  static logout(): void {
    console.log('removing overlay')
    return NativeStreamLayer.removeOverlay() 
    // return NativeStreamLayer.logout()
  }

  static removeOverlay(): void {
      return NativeStreamLayer.removeOverlay() 
  }

  static createEventSession(id: string): Promise<void> {
    return NativeStreamLayer.createEventSession(id)
  }

  static releaseEventSession(): Promise<void> {
    return NativeStreamLayer.releaseEventSession()
  }

  static getInvite(json: Object): Promise<StreamLayerInvite> {
    console.log("Node Modules deeplinking")
    console.log(json)
    console.log(typeof json)

    return Platform.OS === 'ios' ? NativeStreamLayer.handleDeepLink(json) : NativeStreamLayer.getInvite(json);
  }

  static getDemoEvents(date: string, viewId: number): Promise<Object> {
    return NativeStreamLayer.getDemoEvents(date,viewId)
  }

  static initSdk(config: StreamLayerConfiguration): Promise<string> {
    console.log("Node Modules InitSdk")
    // console.log(Config.SL_SDK_API_KEY)
    return NativeStreamLayer.initSdk(config)
  }

  static handleDeepLink(params: DeepLinkParams): Promise<void> {
    return NativeStreamLayer.handleDeepLink(params);
  }

  
}

// const LINKING_ERROR =
//   `The package 'react-native-streamlayer' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo Go\n';

// const NativeStreamLayer = NativeModules.NativeStreamLayer
//   ? NativeModules.NativeStreamLayer
//   : new Proxy(
//     {},
//     {
//       get() {
//         throw new Error(LINKING_ERROR);
//       },
//     }
//   );
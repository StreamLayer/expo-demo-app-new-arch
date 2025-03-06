import React, { PureComponent } from 'react';

import {
  UIManager,
  findNodeHandle,
  HostComponent,
  Platform,
  PixelRatio,
  NativeSyntheticEvent,
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
  Alert,
  EventSubscription
} from 'react-native';

import { requireNativeComponent } from 'react-native';

import { StreamLayerViewConfiguration, StreamLayerViewProps, StreamLayerInvite, StreamLayerViewOverlay } from '../index';
import SLView from '../RCTStreamLayerFabricViewNativeComponent';
import RCTStreamLayerModule from '../NativeRCTStreamLayerModule'


interface StreamLayerRCTViewProps {
  ref: React.RefObject<StreamLayerViewNativeComponent>;
  style?: StyleProp<ViewStyle>;
  config?: StreamLayerViewConfiguration;
  hocModeEnabled?: Boolean;
  applyWindowInsets?: Boolean;
  onNativeRequestStream?: (event: NativeSyntheticEvent<NativeRequestStreamEvent>) => void;
  onNativeLBarStateChanged?: (event: NativeSyntheticEvent<NativeLBarStateChangedEventBase>) => void;
  onNativeRequestAudioDucking?: (event: NativeSyntheticEvent<NativeRequestAudioDuckingEvent>) => void;
  onNativeDisableAudioDucking?: () => void;
}

type StreamLayerViewNativeComponent = HostComponent<StreamLayerRCTViewProps>;

// TODO: probably replace it with Animated view --- need to check with implementation is better
class LBarState {
  slideX: number;
  slideY: number;

  constructor(slideX: number, slideY: number) {
    this.slideX = slideX
    this.slideY = slideY
  }
}

interface StreamLayerViewState {
  volumeBeforeDucking: number | undefined;
  lbarState: LBarState
}

interface NativeRequestStreamEvent {
  id: string;
}

interface NativeLBarStateChangedEventBase {
  slideX: number;
  slideY: number;
}

interface NativeLBarStateChangedEventAndroid extends NativeLBarStateChangedEventBase {
  nativeEvent: NativeLBarStateChangedEventBase;
}

interface NativeRequestAudioDuckingEvent {
  level: number;
}

interface NativeRequestAudioDuckingEventAndroid extends NativeRequestAudioDuckingEvent {
  nativeEvent: NativeRequestAudioDuckingEvent;
}

export class StreamLayerView extends PureComponent<React.PropsWithChildren<StreamLayerViewProps>, StreamLayerViewState> {

  private readonly _root: React.RefObject<StreamLayerViewNativeComponent>;
  private listenerSubscription: Record<string, EventSubscription | undefined> = {};


  static initialState: StreamLayerViewState = {
    lbarState: new LBarState(0, 0),
    volumeBeforeDucking: undefined,
  };

  constructor(props: StreamLayerViewProps) {
    super(props);
    this._root = React.createRef();
    this.state = StreamLayerView.initialState;
    if (Platform.OS === 'ios') {
      this.registerEvents();
    }
  }





  private registerEvents() {
    
    this.listenerSubscription.onLBarStateChanged = RCTStreamLayerModule.onLBarStateChanged((data) => { 
      this._onNativeLBarStateChanged(data)
    });

    this.listenerSubscription.onRequestStream = RCTStreamLayerModule.onRequestStream((data) => { 
      Alert.alert(`onRequestStream: ${JSON.stringify(data)}`); 
    });

    this.listenerSubscription.requestAudioDucking = RCTStreamLayerModule.requestAudioDucking((data) => { 
      Alert.alert(`requestAudioDucking: ${JSON.stringify(data)}`); 
    });

    this.listenerSubscription.disableAudioDucking = RCTStreamLayerModule.disableAudioDucking((data) => { 
      Alert.alert(`disableAudioDucking: ${JSON.stringify(data)}`); 
    });
  }

  // private _onNativeRequestStream = (event: NativeSyntheticEvent<NativeRequestStreamEvent>) => {
  //   console.log(event)
  //   const nativeEvent = Platform.select({
  //     ios: event.nativeEvent as NativeRequestStreamEvent, 
  //     android: event.nativeEvent as NativeRequestStreamEvent,
  //   });
  //   this.props.onRequestStream?.(nativeEvent?.id); 
  

  private _onNativeRequestStream = (event: NativeSyntheticEvent<NativeRequestStreamEvent>) => {
    const { id } = event.nativeEvent; 

    if (this.props.onRequestStream !== undefined) {
      this.props.onRequestStream?.(id);
    } else {
      console.error('Request Stream insided library does not implemented yet')
    }
  };

  private _onNativeLBarStateChanged = (
    event: NativeLBarStateChangedEventBase | NativeLBarStateChangedEventAndroid
  ) => {
    console.log("ON NATIVE L BAR CHANGED IN CLASS COMPONENT")
    console.log(event)
    const nativeEvent = "nativeEvent" in event ? event.nativeEvent : event;
    const ratio = PixelRatio.get()
    const slideX = Platform.select({ ios: Math.round(nativeEvent.slideX), default: Math.round(nativeEvent.slideX / ratio) });
    const slideY = Platform.select({ ios: Math.round(nativeEvent.slideY), default: Math.round(nativeEvent.slideY / ratio) });
    if (this.props.onLBarStateChanged !== undefined) {
      this.props.onLBarStateChanged?.(slideX, slideY);
    } else {
      const lbar = new LBarState(slideX, slideY)
      this.setState({ lbarState: lbar });
    }
  }

  private _onNativeRequestAudioDucking = (
    event: NativeRequestAudioDuckingEvent | NativeRequestAudioDuckingEventAndroid
  ) => {
    const nativeEvent = "nativeEvent" in event ? event.nativeEvent : event;
    const level = nativeEvent.level; // Явно извлекаем level
    
    const player = this.props.player;
    if (player !== undefined) {
      const playerVolume = player.volume;
      if (this.state.volumeBeforeDucking == undefined) {
        this.setState({ volumeBeforeDucking: playerVolume });
      }
      console.debug("_onNativeRequestAudioDucking change player volume=" + playerVolume + " level=" + level);
      player.volume = Math.min(playerVolume, level);
    } else {
      this.props.onRequestAudioDucking?.(level);
    }
  }

  private _onNativeDisableAudioDucking = () => {
    const player = this.props.player;
    if (player !== undefined) {
      if (this.state.volumeBeforeDucking !== undefined) {
        player.volume = this.state.volumeBeforeDucking
        console.log("_onNativeDisableAudioDucking change player volume=" + this.state.volumeBeforeDucking)
        this.setState({ volumeBeforeDucking: undefined });
      }
    } else {
      this.props.onDisableAudioDucking?.();
    }
  }

  componentDidMount(): void {
    if (Platform.OS === 'android') {
      // create view
      const viewId = findNodeHandle(this._root.current);
      // const command = (UIManager as { [index: string]: any })[ComponentName].Commands.create.toString();
      // UIManager.dispatchViewManagerCommand(viewId, command, [viewId]);
    } else {

    }
  }

  componentWillUnmount(): void {
    if (Platform.OS === 'android') {
      // destroy view
      const viewId = findNodeHandle(this._root.current);
      // const command = (UIManager as { [index: string]: any })[ComponentName].Commands.destroy.toString();
      // UIManager.dispatchViewManagerCommand(viewId, command, [null]);
    } else {
      Object.values(this.listenerSubscription).forEach((subscription) => {
        subscription?.remove();
      }); 
    }
  }

  hideMenu() {
    // const viewId = findNodeHandle(this._root.current);
    // const command = (UIManager as { [index: string]: any })[ComponentName].Commands.hideMenu;
    // UIManager.dispatchViewManagerCommand(viewId, Platform.select({ ios: command, default: command.toString() }), [null]);
  }

  hideOverlay() {
    // const viewId = findNodeHandle(this._root.current);
    // const command = (UIManager as { [index: string]: any })[ComponentName].Commands.hideOverlay;
    // UIManager.dispatchViewManagerCommand(viewId, Platform.select({ ios: command, default: command.toString() }), [null]);
  }

  showOverlay(viewOverlay: StreamLayerViewOverlay) {
    // const viewId = findNodeHandle(this._root.current);
    // const command = (UIManager as { [index: string]: any })[ComponentName].Commands.showOverlay;
    // UIManager.dispatchViewManagerCommand(viewId, Platform.select({ ios: command, default: command.toString() }), [viewOverlay]);
  }

  handleInvite(invite: StreamLayerInvite) {
    // const viewId = findNodeHandle(this._root.current);
    // const command = (UIManager as { [index: string]: any })[ComponentName].Commands.handleInvite;
    // console.log("HANDLEINVITE")
    // if(invite){
    //   console.log("COMMAND")
    //   console.log(command)
    //   console.log(typeof command)
    //   console.log(invite)
    //   UIManager.dispatchViewManagerCommand(viewId, Platform.select({ ios: command, android: `${command}` }), [invite]);
    // }
  }

  public render(): JSX.Element {
    const { config, style, playerView, applyWindowInsets, player } = this.props;

    return (
      <View style={[style]}>
        {playerView !== undefined &&
          <View style={{
            marginEnd: this.state.lbarState.slideX,
            marginBottom: this.state.lbarState.slideY
          }}>{playerView}
          </View>
        }
        <SLView
          style={StyleSheet.absoluteFill}
          // config={config || {}}
          // hocModeEnabled={playerView !== undefined}
          // applyWindowInsets={true}
          // onNativeRequestStream={this._onNativeRequestStream}
          // onNativeLBarStateChanged={this._onNativeLBarStateChanged}
          // onNativeRequestAudioDucking={this._onNativeRequestAudioDucking}
          // onNativeDisableAudioDucking={this._onNativeDisableAudioDucking}
        />
      </View>
    );
  }
}

const ComponentName = 'StreamLayerRCTView';

const LINKING_ERROR =
  `The package 'react-native-streamlayer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

// const StreamLayerRCTView =
//   UIManager.getViewManagerConfig(ComponentName) != null
//     ? requireNativeComponent<StreamLayerRCTViewProps>(ComponentName)
//     : () => {
//       throw new Error(LINKING_ERROR);
//     };
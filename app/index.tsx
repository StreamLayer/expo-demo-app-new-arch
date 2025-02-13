/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState , useRef, useCallback} from 'react';
// import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  // StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Platform, 
  Image,
  Alert,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
  EventSubscription
} from 'react-native';

// import { 
//   PlayerConfiguration, 
//   SourceDescription, 
//   PlayerEventType, 
//   THEOplayer, 
//   THEOplayerView 
// } from 'react-native-theoplayer';
// import { UiContainer, 
//   CenteredControlBar, 
//   SkipButton, 
//   PlayButton, 
//   DEFAULT_THEOPLAYER_THEME 
// } from '@theoplayer/react-native-ui';
import {
  Colors,
  // DebugInstructions,
  // Header,
  // LearnMoreLinks,
  // ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// import { VibrancyView } from "@react-native-community/blur";
// import LinearGradient from 'react-native-linear-gradient';
// import branch from 'react-native-branch';
// import { StreamLayerViewConfiguration, StreamLayerViewNotificationFeature, StreamLayerViewOverlayLandscapeMode, StreamLayerViewOverlay } from './react-native-streamlayer/src/index';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

// import * as ScreenOrientation from 'expo-screen-orientation';



// import Config from 'react-native-config'
// import WebView from './specs/WebViewNativeComponent';

import { 
  initSdk,
  isInitialized,
  isUserAuthorized,
  createEventSession,
  useAnonymousAuth,
  getDemoEvents,
  StreamLayerViewNotificationFeature,
  StreamLayerViewOverlayLandscapeMode,
  StreamLayerViewConfiguration,
  RCTStreamLayerFabricView,
  StreamLayerView,


} from 'react-native-streamlayer/src';

import RCTStreamLayerModule from "react-native-streamlayer/src"

import { SquareViewView } from "nativesquare";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';


class LBarState {
    slideX: number;
    slideY: number;

    constructor(slideX: number, slideY: number) {
        this.slideX = slideX
        this.slideY = slideY
    }
}

// import { 
//   StreamLayer, 
//   StreamLayerView, 
//   StreamLayerViewPlayer, 
//   StreamLayerViewOverlayLandscapeMode, 
//   StreamLayerViewConfiguration, 
//   StreamLayerViewNotificationFeature, 
//   StreamLayerTheme 
// } from 'react-native-streamlayer/src';


import * as ScreenOrientation from 'expo-screen-orientation';
type StreamLayerDemoEvent = any
// import StreamLayer from './specs/StreamLayer';
// import  { StreamLayerView }  from './react-native-streamlayer/src/internal/StreamLayerView';
// import  StreamLayerViewFCWrapper from './react-native-streamlayer/src/internal/StreamLayerViewFCWrapper';


export default function HomeScreen() {
    console.log(18)
    console.log(NativeModules.RCTStreamLayerFabricViewManager);

  const [volumeBeforeDucking, setVolumeBeforeDucking] = useState<number | undefined>(undefined)
  const [isPortrait, setPortrait] = useState<boolean>();
  // const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [lbarState, setLbarState] = useState(new LBarState(0, 0));
  const [events, setEvents] = useState<Array<StreamLayerDemoEvent>>()
  const [currentEventId, setCurrentEventId] = useState<String>()
  const [isInitializedState, setInitializedState] = useState(false);
  const viewRef = useRef(null);
//   const listenerSubscription = React.useRef<null | EventSubscription>(null);

  const invitedata = {
    "+click_timestamp": 1725866009, 
    "+clicked_branch_link": true, 
    "+is_first_session": false, 
    "+match_guaranteed": true, 
    "referring_browser": "Mobile Safari", 
    "streamlayer": {
        "eventId": "1732", 
        "externalEventId": "1732", 
        "groupId": "grpWsN6A0sc7ks", 
        "groupType": 2, 
        "linkId": "21dcc66d-c9a5-450a-8d73-a265e6f458b3", 
        "user": {
            "id": "7229202220128948224", 
            "name": "case 852184", 
            "tinodeUserId": "usrIMvX3trdK_U", 
            "username": "sla/21953cf2-cb0c-41c4-9f06-93945e6e714d"
        }
    }, 
    "~creation_source": 0, 
    "~id": "1361587485800543988", 
    "~referring_link": "https://6937g.app.link/sxA36orfKMb?__branch_flow_id=1361587609475280633&%20referring_browser=Mobile%20Safari"
}



  function isScreenPortrait(): boolean {
    return Dimensions.get('window').height > Dimensions.get('window').width
}

useEffect(() => {

    // listenerSubscription.current = RCTStreamLayerModule.onLBarStateChanged((data) => { Alert.alert(`onLBarStateChanged: ${data}`) })

    // listenerSubscription.current = RCTStreamLayerModule.onRequestStream((data) => { Alert.alert(`onRequestStream: ${data}`) })

    // listenerSubscription.current = RCTStreamLayerModule.requestAudioDucking((data) => { Alert.alert(`requestAudioDucking: ${data}`) })

    // listenerSubscription.current = RCTStreamLayerModule.disableAudioDucking((data) => { Alert.alert(`disableAudioDucking: ${data}`) })

    const emitter = new NativeEventEmitter(NativeModules.RCTStreamLayerFabricView);
    emitter.addListener('emitOnLBarStateChanged',(event) => console.log(event));
        
  setPortrait(isScreenPortrait())
  const initialize = async () => {

      await ScreenOrientation.unlockAsync();
      try {
          checkInitialized();
      } catch (error) {
          console.error("Error initializing:", error);
      }
  };

  initialize();

  // branch.subscribe(
  //     ({ error, params, uri }) => {

  //         if (error) {
  //             console.error('Error from Branch: ' + error);
  //             return;
  //         }
      
  //         if (params['+clicked_branch_link']) {
  //             console.log('Branch params:', params.streamlayer);
  //             if(Platform.OS === 'ios') {
  //                 StreamLayer.handleDeepLink({streamlayer: params.streamlayer})
  //             } else if (Platform.OS === 'android') {
  //                 processBranchLink(params)
  //             }
  //         }
  //     }   
  // );

}, []);


  // const animateSlide = (targetX: number, targetY: number) => {
  //     const duration = 500; // Продолжительность анимации в миллисекундах
  //     const intervalTime = 50; // Интервал обновления
  //     const steps = duration / intervalTime;
  //     const incrementX = (targetX - lbarState.slideX) / steps;
  //     const incrementY = (targetY - lbarState.slideY) / steps;
  //     let currentStep = 0;
  
  //     const interval = setInterval(() => {
  //       if (currentStep >= steps) {
  //         clearInterval(interval);
  //         setLbarState(new LBarState(targetX, targetY));
  //       } else {
  //         setLbarState((prevState) => new LBarState(
  //           prevState.slideX + incrementX,
  //           prevState.slideY + incrementY
  //         ));
  //         currentStep++;
  //       }
  //     }, intervalTime);
  //   };
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
        setPortrait(window.height > window.width)
    });


    return () => subscription?.remove()
});


  // useEffect(() => {
  //     setPortrait(isScreenPortrait())
  //     const initialize = async () => {
  //         try {
  //             // checkInitialized();
  //             // await ScreenOrientation.unlockAsync();
  //         } catch (error) {
  //             console.error("Error initializing:", error);
  //         }
  //     };

  //     initialize();

  // const emitter = new NativeEventEmitter(NativeModules.StreamLayerViewEventEmitter);

  // // Добавляем обработчик события
  // const subscription = emitter.addListener(
  //   'onNativeLBarStateChanged',
  //   (intent) => {console.log(intent),console.log('first'), setLbarState(intent)}
  // );
  
  // branch.setRequestMetadata('$analytics_visitor_id', '000001')

  // branch.subscribe(
  //   ({ error, params, uri }) => {
  //       console.log("BRANCH CLICKED")
  //       if (error) {
  //           console.error('Error from Branch: ' + error);
  //           return;
  //       }
    
  //       if (params['+clicked_branch_link']) {
  //           console.log('Branch params:', params.streamlayer);
  //           if(Platform.OS === 'ios') {
  //               StreamLayer.handleDeepLink({streamlayer: params.streamlayer})
  //           } else if (Platform.OS === 'android') {
  //               processBranchLink(params)
  //           }
  //       }
  //   }   
  // ) 

  // Убираем обработчик события при размонтировании компонента
  // return () => {
  //   subscription.remove(); // Используем remove() для удаления слушателя
  // };
  // }, []);

  // const insets = useSafeAreaInsets()

  useEffect(() => {
      const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
          setPortrait(window.height > window.width)
      });

  
      return () => subscription?.remove()
  });

  // const processBranchLink = async (params: BranchParams) => {
  //     try {
  //       const invite = await StreamLayer.getInvite(params);

  //       viewRef.current?.handleInvite(invite)

  //       if (invite !== undefined && invite !== null) {
  //         // checkAuth(() => {
  //         //   if (navigationRef.isReady()) {
  //         //     navigationRef.navigate('Player', { hocMode: false, invite: invite });
  //         //   }
  //         // })
  //       }
  //     } catch (e) {
  //       console.error(`Error: ${JSON.stringify(e)}`);
  //     }
  //   };

  // const playerConfig: PlayerConfiguration = {
  //     license: undefined,
  // };

  // const source: SourceDescription = {
  //     sources: [
  //         {
  //             src: "https://cdn.theoplayer.com/video/elephants-dream/playlist-single-audio.m3u8",
  //             type: "application/x-mpegurl"
  //         },
  //     ],
  // };

  // const onReady = (player: THEOplayer) => {
  //     // setPlayer(player);
  //     player.autoplay = true
  //     player.source = source;
  //     player.addEventListener(PlayerEventType.ERROR, console.log);
  // }


  const checkInitialized = async () => {
      try {
        
              console.log("CONFUG")
              console.log("679acc583ca0ad3ae5114a9a50a1646179cdc11f93c210277b30b8e3a807e92d")
              await initSdk({
                isLoggingEnabled: true,
                theme: "Green",
                sdkKey: "679acc583ca0ad3ae5114a9a50a1646179cdc11f93c210277b30b8e3a807e92d",
              });
              checkAuth()
              loadDemoEvents()
              const inited = isInitialized()
              setInitializedState(inited)

      } catch (e) {
          console.error(e);
      }
  }

  const loadDemoEvents = useCallback(async () => {
      try {
          // TODO: probably move date to SL config page later
          console.log("EVENTS1")
          const events = await getDemoEvents("2022-01-01")
          console.log("EVENTS")
          console.log(events)
          setEvents(events)
          if (events !== undefined && events !== null && events.length > 0) {
              createEventSess(events[0].id)
          }
      } catch (e) {
          console.error("PlayerScreen loadDemoEvents error", e);
      }
  },[])

  const checkAuth = async () => {
      try {
         
          console.log(13)
          console.log(isUserAuthorized())
          if (!isUserAuthorized()) {
              await useAnonymousAuth();
          }
      } catch (e) {
          console.error(e);
      }
  }

  // TODO: we need to add better thread managment here - probably also in native sdk part
  // add StreamLayerDemoEvent support on demand
  const createEventSess = async (id: string) => {
      try {
          await createEventSession(id);
          console.log(`Created a new event with id ${id}`);
          setCurrentEventId(id)
      } catch (e) {
          console.error(e);
      }
  };

  const playerHeight = isScreenPortrait() ? 300 : Dimensions.get('screen').height;


  console.log("IS SCREEN PORTRAIT  " + isScreenPortrait() )

  const onRequestStream = (id: string) => {
      console.log("onRequestStream id=" + id)
      createEventSession(id)
  }

  const onLBarStateChanged = (slideX: number, slideY: number) => {
    console.log("ON L BAR STATE")
      setLbarState(new LBarState(slideX, slideY));
  }

  const onRequestAudioDucking = (level: number) => {
      console.log("onRequestAudioDucking level=" + level)
  }

  const onDisableAudioDucking = () => {
      console.log("onDisableAudioDucking")
  }

  const streamLayerViewPlayer = {

      get volume() {
          return 0.0
      },

      set volume(value) {

      },

  }

  const viewConfig = getViewConfig()
  // const viewConfig = getViewConfig()

  console.log("Render new state playerHeight=" + 
  // playerHeight + " slideX="
  //     + lbarState.slideX + " slideY=" + lbarState.slideY
      + " currentEventId=" + currentEventId + " currentEvent=" + currentEvent
  )

  var scrollItems = new Array<any>();
    if (events !== undefined && isPortrait) {
        events.forEach((event) => {
            scrollItems.push(
                <Pressable key={event.id} onPress={() => createEventSession(event.id)} style={{ width: Width, marginTop: 0}}>
               
                    <View 
                style={{width: '100%',flexDirection: 'row', height: 70, alignItems: 'center',justifyContent: 'center',  alignSelf: 'center', marginTop: 5,borderRadius: 10, borderWidth: 0.3}} 

              >
                        {event.previewUrl !== undefined && (
                          <View style={{marginLeft: 120, height: 50, flexDirection: 'row', gap: 20}}>

                             <Text style={{fontSize: 12}} numberOfLines={1} ellipsizeMode='tail'>{event.title}</Text>
                          </View>
                      

                        )}
                        </View>


                    {event.previewUrl !== undefined && (
                          <View style={{marginLeft: 10, height: 50, flexDirection: 'row', gap: 20, position: 'absolute', top: 15, left: 10}}>
                         <Image source={{ uri: event.previewUrl }}
                             style={styles.eventRowImage} />
                             
                          </View>
                      

                        )}
                    
                </Pressable>
            )
        })
    }
    const playerConfig: PlayerConfiguration = {
      license: undefined,
  };

  var currentEvent: StreamLayerDemoEvent | undefined;
  if (events !== undefined && currentEventId !== undefined) {
      currentEvent = events.find((event) => {
          return event.id == currentEventId
      })
  }

    const insets = useSafeAreaInsets()

    const tabBarHeight = 0
  const PortraitView = () => {
    return (
      <View style={{ height: Dimensions.get('screen').height - 258, marginTop: 298, position: 'absolute', width: Dimensions.get('screen').width, alignItems: 'center', backgroundColor: 'lightgrey' }}>
      {currentEvent !== undefined && (
        <View 
          style={{width: '100%',}} 

        >


          <Text style={{fontSize: 25, marginLeft: 10}}>{currentEvent.title}</Text>


        </View>
      )}
      <ScrollView style={{ height: Dimensions.get('screen').height - 388, width: '100%', }}>
          {scrollItems}
          <View style={{height: 100}}>

          </View>
      </ScrollView>
  </View>
    )
  }
  
  // const insets = useSafeAreaInsets()

  return (
    <SafeAreaView style={styles.container}  edges={['top']}>
      <View style={{...styles.container, backgroundColor: 'lightgrey'}}>
      {(isPortrait) && <PortraitView />}
        {isInitializedState
          ?  
          <StreamLayerView 
          style={isScreenPortrait() ? {...styles.portrait, height: Dimensions.get('screen').height - insets.top-tabBarHeight, width: Dimensions.get('screen').width } : styles.landscape}
          ref={viewRef}
          config={viewConfig}
          applyWindowInsets={false}
          onRequestStream={onRequestStream}
          onLBarStateChanged={onLBarStateChanged}
          onRequestAudioDucking={onRequestAudioDucking}
          onDisableAudioDucking={onDisableAudioDucking}
          player={streamLayerViewPlayer}
          playerView={      
              <View                           
                  style={isPortrait ? {
                      ...styles.player,
                      width: Dimensions.get('screen').width,
                      height: playerHeight
                    } : {
                      ...styles.player,
                      width: Dimensions.get('screen').width - lbarState.slideX,
                      height: playerHeight-lbarState.slideY
                    }
                  
                  
                  }
              >
                  <View style={styles.playButton} />
              </View>
          }
  
      />
          : 
            <View style={{flex: 1, backgroundColor: 'green'}}/>
          }

      </View>
    </SafeAreaView>
  );
}


function getViewConfig(): StreamLayerViewConfiguration {
  return {
      viewNotificationFeatures: new Array(
          StreamLayerViewNotificationFeature.Games,
          StreamLayerViewNotificationFeature.Chat,
          StreamLayerViewNotificationFeature.WatchParty,
          StreamLayerViewNotificationFeature.Twitter
      ),
      isGamesPointsEnabled: true,
      isGamesPointsStartSide: false,
      isLaunchButtonEnabled: true,
      isMenuAlwaysOpened: false,
      isMenuLabelsVisible: true,
      isMenuProfileEnabled: true,
      isTooltipsEnabled: true,
      isWatchPartyReturnButtonEnabled: true,
      isWhoIsWatchingViewEnabled: true,
      isOverlayExpandable: true,
      overlayHeightSpace: 300,
      overlayWidth: 0,
      overlayLandscapeMode: StreamLayerViewOverlayLandscapeMode.Start
  }
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  eventTitle: {
      color: 'white',
      fontSize: 24,
      margin: 4
  },
  eventRowTitle: {
      flex: 1,
      color: 'white',
      fontSize: 16,
      margin: 4
  },
  eventRow: {
      flexDirection: 'row',
      margin: 4,
      padding: 4,
      height: 58,
      justifyContent: 'flex-start',
      alignItems: 'center',

  },
  eventRowImage: {
      width: 100,
      height: 50
  },
  portrait: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    position: 'absolute'
  },
  landscape: {
      flex: 1
  },
  player: {
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'green'
  },
  playButton: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 50, 
      borderLeftColor: 'white', 
      borderTopWidth: 25, 
      borderTopColor: 'transparent',
      borderBottomWidth: 25, 
      borderBottomColor: 'transparent',
}
}
);



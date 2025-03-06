#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTStreamLayerModule.h"
#import "react-native-streamlayer-Swift.h"
#import <react-native-streamlayer/RNRCTStreamLayerModuleSpec.h>
#import <react-native-streamlayer/RNRCTStreamLayerModuleSpecJSI.h>
#import <react-native-streamlayer/RCTStreamLayerModule.h>

static NSString *const RCTStreamLayerKey = @"stream-layer";

@interface RCTStreamLayerModule ()
@property (nonatomic, strong) NSUserDefaults *streamLayerDefaults;
@property (nonatomic, strong) StreamLayerSDKModule *streamLayerSDKModule;
@end

@implementation RCTStreamLayerModule
RCT_EXPORT_MODULE();

- (id)init {
  if (self = [super init]) {
    _streamLayerDefaults = [[NSUserDefaults alloc] initWithSuiteName:RCTStreamLayerKey];
    
  }
  return self;
}

// Подключаем TurboModule
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeRCTStreamLayerModuleSpecJSI>(params);
}





- (void)initSdk:(NSDictionary *)config resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  if (config == nil) {
      reject(@"INVALID_CONFIG", @"Config is missing", nil);
      return;
  }

  _streamLayerSDKModule = [[StreamLayerSDKModule alloc] init];
  [_streamLayerSDKModule initSdk:config resolver:resolve rejecter:reject];
  
}

- (void)sendLBar:(NSDictionary *)config resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
     
//  [self onLBarStateChanged:@"Привет"];
}


// handleDeepLink
- (void)handleDeepLink:(NSDictionary *)params resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {

  [_streamLayerSDKModule handleDeepLink:params
                 resolver:^(BOOL success) {
                     // Преобразуем BOOL в объект для RCTPromiseResolveBlock
                     resolve(@(success));
                 }
                 rejecter:^(NSString *code, NSString *message) {
                     // Пробрасываем ошибку через RCTPromiseRejectBlock
                     reject(code, message, nil);
                 }];
}

// createEventSession
- (void)createEventSession:(NSString *)eventId
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject {
  [_streamLayerSDKModule createEventSession:eventId
                                   resolver:^(BOOL success) {
                                       resolve(@(success));
                                   }
                                   rejecter:^(NSString *code, NSString *message) {
                                       reject(code, message, nil);
                                   }];
}

// releaseEventSession
- (void)releaseEventSession:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject {
  [_streamLayerSDKModule releaseEventSession:^(BOOL success) {
      resolve(@(success));
  } rejecter:^(NSString *code, NSString *message) {
      reject(code, message, nil);
  }];
}

// authorizationBypass
- (void)authorizationBypass:(NSString *)schema
                      token:(NSString *)token
                   resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject {

  [_streamLayerSDKModule authorizationBypass:schema token:token resolver:resolve rejecter:reject];
}


// logout
- (void)logout {
  [_streamLayerSDKModule logout];
}

// useAnonymousAuth
- (void)useAnonymousAuth:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {

  [_streamLayerSDKModule useAnonymousAuth:resolve reject:reject];
}

// isUserAuthorized
- (NSNumber *)isUserAuthorized {

    BOOL isAuthorized = [_streamLayerSDKModule isUserAuthorized];
    return @(isAuthorized);
}

- (NSNumber *)isInitialized {

    BOOL isInitialized = [_streamLayerSDKModule isInitialized];
    return @(true);
}


// getDemoEvents
- (void)getDemoEvents:(NSString *)date
              resolve:(void (^)(id))resolve
                  reject: (void (^) (NSString *code, NSString *message, NSError *error))reject {
  [_streamLayerSDKModule getDemoEvents:date resolve:resolve reject: reject];
}


// getInvite
- (void)getInvite:(NSDictionary *)json
         resolver:(RCTPromiseResolveBlock)resolve
         rejecter:(RCTPromiseRejectBlock)reject {

 [_streamLayerSDKModule getInvite:json resolver:resolve rejecter:reject];
}



// removeOverlay
- (void)removeOverlay {

  [_streamLayerSDKModule removeOverlay];
}

@end





#endif

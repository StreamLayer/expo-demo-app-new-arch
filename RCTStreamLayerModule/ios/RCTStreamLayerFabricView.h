#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTViewComponentView.h>
#import "RCTStreamLayerEmitterDelegate.h"
#import <UIKit/UIKit.h>

#ifndef RCTStreamLayerFabricViewNativeComponent_h
#define RCTStreamLayerFabricViewNativeComponent_h

NS_ASSUME_NONNULL_BEGIN


@interface RCTStreamLayerFabricView : RCTViewComponentView

- (instancetype)initWithBridge:(id<RCTStreamLayerEmitterProtocol>)bridgeEmmiter;

@end

NS_ASSUME_NONNULL_END

#endif /* RCTStreamLayerFabricViewNativeComponent_h */
#endif

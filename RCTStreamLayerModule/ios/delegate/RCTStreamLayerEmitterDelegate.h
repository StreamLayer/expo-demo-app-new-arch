//
//  RCTStreamLayerEmitterDelegate.h
//  react-native-streamlayer
//
//  Created by Иосиф Яковлев on 09.02.2025.
//

#import <Foundation/Foundation.h>
#import <StreamLayerSDK/StreamLayerSDK-Swift.h>
#import "RCTBridge.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RCTStreamLayerEmitterProtocol <NSObject>

@optional
- (void)moveRightSideForPoints:(CGFloat)slideX slideY:(CGFloat)slideY;
- (void)moveBottomSideForPoints:(CGFloat)points;

@end

@interface RCTStreamLayerEmitterDelegate : NSObject <RCTStreamLayerEmitterProtocol>

@property (nonatomic, strong) RCTBridge *bridge;

- (void)moveRightSideForPoints:(CGFloat)slideX slideY:(CGFloat)slideY;
- (void)moveBottomSideForPoints:(CGFloat)points;


@end

NS_ASSUME_NONNULL_END

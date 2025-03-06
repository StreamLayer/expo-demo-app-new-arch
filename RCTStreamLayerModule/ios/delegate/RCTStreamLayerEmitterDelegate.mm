//
//  RCTStreamLayerEmitterDelegate.m
//  react-native-streamlayer
//
//  Created by Иосиф Яковлев on 09.02.2025.
//

#import "RCTStreamLayerEmitterDelegate.h"
#import "../generated/RNRCTStreamLayerModuleSpec/RNRCTStreamLayerModuleSpec.h"

@implementation RCTStreamLayerEmitterDelegate

// Метод для перемещения правой стороны
- (void)moveRightSideForPoints:(CGFloat)slideX slideY:(CGFloat)slideY {
  NSLog(@"moveRightSideForPoints - slideX: %f, slideY: %f", slideX, slideY);

  [self.getCurrentModule emitOnLBarStateChanged:@{
    @"slideX": @(slideX),
    @"slideY": @(slideY)
  }];
}

// Метод для перемещения нижней стороны
- (void)moveBottomSideForPoints:(CGFloat)points {
    NSLog(@"Points: %fd", points);
}

- (NativeRCTStreamLayerModuleSpecBase*)getCurrentModule{
  if ([self.bridge isKindOfClass:[NativeRCTStreamLayerModuleSpecBase class]]) {
    NativeRCTStreamLayerModuleSpecBase *turboModule = (NativeRCTStreamLayerModuleSpecBase *)self.bridge;
    return turboModule;
  } else {
    return NULL;
  }
}

@end

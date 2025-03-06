#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"
#import "RCTStreamLayerFabricView.h"
#import "generated/RNRCTStreamLayerModuleSpec/RNRCTStreamLayerModuleSpec.h"
#import "delegate/RCTStreamLayerEmitterDelegate.h"

@interface RCTStreamLayerFabricViewManager : RCTViewManager
@property (nonatomic, strong) RCTStreamLayerEmitterDelegate *emitter;
@end

@implementation RCTStreamLayerFabricViewManager

RCT_EXPORT_MODULE(RCTStreamLayerFabricView)

- (instancetype)init
{
  self = [super init];
  if (self) {
    _emitter = [RCTStreamLayerEmitterDelegate new];
  }
  return self;
}

- (UIView *)view
{
  _emitter.bridge = [self.bridge moduleForName:@"RCTStreamLayerModule"];
  return [[RCTStreamLayerFabricView alloc] initWithBridge:self.emitter];
}

RCT_EXPORT_VIEW_PROPERTY(color, NSString)

@end
#endif

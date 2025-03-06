#ifdef RCT_NEW_ARCH_ENABLED

#import "RCTStreamLayerFabricView.h"

#import "generated/RNRCTStreamLayerModuleSpec/ComponentDescriptors.h"
#import "generated/RNRCTStreamLayerModuleSpec/EventEmitters.h"
#import "generated/RNRCTStreamLayerModuleSpec/Props.h"
#import "generated/RNRCTStreamLayerModuleSpec/RCTComponentViewHelpers.h"
#import "react-native-streamlayer-Swift.h"

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCTStreamLayerFabricView () <RCTRCTStreamLayerFabricViewViewProtocol>

@property (nonatomic, weak) id<RCTStreamLayerEmitterProtocol> emitterDelegate;

@end

@implementation RCTStreamLayerFabricView {
  StreamLayerRCTViewManager *streamLayerManager; // Swift объект
  UIView *streamLayerView; // View от StreamLayer
}

- (instancetype)initWithBridge:(id<RCTStreamLayerEmitterProtocol>)bridgeEmmiter{
  if (self = [super init]) {
    _emitterDelegate = bridgeEmmiter;
    static const auto defaultProps = std::make_shared<const RCTStreamLayerFabricViewProps>();
    _props = defaultProps;
    // Инициализация StreamLayerRCTViewManager
    streamLayerManager = [[StreamLayerRCTViewManager new] init];
    streamLayerView = [streamLayerManager createViewWithEmitterDelegate: _emitterDelegate];
    [self addSubview:streamLayerView];
  }
  return self;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RCTStreamLayerFabricViewComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RCTStreamLayerFabricViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RCTStreamLayerFabricViewProps const>(props);


    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> RCTStreamLayerFabricViewCls(void)
{
    return RCTStreamLayerFabricView.class;
}


// Установка фрейма
- (void)layoutSubviews {
  [super layoutSubviews];
  streamLayerView.frame = self.bounds;
}

// Пример вызова метода hideMenu из Swift
- (void)hideMenu {
  [streamLayerManager hideMenuWithArgs:@{} promise:^(id result, NSError *error) {
    if (error) {
      NSLog(@"Error hiding menu: %@", error.localizedDescription);
    } else {
      NSLog(@"Menu hidden successfully");
    }
  }];
}

@end
#endif

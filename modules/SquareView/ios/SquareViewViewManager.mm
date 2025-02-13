#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"

@interface SquareViewViewManager : RCTViewManager
@end

@implementation SquareViewViewManager

RCT_EXPORT_MODULE(SquareViewView)

- (UIView *)view
{
  return [[UIView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(color, NSString)

@end

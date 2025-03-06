import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import type { DirectEventHandler, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

type WebViewScriptLoadedEvent = {
  result: 'success' | 'error';
};



interface NativeProps extends ViewProps {
  config?: {}; // Codegen требует именно этот синтаксис
  applyWindowInsets?: boolean;

  onRequestStream?: DirectEventHandler<Readonly<{ id: string }>>;
  onRequestAudioDucking?: DirectEventHandler<Readonly<{ level: Int32 }>>;
  onLBarStateChanged?: DirectEventHandler<Readonly<{ slideX: Int32; slideY: Int32 }>>;
  onDisableAudioDucking?: DirectEventHandler<Readonly<{}>>;
}

export default codegenNativeComponent<NativeProps>('RCTStreamLayerModuleView');

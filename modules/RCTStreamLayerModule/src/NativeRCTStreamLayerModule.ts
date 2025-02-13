import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter} from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  initSdk(config: Object): Promise<string>;
  createEventSession(name: string): Promise<void>;
  releaseEventSession(): Promise<void>;
  authorizationBypass(schema: string, token: string): Promise<void>;
  logout(): void;
  useAnonymousAuth(): Promise<void>;
  isUserAuthorized(): boolean;
  isInitialized(): boolean;
  getDemoEvents(date: string): Promise<Object>;
  getInvite(json: Object): Promise<any>;
  handleDeepLink(params: Object): Promise<void>;
  removeOverlay(): void;
  readonly onRequestStream: EventEmitter<{ id: string }>;
  readonly onLBarStateChanged: EventEmitter<{ slideX: number; slideY: number }>;
  readonly requestAudioDucking: EventEmitter<{ level: number }>;
  readonly disableAudioDucking: EventEmitter<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RCTStreamLayerModule');

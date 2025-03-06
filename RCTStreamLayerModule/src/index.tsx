export { default as RCTStreamLayerModuleView } from './RCTStreamLayerFabricViewNativeComponent';
export { StreamLayerView } from './internal/StreamLayerView';
export * from './api/barrel';

import RCTStreamLayerModule from './NativeRCTStreamLayerModule';

export function initSdk(config: object): Promise<string> {
  return RCTStreamLayerModule.initSdk(config);
}

export function createEventSession(name: string): Promise<void> {
  return RCTStreamLayerModule.createEventSession(name);
}

export function releaseEventSession(): Promise<void> {
  return RCTStreamLayerModule.releaseEventSession();
}

export function authorizationBypass(schema: string, token: string): Promise<void> {
  return RCTStreamLayerModule.authorizationBypass(schema, token);
}

export function logout(): void {
  return RCTStreamLayerModule.logout();
}

export function useAnonymousAuth(): Promise<void> {
  return RCTStreamLayerModule.useAnonymousAuth();
}

export function isUserAuthorized(): boolean {
  return RCTStreamLayerModule.isUserAuthorized();
}

export function isInitialized(): Promise<boolean> {
  return RCTStreamLayerModule.isInitialized();
}

export function getDemoEvents(date: string): Promise<Object> {
  return RCTStreamLayerModule.getDemoEvents(date);
}

export function getInvite(json: Object): Promise<any> {
  return RCTStreamLayerModule.getInvite(json);
}

export function handleDeepLink(params: Object): Promise<void> {
  return RCTStreamLayerModule.handleDeepLink(params);
}

export function removeOverlay(): void {
  return RCTStreamLayerModule.removeOverlay();
}

export default RCTStreamLayerModule;

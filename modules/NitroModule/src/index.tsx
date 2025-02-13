import { NitroModules } from 'react-native-nitro-modules';
import type { NitroModule } from './NitroModule.nitro';

const NitroModuleHybridObject =
  NitroModules.createHybridObject<NitroModule>('NitroModule');

export function multiply(a: number, b: number): number {
  return NitroModuleHybridObject.multiply(a, b);
}

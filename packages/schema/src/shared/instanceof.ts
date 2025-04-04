import { isFn, isStr } from './checkers';
import { globalThisPolyfill } from './global';

export const instOf = (value: any, cls: any) => {
  if (isFn(cls)) return value instanceof cls;
  if (isStr(cls)) {
    return globalThisPolyfill[cls] ? value instanceof globalThisPolyfill[cls] : false;
  }
  return false;
};

import { action } from './action';
import { isFn } from './checkers';
import { ObModelSymbol } from './environment';
import { isAnnotation, isObservable, isSupportObservable } from './externals';
import { getObservableMaker } from './internals';
import { observable } from './observable';
import { buildDataTree } from './tree';
import { Annotations } from './types';

export function define<Target extends object = any>(target: Target, annotations?: Annotations<Target>): Target {
  if (isObservable(target)) return target;
  if (!isSupportObservable(target)) return target;
  target[ObModelSymbol] = target;
  buildDataTree(undefined, undefined, target);
  for (const key in annotations) {
    const annotation = annotations[key];
    if (isAnnotation(annotation)) {
      getObservableMaker(annotation)({
        target,
        key,
      });
    }
  }
  return target;
}

export function model<Target extends object = any>(target: Target): Target {
  const annotations = Object.keys(target || {}).reduce((buf, key) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (descriptor && descriptor.get) {
      buf[key] = observable.computed;
    } else if (isFn(target[key])) {
      buf[key] = action;
    } else {
      buf[key] = observable;
    }
    return buf;
  }, {});
  return define(target, annotations);
}

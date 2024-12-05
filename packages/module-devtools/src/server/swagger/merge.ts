import { merge as deepmerge } from '@tachybase/utils';

const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray.concat(destinationArray);

export function merge(obj1: any, obj2: any, opts?: any) {
  return deepmerge(obj1, obj2, {
    arrayMerge: overwriteMerge,
    ...opts,
  });
}

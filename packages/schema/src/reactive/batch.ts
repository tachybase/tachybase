import { isFn } from './checkers';
import { BatchCount, BatchEndpoints } from './environment';
import { createBoundaryAnnotation } from './internals';
import { batchEnd, batchScopeEnd, batchScopeStart, batchStart } from './reaction';
import { IBatch } from './types';

export const batch: IBatch = createBoundaryAnnotation(batchStart, batchEnd);
batch.scope = createBoundaryAnnotation(batchScopeStart, batchScopeEnd);
batch.endpoint = (callback?: () => void) => {
  if (!isFn(callback)) return;
  if (BatchCount.value === 0) {
    callback();
  } else {
    BatchEndpoints.add(callback);
  }
};

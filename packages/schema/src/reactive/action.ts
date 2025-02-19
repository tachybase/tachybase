import { createBoundaryAnnotation } from './internals';
import { batchEnd, batchScopeEnd, batchScopeStart, batchStart, untrackEnd, untrackStart } from './reaction';
import { IAction } from './types';

export const action: IAction = createBoundaryAnnotation(
  () => {
    batchStart();
    untrackStart();
  },
  () => {
    untrackEnd();
    batchEnd();
  },
);

action.scope = createBoundaryAnnotation(
  () => {
    batchScopeStart();
    untrackStart();
  },
  () => {
    untrackEnd();
    batchScopeEnd();
  },
);

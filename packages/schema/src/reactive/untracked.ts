import { createBoundaryFunction } from './internals';
import { untrackEnd, untrackStart } from './reaction';

export const untracked = createBoundaryFunction(untrackStart, untrackEnd);

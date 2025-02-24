import { unstable_useCompatEffect } from '../../reactive-react';

interface IRecycleTarget {
  onMount: () => void;
  onUnmount: () => void;
}

export const useAttach = <T extends IRecycleTarget>(target: T): T => {
  unstable_useCompatEffect(() => {
    target.onMount();
    return () => target.onUnmount();
  }, [target]);
  return target;
};

import { Tracker } from '../../reactive';
import { IObserverOptions } from '../types';
import { useCompatFactory } from './useCompatFactory';
import { useForceUpdate } from './useForceUpdate';

export const useObserver = <T extends () => any>(view: T, options?: IObserverOptions): ReturnType<T> => {
  const forceUpdate = useForceUpdate();
  const tracker = useCompatFactory(
    () =>
      new Tracker(() => {
        if (typeof options?.scheduler === 'function') {
          options.scheduler(forceUpdate);
        } else {
          forceUpdate();
        }
      }, options?.displayName),
  );
  return tracker.track(view);
};

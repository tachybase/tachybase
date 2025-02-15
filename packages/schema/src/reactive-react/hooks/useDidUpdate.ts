import { useRef } from 'react';

import { immediate } from '../shared';
import { useLayoutEffect } from './useLayoutEffect';

export const useDidUpdate = (callback?: () => void) => {
  const request = useRef(null);
  request.current = immediate(callback);
  useLayoutEffect(() => {
    request.current();
    callback();
  });
};

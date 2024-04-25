/* global arguments */

export const uniqueId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return () => {
    const context = window;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
};

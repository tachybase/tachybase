import { useLayoutEffect as _useLayoutEffect, useEffect } from 'react';

export const useLayoutEffect = typeof document !== 'undefined' ? _useLayoutEffect : useEffect;

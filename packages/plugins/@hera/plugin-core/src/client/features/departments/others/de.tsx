import { wt } from './wt';

export var de = (w, s, n) =>
  s in w ? wt(w, s, { enumerable: true, configurable: true, writable: true, value: n }) : (w[s] = n);

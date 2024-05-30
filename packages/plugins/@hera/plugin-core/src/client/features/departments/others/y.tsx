import { de } from './de';
import { It, me, Tt } from './wt';

export var y = (w, s) => {
  for (var n in s || (s = {})) Tt.call(s, n) && de(w, n, s[n]);
  if (me) for (var n of me(s)) It.call(s, n) && de(w, n, s[n]);
  return w;
};

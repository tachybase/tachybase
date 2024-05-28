import { Ee, Fe, L } from './tools';
import { Ve } from './Ve';

export function B(e, t, o) {
  (o = o || {}),
    (o.arrayMerge = o.arrayMerge || Ee),
    (o.isMergeableObject = o.isMergeableObject || Fe),
    (o.cloneUnlessOtherwiseSpecified = L);
  var a = Array.isArray(t),
    r = Array.isArray(e),
    c = a === r;
  return c ? (a ? o.arrayMerge(e, t, o) : Ve(e, t, o)) : L(t, o);
}
B.all = function (t, o) {
  if (!Array.isArray(t)) throw new Error('first argument should be an array');
  return t.reduce(function (a, r) {
    return B(a, r, o);
  }, {});
};

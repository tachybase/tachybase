import { ae, L, qe, ce, Ke } from './tools';

export function Ve(e, t, o) {
  var a = {};
  return (
    o.isMergeableObject(e) &&
      ae(e).forEach(function (r) {
        a[r] = L(e[r], o);
      }),
    ae(t).forEach(function (r) {
      qe(e, r) || (ce(e, r) && o.isMergeableObject(t[r]) ? (a[r] = Ke(r, o)(e[r], t[r], o)) : (a[r] = L(t[r], o)));
    }),
    a
  );
}

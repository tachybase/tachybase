// import { TreeSelect } from 'antd';
import { B } from './B';

export var Fe = function (t) {
  return Me(t) && !Te(t);
};
function Me(e) {
  return !!e && typeof e == 'object';
}
function Te(e) {
  var t = Object.prototype.toString.call(e);
  return t === '[object RegExp]' || t === '[object Date]' || Pe(e);
}
var Ie = typeof Symbol == 'function' && Symbol.for,
  Oe = Ie ? Symbol.for('react.element') : 60103;
function Pe(e) {
  return e.$$typeof === Oe;
}
function ke(e) {
  return Array.isArray(e) ? [] : {};
}
export function L(e, t) {
  return t.clone !== false && t.isMergeableObject(e) ? B(ke(e), e, t) : e;
}
export function Ee(e, t, o) {
  return e.concat(t).map(function (a) {
    return L(a, o);
  });
}
export function Ke(e, t) {
  if (!t.customMerge) return B;
  var o = t.customMerge(e);
  return typeof o == 'function' ? o : B;
}
function Ne(e) {
  return Object.getOwnPropertySymbols
    ? Object.getOwnPropertySymbols(e).filter(function (t) {
        return Object.propertyIsEnumerable.call(e, t);
      })
    : [];
}
export function ae(e) {
  return Object.keys(e).concat(Ne(e));
}
export function ce(e, t) {
  try {
    return t in e;
  } catch (o) {
    return false;
  }
}
export function qe(e, t) {
  return ce(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
}

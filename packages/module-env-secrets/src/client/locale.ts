// @ts-ignore
import { useApp } from '@tachybase/client';

import pkg from './../../package.json';

export function useT() {
  const app = useApp();
  return (str: string) => app.i18n.t(str, { ns: [pkg.name, 'client'] });
}

export function tStr(key: string) {
  return `{{t(${JSON.stringify(key)}, { ns: ['${pkg.name}', 'client'], nsMode: 'fallback' })}}`;
}

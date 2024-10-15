import { i18n, tval as nTval, useApp } from '@tachybase/client';

export const NAMESPACE = '@hera/plugin-data-source-external';

// NOTE: 保持翻译统一经由这里处理, 所有本插件内的翻译方法从这里统一导出
export const tval = (key: string, useCore = false) => nTval(key, { ns: useCore ? undefined : NAMESPACE });

export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: NAMESPACE });
}

export const useTranslation = (useCore = false): any => {
  const { i18n } = useApp();
  const t = (key: string, props = {}) =>
    i18n.t(key, {
      ns: useCore ? undefined : NAMESPACE,
      ...props,
    });
  return { t };
};

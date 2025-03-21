import { TOptions } from 'i18next';

// TODO 类型定义
export function tval(text: any | any[], options?: TOptions) {
  if (options) {
    return `{{t(${JSON.stringify(text)}, ${JSON.stringify(options)})}}`;
  }
  return `{{t(${JSON.stringify(text)})}}`;
}

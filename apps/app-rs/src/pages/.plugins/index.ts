import * as others from '../../../../../packages/module-pdf/src/client';
import packageMap from './packageMap.json';

type PackageName = keyof typeof packageMap;

async function devDynamicImport(packageName: PackageName) {
  console.log('🚀 ~ file: index.ts:10 ~ devDynamicImport ~ packageName:', packageName);
  const fileName = packageMap[packageName];
  if (!fileName) {
    return Promise.resolve(null);
  }
  // FIXME: 需要处理这个模块的加载问题
  if (packageName === '@tachybase/module-pdf') {
    return { ...others };
  }
  return await import(`./packages/${fileName}`);
}
export default devDynamicImport;

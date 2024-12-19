import * as others from '../../../packages/module-pdf/src/client';
import packageMap from './pages/.plugins/packageMap.json';

type PackageName = keyof typeof packageMap;

async function devDynamicImport(packageName: PackageName) {
  const fileName = packageMap[packageName];
  if (!fileName) {
    return Promise.resolve(null);
  }
  // FIXME: 需要处理这个模块的加载问题
  if (packageName === '@tachybase/module-pdf') {
    return { ...others };
  }
  return await import(`./pages/.plugins/packages/${fileName}`);
}
export default devDynamicImport;

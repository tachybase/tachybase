import * as others from '../../../packages/module-pdf/src/client';

async function devDynamicImport(packageName: string) {
  if (process.env.NODE_ENV !== 'production') {
    const packageMap = (await import('./.plugins/packageMap.json')).default as Record<string, string>;
    const fileName = packageMap[packageName];
    if (!fileName) {
      return Promise.resolve(null);
    }
    // FIXME: 需要处理这个模块的加载问题
    if (packageName === '@tachybase/module-pdf') {
      return { ...others };
    }
    return await import(`./.plugins/packages/${fileName}`);
  } else {
    return null;
  }
}
export default devDynamicImport;

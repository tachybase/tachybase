import packageMap from './packageMap.json';

type PackageName = keyof typeof packageMap;

async function devDynamicImport(packageName: PackageName) {
  const fileName = packageMap[packageName];
  if (!fileName) {
    return Promise.resolve(null);
  }
  return await import(`./packages/${fileName}`);
}
export default devDynamicImport;

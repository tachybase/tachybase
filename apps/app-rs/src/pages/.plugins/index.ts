// @ts-nocheck
import packageMap from './packageMap.json';

async function devDynamicImport(packageName: string) {
  const fileName = packageMap[packageName];
  console.log('🚀 ~ file: index.ts:6 ~ devDynamicImport ~ fileName:', fileName);
  if (!fileName) {
    return Promise.resolve(null);
  }
  console.log('🚀 ~ file: index.ts:12 ~ devDynamicImport ~ result:', `./packages/${fileName}`);
  const result2 = await import(`./packages/${fileName}`);
  console.log('🚀 ~ file: index.ts:12 ~ devDynamicImport ~ result:', result2);
  if (result2.PluginName) {
  return { default: (await import(`./packages/${fileName}`))[result2.PluginName] };
  } else {
  return await import(`./packages/${fileName}`);
  }
}
export default devDynamicImport;

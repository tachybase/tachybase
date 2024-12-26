async function devDynamicImport(packageName: string) {
  if (process.env.NODE_ENV !== 'production') {
    const packageMap = (await import('./.plugins/packageMap.json')).default as Record<string, string>;
    const fileName = packageMap[packageName];
    if (!fileName) {
      return Promise.resolve(null);
    }
    return await import(`./.plugins/packages/${fileName}`);
  } else {
    return null;
  }
}
export default devDynamicImport;

import Application from '@tachybase/server';

import * as fileConvert from './fileConvert';
import * as ocrConvert from './ocrConvert';

function make(name, mod) {
  return Object.keys(mod).reduce(
    (result, key) => ({
      ...result,
      [`${name}:${key}`]: mod[key],
    }),
    {},
  );
}
export function initActions(app: Application) {
  app.actions({
    ...make('ocr_providers', { ...ocrConvert, ...fileConvert }),
  });
}

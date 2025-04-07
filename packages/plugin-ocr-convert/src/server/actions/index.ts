import * as ocr from './ocr';

function make(name, mod) {
  return Object.keys(mod).reduce(
    (result, key) => ({
      ...result,
      [`${name}:${key}`]: mod[key],
    }),
    {},
  );
}
export function init({ app }) {
  app.actions({
    ...make('ocr', ocr),
  });
}

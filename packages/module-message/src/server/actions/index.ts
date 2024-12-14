import { COLLECTION_NAME_MESSAGES } from '../../common/messages.collection';
import { messages } from './messages';

function make(name, mod) {
  return Object.keys(mod).reduce(
    (result, key) => ({
      ...result,
      [`${name}:${key}`]: mod[key],
    }),
    {},
  );
}

export function initActions({ app }) {
  app.actions({
    ...make(COLLECTION_NAME_MESSAGES, messages),
  });
}

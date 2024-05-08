import { Collection } from '@tachybase/database';
import schemas from './schemas';
import parameters from './parameters';

export default (collection: Collection, options) => {
  return {
    ...schemas(collection, options),
    ...parameters(collection),
  };
};

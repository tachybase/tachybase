import { Collection } from '@tachybase/database';

import associations from './associations';
import list from './collection';

export default (collection: Collection, options) => {
  const paths = list(collection);

  if (options.withAssociation && !isViewCollection(collection)) {
    Object.assign(paths, associations(collection));
  }

  return paths;
};

export function hasSortField(collection: Collection) {
  for (const field of collection.fields.values()) {
    if (field.type === 'sort') {
      return true;
    }
  }

  return false;
}

export function readOnlyCollection(collection: Collection) {
  return isViewCollection(collection) && collection.options?.writableView == false;
}

export function isViewCollection(collection: Collection) {
  return collection.isView();
}

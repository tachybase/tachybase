import { Collection } from '@tachybase/database';

type TraverseOptions = {
  collection: Collection;
  exclude?: string[];
  include?: string[];
  through?: string;
  excludePk?: boolean;
};

const traverseHasMany = (arr: any[], { collection, exclude = [], include = [] }: TraverseOptions) => {
  if (!arr) {
    return arr;
  }
  return arr.map((item) => traverseJSON(item, { collection, exclude, include }));
};

const traverseBelongsToMany = (arr: any[], { collection, exclude = [], through }: TraverseOptions) => {
  if (!arr) {
    return arr;
  }
  const throughCollection = collection.db.getCollection(through);
  return arr.map((item) => {
    const data = traverseJSON(item[through], { collection: throughCollection, exclude });
    if (data && Object.keys(data).length) {
      item[through] = data;
    } else {
      delete item[through];
    }
    return traverseJSON(item, {
      collection,
      excludePk: false,
    });
  });
};

const parseInclude = (keys: string[]) => {
  const map = {};
  for (const key of keys) {
    const args = key.split('.');
    const field = args.shift();
    map[field] = map[field] || [];
    if (args.length) {
      map[field].push(args.join('.'));
    }
  }
  return map;
};

export const traverseJSON = (data, options: TraverseOptions) => {
  if (!data) {
    return data;
  }
  const { collection, exclude = [], include = [], excludePk = true } = options;
  const map = parseInclude(include);
  const result = {};
  for (const key of Object.keys(data || {})) {
    const subInclude = map[key];
    if (include.length > 0 && !subInclude) {
      continue;
    }
    if (exclude.includes(key)) {
      continue;
    }
    if (['createdAt', 'updatedAt', 'createdBy', 'createdById', 'updatedById', 'updatedBy'].includes(key)) {
      continue;
    }
    const field = collection.getField(key);
    if (!field) {
      result[key] = data[key];
      continue;
    }
    if (field.options.primaryKey && excludePk) {
      continue;
    }
    if (field.options.isForeignKey) {
      continue;
    }
    if (['sort', 'password', 'sequence'].includes(field.type)) {
      continue;
    }
    if (field.type === 'hasOne') {
      result[key] = traverseJSON(data[key], {
        collection: collection.db.getCollection(field.target),
        exclude: [field.foreignKey],
        include: subInclude,
      });
    } else if (field.type === 'hasMany') {
      result[key] = traverseHasMany(data[key], {
        collection: collection.db.getCollection(field.target),
        exclude: [field.foreignKey],
        include: subInclude,
      });
    } else if (field.type === 'belongsTo') {
      result[key] = traverseJSON(data[key], {
        collection: collection.db.getCollection(field.target),
        // exclude: [field.foreignKey],
        include: subInclude,
        excludePk: false,
      });
    } else if (field.type === 'belongsToMany') {
      result[key] = traverseBelongsToMany(data[key], {
        collection: collection.db.getCollection(field.target),
        exclude: [field.foreignKey, field.otherKey],
        through: field.through,
      });
    } else {
      result[key] = data[key];
    }
  }
  return result;
};

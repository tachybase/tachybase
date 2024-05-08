import { extendCollection } from '@tachybase/database';

export default extendCollection({
  name: 'applications',
  fields: [
    {
      type: 'belongsToMany',
      name: 'collectionBlacklist',
      through: 'appCollectionBlacklist',
      target: 'collections',
      targetKey: 'name',
      otherKey: 'collectionName',
      sourceKey: 'name',
      foreignKey: 'applicationName',
    },
  ],
});

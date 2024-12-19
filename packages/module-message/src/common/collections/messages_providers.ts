export const COLLECTION_NAME_MESSAGES_PROVIDERS = 'messages_providers';

export default {
  dumpRules: {
    group: 'third-party',
  },
  name: COLLECTION_NAME_MESSAGES_PROVIDERS,
  shared: true,
  fields: [
    {
      type: 'string',
      name: 'id',
      primaryKey: true,
    },
    {
      type: 'string',
      name: 'title',
    },
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'jsonb',
      name: 'options',
    },
    {
      type: 'radio',
      name: 'default',
    },
  ],
};

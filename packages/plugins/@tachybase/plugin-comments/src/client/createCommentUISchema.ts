export const createCommentUISchema = ({
  collectionName,
  dataSource,
  association,
  rowKey,
}: {
  collectionName?: string;
  dataSource: string;
  association?: string;
  rowKey: string;
}) => {
  return {
    type: 'void',
    'x-acl-action': `${association || collectionName}:view`,
    'x-decorator': 'Comment.Decorator',
    'x-use-decorator-props': 'useCommentBlockDecoratorProps',
    'x-decorator-props': {
      collection: collectionName,
      dataSource: dataSource,
      association: association,
      readPretty: true,
      action: 'list',
      runWhenParamsChanged: true,
    },
    'x-component': 'CardItem',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:comment',
    properties: {
      list: {
        type: 'array',
        'x-component': 'Comment.List',
        properties: {
          item: {
            type: 'object',
            'x-component': 'Comment.Item',
            'x-read-pretty': true,
            properties: {
              actionBar: {
                type: 'void',
                'x-align': 'left',
                'x-initializer': 'comment:configureItemActions',
                'x-component': 'ActionBar',
                'x-component-props': { layout: 'one-column' },
              },
            },
          },
        },
      },
      submit: {
        type: 'string',
        'x-component': 'Comment.Submit',
        'x-acl-action': `${association || collectionName}:create`,
        'x-decorator': 'ACLCollectionProvider',
        'x-decorator-props': { collection: collectionName, dataSource, association },
      },
    },
  };
};

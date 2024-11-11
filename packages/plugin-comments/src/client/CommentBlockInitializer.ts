import { useContext } from 'react';
import {
  DataBlockInitializer,
  useCollectionManager_deprecated,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { SchemaOptionsContext } from '@tachybase/schema';

import { CommentOutlined } from '@ant-design/icons';
import jsxRuntime from 'react/jsx-runtime';

import { createCommentUISchema } from './createCommentUISchema';

export const CommentBlockInitializer = ({
  filterCollections,
  filterOtherRecordsCollection,
  onlyCurrentDataSource,
  hideSearch,
  showAssociationFields,
  hideOtherRecordsInPopup,
}) => {
  const { insert } = useSchemaInitializer();
  const item = useSchemaInitializerItem();
  useContext(SchemaOptionsContext);
  const { getCollection: d } = useCollectionManager_deprecated();
  return jsxRuntime.jsx(DataBlockInitializer, {
    ...item,
    componentType: 'Comment',
    icon: jsxRuntime.jsx(CommentOutlined, {}),
    onlyCurrentDataSource: onlyCurrentDataSource,
    hideSearch: hideSearch,
    filter: filterCollections,
    filterOtherRecordsCollection: filterOtherRecordsCollection,
    showAssociationFields: showAssociationFields,
    hideOtherRecordsInPopup: hideOtherRecordsInPopup,
    onCreateBlockSchema: async ({ item, fromOthersInPopup }) => {
      const P = d(item.name, item.dataSource);
      const field = item.associationField;
      insert(
        createCommentUISchema(
          field && !fromOthersInPopup
            ? {
                dataSource: item.dataSource,
                rowKey: P.filterTargetKey || 'id',
                association: `${field.collectionName}.${field.name}`,
              }
            : { collectionName: item.name, dataSource: item.dataSource, rowKey: P.filterTargetKey || 'id' },
        ),
      );
    },
  });
};

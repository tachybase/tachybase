import {
  useSchemaInitializer,
  useSchemaInitializerItem,
  useCollectionManager_deprecated,
  DataBlockInitializer,
} from '@tachybase/client';
import { useContext } from 'react';
import jsxRuntime from 'react/jsx-runtime';
import { CommentOutlined } from '@ant-design/icons';
import { SchemaOptionsContext } from '@tachybase/schema';
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

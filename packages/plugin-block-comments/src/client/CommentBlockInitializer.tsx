import { useContext } from 'react';
import {
  DataBlockInitializer,
  useCollectionManager_deprecated,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { SchemaOptionsContext } from '@tachybase/schema';

import { CommentOutlined } from '@ant-design/icons';

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
  const { getCollection } = useCollectionManager_deprecated();

  const onCreateBlockSchema = async ({ item, fromOthersInPopup }) => {
    const collection = getCollection(item.name, item.dataSource);
    const field = item.associationField;
    insert(
      createCommentUISchema(
        field && !fromOthersInPopup
          ? {
              dataSource: item.dataSource,
              rowKey: collection.filterTargetKey || 'id',
              association: `${field.collectionName}.${field.name}`,
            }
          : { collectionName: item.name, dataSource: item.dataSource, rowKey: collection.filterTargetKey || 'id' },
      ),
    );
  };

  return (
    <DataBlockInitializer
      {...item}
      componentType="Comment"
      icon={<CommentOutlined />}
      onlyCurrentDataSource={onlyCurrentDataSource}
      hideSearch={hideSearch}
      filter={filterCollections}
      filterOtherRecordsCollection={filterOtherRecordsCollection}
      showAssociationFields={showAssociationFields}
      hideOtherRecordsInPopup={hideOtherRecordsInPopup}
      onCreateBlockSchema={onCreateBlockSchema}
    />
  );
};

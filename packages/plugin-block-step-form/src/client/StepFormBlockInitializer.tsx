import {
  DataBlockInitializer,
  Icon,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';

import getSchemaStepFormBlockInitializer from './StepFormBlockInitializer.schema';

const StepFormBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const cm = useCollectionManager();
  const itemConfig = useSchemaInitializerItem();

  const handleCreateBlockSchema = async ({ item }) => {
    const collection = cm.getCollection(item.name);
    const remoteSchema = getSchemaStepFormBlockInitializer({ collection, isEdit: false });

    insert(remoteSchema);
  };

  return (
    <DataBlockInitializer
      {...itemConfig}
      componentType="StepForm"
      icon={<Icon type="RightSquareOutlined" />}
      onCreateBlockSchema={handleCreateBlockSchema}
    />
  );
};

export default StepFormBlockInitializer;

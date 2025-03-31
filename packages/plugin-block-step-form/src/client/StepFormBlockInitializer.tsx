import { DataBlockInitializer, Icon, useSchemaInitializerItem } from '@tachybase/client';

const StepFormBlockInitializer = () => {
  const commonItemConfig = useSchemaInitializerItem();

  const handleCreateBlockSchema = () => {};

  return (
    <DataBlockInitializer
      {...commonItemConfig}
      componentType="StepForm"
      icon={<Icon type="RightSquareOutlined" />}
      onCreateBlockSchema={handleCreateBlockSchema}
    />
  );
};

export default StepFormBlockInitializer;

import React from 'react';
import { GeneralSchemaDesigner, useCollection, useSchemaTemplate } from '@tachybase/client';

export const MapBlockDesigner = () => {
  const { name, title } = useCollection();
  const template = useSchemaTemplate();

  return (
    <GeneralSchemaDesigner
      schemaSettings="blockSettings:map"
      template={template}
      title={title || name}
    ></GeneralSchemaDesigner>
  );
};

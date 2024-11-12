import React from 'react';
import { GeneralSchemaDesigner, useCollection_deprecated, useSchemaTemplate } from '@tachybase/client';

export const GanttDesigner = () => {
  const { name, title } = useCollection_deprecated();
  const template = useSchemaTemplate();

  return (
    <GeneralSchemaDesigner
      schemaSettings="blockSettings:gantt"
      template={template}
      title={title || name}
    ></GeneralSchemaDesigner>
  );
};

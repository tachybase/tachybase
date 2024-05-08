import React from 'react';
import { useCollection_deprecated, GeneralSchemaDesigner, useSchemaTemplate } from '@tachybase/client';

export const KanbanDesigner = () => {
  const { name, title } = useCollection_deprecated();
  const template = useSchemaTemplate();

  return (
    <GeneralSchemaDesigner
      schemaSettings="blockSettings:kanban"
      template={template}
      title={title || name}
    ></GeneralSchemaDesigner>
  );
};

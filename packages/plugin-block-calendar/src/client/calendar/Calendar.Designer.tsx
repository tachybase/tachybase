import React from 'react';
import { GeneralSchemaDesigner, useCollection, useSchemaTemplate } from '@tachybase/client';

export const CalendarDesigner = () => {
  const { name, title } = useCollection();
  const template = useSchemaTemplate();

  return (
    <GeneralSchemaDesigner
      schemaSettings="blockSettings:calendar"
      template={template}
      title={title || name}
    ></GeneralSchemaDesigner>
  );
};

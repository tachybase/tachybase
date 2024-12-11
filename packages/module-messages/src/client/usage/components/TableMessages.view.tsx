import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { usePropsActionSetHaveReaded } from '../hooks/usePropsActionSetHaveReaded';
import { ViewCheckLink } from './CheckLink.view';
import { ColumnShowJSON } from './ColumnShowJSON';
import { ColumnShowURL } from './ColumnShowURL';
import { ViewDeleteLink } from './DeleteLink.view';
import { schemaTableMessages as schema } from './TableMessages.schema';

export const ViewTableMessages = () => {
  return (
    <SchemaComponent
      schema={schema}
      components={{
        ViewCheckLink: ViewCheckLink,
        ViewDeleteLink: ViewDeleteLink,
        ColumnShowURL: ColumnShowURL,
        ColumnShowJSON: ColumnShowJSON,
      }}
      scope={{
        usePropsActionSetHaveReaded: usePropsActionSetHaveReaded,
      }}
    />
  );
};

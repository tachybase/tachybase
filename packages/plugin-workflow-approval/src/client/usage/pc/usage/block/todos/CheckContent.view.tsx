import React from 'react';
import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useFormBlockContext,
} from '@tachybase/client';
import { DetailsBlockProvider } from '@tachybase/module-workflow/client';

import _ from 'lodash';

import { FormBlockProvider } from '../../../../../common/components/FormBlock.provider';
import { SchemaComponentContextProvider } from '../common/SchemaComponent.provider';
import { getSchemaActionTodosContent } from './CheckContent.schema';
import { useApprovalDetailBlockProps } from './hooks/useApprovalDetailBlockProps';
import { useApprovalFormBlockProps } from './hooks/useApprovalFormBlockProps';
import { useSubmit } from './hooks/useSubmit';
import { ActionBarProvider } from './providers/ActionBar.provider';
import { ApprovalActionProvider } from './providers/ApprovalAction.provider';
import { ApprovalFormBlockProvider } from './providers/ApprovalFormBlock.provider';

export const ViewCheckContent = (props) => {
  const { id, node, actionEnabled } = props;
  const schema = getSchemaActionTodosContent({ id, node, actionEnabled });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        SchemaComponentProvider,
        RemoteSchemaComponent,
        SchemaComponentContextProvider,
        FormBlockProvider,
        ActionBarProvider,
        ApprovalActionProvider,
        ApprovalFormBlockProvider,
        DetailsBlockProvider,
      }}
      scope={{
        useApprovalDetailBlockProps,
        useApprovalFormBlockProps,
        useDetailsBlockProps: useFormBlockContext,
        useSubmit,
      }}
    />
  );
};

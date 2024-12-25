import React, { useContext } from 'react';
import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useFormBlockContext,
} from '@tachybase/client';
import { DetailsBlockProvider } from '@tachybase/module-workflow/client';
import { useForm } from '@tachybase/schema';

import { FormBlockProvider } from '../../../common/FormBlock.provider';
import { ContextWithActionEnabled } from '../../common/WithActionEnabled.provider';
import { SchemaComponentContextProvider } from '../common/SchemaComponent.provider';
import { getSchemaCheckContent } from './CheckContent.schema';
import { useActionReminder } from './hooks/useActionReminder';
import { useActionResubmit } from './hooks/useActionResubmit';
import { useDestroyAction } from './hooks/useDestroyAction';
import { useFormBlockProps } from './hooks/useFormBlockProps';
import { useSubmitUpdate } from './hooks/useSubmitUpdate';
import { useWithdrawAction } from './hooks/useWithdrawAction';
import { ActionBarProvider } from './providers/ActionBar.provider';
import { ProviderActionReminder } from './providers/ActionReminder.provider';
import { ProviderActionResubmit } from './providers/ActionResubmit.provider';
import { ProviderApplyActionStatus } from './providers/ApplyActionStatus.provider';
import { WithdrawActionProvider } from './WithdrawAction.provider';

export const ViewCheckContent = (props) => {
  const { approval, workflow } = props;
  const { actionEnabled } = useContext(ContextWithActionEnabled);

  const schema = getSchemaCheckContent({ approval, workflow, needHideProcess: actionEnabled });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        SchemaComponentProvider,
        RemoteSchemaComponent,
        SchemaComponentContextProvider,
        FormBlockProvider,
        ActionBarProvider,
        ApplyActionStatusProvider: ProviderApplyActionStatus,
        WithdrawActionProvider,
        DetailsBlockProvider,
        ProviderActionResubmit,
        ProviderActionReminder,
      }}
      scope={{
        useForm,
        useSubmit: useSubmitUpdate,
        useFormBlockProps,
        useDetailsBlockProps: useFormBlockContext,
        useWithdrawAction,
        useDestroyAction,
        useActionResubmit,
        useActionReminder,
      }}
    />
  );
};

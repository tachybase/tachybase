import React, { useContext } from 'react';
import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useFormBlockContext,
} from '@tachybase/client';
import { DetailsBlockProvider } from '@tachybase/module-workflow/client';
import { useForm } from '@tachybase/schema';

import { FormBlockProvider } from '../../../../common/components/FormBlock.provider';
import { ContextWithActionEnabled } from '../../common/WithActionEnabled.provider';
import { useActionReminder } from '../common/hooks/useActionReminder';
import { useActionResubmit } from '../common/hooks/useActionResubmit';
import { useWithdrawAction } from '../common/hooks/useWithdrawAction';
import { ProviderActionReminder } from '../common/providers/ActionReminder.provider';
import { SchemaComponentContextProvider } from '../common/providers/SchemaComponentContextProvider';
import { WithdrawActionProvider } from '../common/providers/WithdrawAction.provider';
import { getSchemaCheckContent } from './CheckContent.schema';
import { useDestroyAction } from './hooks/useDestroyAction';
import { useFormBlockProps } from './hooks/useFormBlockProps';
import { useSubmitUpdate } from './hooks/useSubmitUpdate';
import { ActionBarProvider } from './providers/ActionBar.provider';
import { ProviderActionResubmit } from './providers/ActionResubmit.provider';
import { ProviderApplyActionStatus } from './providers/ApplyActionStatus.provider';

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

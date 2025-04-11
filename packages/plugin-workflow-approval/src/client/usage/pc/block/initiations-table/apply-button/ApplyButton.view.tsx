import { CollectionProvider_deprecated, RemoteSchemaComponent, SchemaComponent } from '@tachybase/client';
import { ProviderContextWorkflow } from '@tachybase/module-workflow/client';

import { useActionResubmit } from '../hooks/useActionResubmit';
import { ActionBarProvider } from './ActionBar.provider';
import { ApplyActionStatusProvider } from './ActionStatus.provider';
import { WithdrawActionProvider } from './ActionWithdraw.provider';
import { useSubmitCreate } from './hooks/useSubmitCreate';
import { useWithdrawAction } from './hooks/useWithdrawAction';

// 审批-发起: 发起按钮
export const ViewApplyButton = (props) => {
  const { schema } = props;
  return (
    <SchemaComponent
      schema={schema}
      components={{
        RemoteSchemaComponent,
        CollectionProvider_deprecated,
        ProviderContextWorkflow,
        ApplyActionStatusProvider,
        ActionBarProvider,
        ProviderActionResubmit: () => null,
        WithdrawActionProvider,
      }}
      scope={{
        useSubmit: useSubmitCreate,
        useWithdrawAction,
        useActionResubmit,
      }}
    />
  );
};

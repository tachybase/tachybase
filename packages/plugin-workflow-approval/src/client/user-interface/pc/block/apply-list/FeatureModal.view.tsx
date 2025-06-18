import { useContext } from 'react';
import {
  ActionContextProvider,
  CollectionProvider_deprecated,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
} from '@tachybase/client';
import { ProviderContextWorkflow } from '@tachybase/module-workflow/client';

import { useActionReminder } from '../common/hooks/useActionReminder';
import { useActionResubmit } from '../common/hooks/useActionResubmit';
import { useSubmitCreate } from '../common/hooks/useSubmitCreate';
import { useWithdrawAction } from '../common/hooks/useWithdrawAction';
import { ActionBarProvider } from '../common/providers/ActionBar.provider';
import { ProviderActionReminder } from '../common/providers/ActionReminder.provider';
import { ApplyActionStatusProvider } from '../common/providers/ActionStatus.provider';
import { WithdrawActionProvider } from '../common/providers/ActionWithdraw.provider';
import { getSchemaFeatureModal } from './FeatureModal.schema';

export const ViewFeatureModal = (props) => {
  const { visible, setVisible, workflow } = props;
  const schema = getSchemaFeatureModal(workflow);
  const context = useContext(SchemaComponentContext);
  return (
    <ActionContextProvider value={{ visible, setVisible }}>
      <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
        <SchemaComponent
          schema={schema}
          components={{
            RemoteSchemaComponent,
            CollectionProvider_deprecated,
            ProviderContextWorkflow,
            ApplyActionStatusProvider,
            ActionBarProvider,
            WithdrawActionProvider,
            ProviderActionReminder,
            ProviderActionResubmit: () => null,
          }}
          scope={{
            useSubmit: useSubmitCreate,
            useWithdrawAction,
            useActionResubmit,
            useActionReminder,
          }}
        />
      </SchemaComponentContext.Provider>
    </ActionContextProvider>
  );
};

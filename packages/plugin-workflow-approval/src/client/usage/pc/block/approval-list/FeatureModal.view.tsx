import { useContext } from 'react';
import {
  ActionContextProvider,
  CollectionProvider_deprecated,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
} from '@tachybase/client';
import { ProviderContextWorkflow } from '@tachybase/module-workflow/client';

import { ActionBarProvider } from '../initiations-table/apply-button/ActionBar.provider';
import { ApplyActionStatusProvider } from '../initiations-table/apply-button/ActionStatus.provider';
import { WithdrawActionProvider } from '../initiations-table/apply-button/ActionWithdraw.provider';
import { useSubmitCreate } from '../initiations-table/apply-button/hooks/useSubmitCreate';
import { useActionReminder } from '../initiations-table/hooks/useActionReminder';
import { useActionResubmit } from '../initiations-table/hooks/useActionResubmit';
import { useWithdrawAction } from '../initiations-table/hooks/useWithdrawAction';
import { ProviderActionReminder } from '../initiations-table/providers/ActionReminder.provider';
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
            FlowContextProvider: ProviderContextWorkflow,
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

import { useContext } from 'react';
import {
  ActionContextProvider,
  CollectionProvider_deprecated,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
} from '@tachybase/client';
import { ProviderContextWorkflow } from '@tachybase/module-workflow/client';

import { ActionBarProvider } from '../table-initiations/apply-button/ActionBar.provider';
import { ApplyActionStatusProvider } from '../table-initiations/apply-button/ActionStatus.provider';
import { WithdrawActionProvider } from '../table-initiations/apply-button/ActionWithdraw.provider';
import { useSubmitCreate } from '../table-initiations/apply-button/hooks/useSubmitCreate';
import { useActionReminder } from '../table-initiations/hooks/useActionReminder';
import { useActionResubmit } from '../table-initiations/hooks/useActionResubmit';
import { useWithdrawAction } from '../table-initiations/hooks/useWithdrawAction';
import { ProviderActionReminder } from '../table-initiations/providers/ActionReminder.provider';
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

import { useContext } from 'react';
import {
  ActionContextProvider,
  CollectionProvider_deprecated,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
} from '@tachybase/client';

import { FlowContextProvider } from './common/FlowContext.provider';
import { getSchemaFeatureModal } from './FeatureModal.schema';
import { ActionBarProvider } from './initiations/apply-button/ActionBar.provider';
import { ApplyActionStatusProvider } from './initiations/apply-button/ActionStatus.provider';
import { WithdrawActionProvider } from './initiations/apply-button/ActionWithdraw.provider';
import { useSubmitCreate } from './initiations/apply-button/hooks/useSubmitCreate';
import { useActionReminder } from './initiations/hooks/useActionReminder';
import { useActionResubmit } from './initiations/hooks/useActionResubmit';
import { useWithdrawAction } from './initiations/hooks/useWithdrawAction';
import { ProviderActionReminder } from './initiations/providers/ActionReminder.provider';

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
            FlowContextProvider,
            ApplyActionStatusProvider,
            ActionBarProvider,
            ProviderActionResubmit: () => null,
            WithdrawActionProvider,
            ProviderActionReminder,
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

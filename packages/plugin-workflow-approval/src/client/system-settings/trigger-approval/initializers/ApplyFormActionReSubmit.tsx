import React from 'react';
import { ActionInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { NAMESPACE } from '../../../locale';

// setup-action-resubmit
export const ApplyFormActionReSubmit = () => {
  const itemConfig = useSchemaInitializerItem();
  const { action, actionProps = {}, ...restItemConfig } = itemConfig;
  return (
    <ActionInitializer
      {...restItemConfig}
      schema={{
        type: 'void',
        title: restItemConfig.title,
        'x-decorator': 'ProviderActionResubmit',
        'x-decorator-props': {
          status: action,
        },
        'x-component': 'Action',
        'x-component-props': {
          ...actionProps,
          confirm: {
            title: `{{t('Resubmit', { ns: "${NAMESPACE}" })}}`,
            content: `{{t('Are you sure you want to resubmit it?', { ns: "${NAMESPACE}" })}}`,
          },
          useAction: '{{ useActionResubmit }}',
        },
        'x-designer': 'Action.Designer',
        'x-action': `Resubmit`,
        'x-action-settings': {
          assignedValues: {},
        },
      }}
    />
  );
};

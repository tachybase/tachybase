import React from 'react';
import {
  BlockInitializer,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { merge, uid } from '@tachybase/schema';

import { useCustomRequestsResource } from '../hooks/useCustomRequestsResource';
import { useTranslation } from '../locale';

export const CustomRequestInitializer: React.FC<any> = (props) => {
  const customRequestsResource = useCustomRequestsResource();
  const { t } = useTranslation();
  const schema = {
    title: '{{ t("Custom request") }}',
    'x-component': 'CustomRequestAction',
    'x-action': 'customize:form:request',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:customRequest',
    'x-decorator': 'CustomRequestAction.Decorator',
    'x-uid': uid(),
    'x-action-settings': {
      onSuccess: {
        manualClose: false,
        redirecting: false,
        successMessage: t('Request success'),
      },
    },
  };

  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      onClick={async () => {
        const s = merge(schema || {}, itemConfig.schema || {});
        itemConfig?.schemaInitialize?.(s);

        // create a custom request
        await customRequestsResource.create({
          values: {
            key: s['x-uid'],
          },
        });

        insert(s);
      }}
    />
  );
};

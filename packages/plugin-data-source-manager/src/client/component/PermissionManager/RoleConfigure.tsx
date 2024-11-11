import React, { useContext } from 'react';
import { SchemaComponent, useAPIClient, useRecord, useRequest } from '@tachybase/client';
import { onFieldChange } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { CurrentRolesContext } from './';
import { PermissionContext } from './PermisionProvider';

export const RoleConfigure = () => {
  const { update } = useContext(PermissionContext);
  const { t } = useTranslation();
  const { key } = useRecord();
  return (
    <SchemaComponent
      schema={{
        type: 'void',
        name: 'form',
        'x-component': 'Form',
        'x-component-props': {
          useValues: (options) => {
            const api = useAPIClient();
            const role = useContext(CurrentRolesContext);
            return useRequest(
              () =>
                api
                  .resource(`dataSources/${key}/roles`)
                  .get({
                    filterByTk: role.name,
                  })
                  .then((res) => {
                    const record = res?.data?.data;
                    record.snippets?.forEach((key) => {
                      record[key] = true;
                    });
                    return { data: record };
                  }),
              options,
            );
          },
          effects() {
            onFieldChange('*', async (field, form) => {
              if (!form.modified) {
                return;
              }
              await update(field, form);
            });
          },
        },
        properties: {
          'strategy.actions': {
            // title: t('Global action permissions'),
            description: t(
              'All collections use general action permissions by default; permission configured individually will override the default one.',
            ),
            'x-component': 'StrategyActions',
            // 'x-decorator': 'FormItem',
          },
        },
      }}
    />
  );
};

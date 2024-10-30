import React from 'react';
import {
  createFormBlockSchema,
  SchemaInitializerItem,
  useCollection_deprecated,
  useRecordCollectionDataSourceItems,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaTemplateManager,
} from '@tachybase/client';

import { APPROVAL_STATUS, flatSchemaArray } from '../../../constants';
import { NAMESPACE } from '../../../locale';

// 添加区块-Initializer的component
export const LauncherAddBlockButtonComponent = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const collection = useCollection_deprecated();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const items = useRecordCollectionDataSourceItems('FormItem');

  const onClick = async ({ item }) => {
    const template = item.template ? await getTemplateSchemaByMode(item) : null;
    const {
      ['x-acl-action-props']: deleteA,
      ['x-acl-action']: deleteB,
      ...formSchema
    } = createFormBlockSchema({
      actionInitializers: 'LauncherActionConfigInitializer',
      actions: {
        submit: {
          type: 'void',
          title: '{{t("Submit")}}',
          'x-decorator': 'ApplyActionStatusProvider',
          'x-decorator-props': {
            value: APPROVAL_STATUS.SUBMITTED,
          },
          'x-component': 'Action',
          'x-component-props': {
            type: 'primary',
            htmlType: 'submit',
            useAction: '{{ useSubmit }}',
          },
          'x-designer': 'Action.Designer',
          'x-designer-props': {},
          'x-action': `${APPROVAL_STATUS.SUBMITTED}`,
          'x-action-settings': { removable: false, assignedValues: {} },
        },
        withdraw: {
          type: 'void',
          title: `{{t("Withdraw", { ns: "${NAMESPACE}" })}}`,
          'x-decorator': 'WithdrawActionProvider',
          'x-component': 'Action',
          'x-component-props': {
            confirm: {
              title: `{{t('Withdraw', { ns: "${NAMESPACE}" })}}`,
              content: `{{t('Are you sure you want to withdraw it?', { ns: "${NAMESPACE}" })}}`,
            },
            useAction: '{{ useWithdrawAction }}',
          },
          'x-designer': 'WithdrawActionDesigner',
          'x-action': 'withdraw',
        },
      },
      dataSource: collection.dataSource,
      resource: collection.name,
      collection: collection.name,
      template: template,
    });

    const [key] = Object.keys(formSchema.properties);
    const [targetSchema] = flatSchemaArray(
      formSchema.properties[key],
      (property) => property['x-component'] === 'ActionBar',
    );

    targetSchema['x-decorator'] = 'ActionBarProvider';
    targetSchema['x-component-props'].style = { marginTop: '1.5em', flexWrap: 'wrap' };

    insert(formSchema);
  };

  return <SchemaInitializerItem {...itemConfig} onClick={onClick} items={items} />;
};

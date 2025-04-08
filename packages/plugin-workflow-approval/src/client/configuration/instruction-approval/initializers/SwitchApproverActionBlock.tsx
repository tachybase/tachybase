import { createFormBlockSchema, InitializerWithSwitch, useSchemaInitializerItem } from '@tachybase/client';

import _ from 'lodash';

import { APPROVAL_TODO_STATUS } from '../../../common/constants/approval-todo-status';
import { NAMESPACE } from '../../../locale';
import { flatSchemaArray } from '../../../usage/pc/constants';

// 添加卡片-操作switch
export const SwitchApproverActionBlock = () => {
  const itemConfig = useSchemaInitializerItem();
  const formSchema = createFormBlockSchema({
    actionInitializers: 'ApproverActionInitializer',
    actions: {
      approve: {
        type: 'void',
        title: `{{t("Approve", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'ApprovalActionProvider',
        'x-decorator-props': {
          status: APPROVAL_TODO_STATUS.APPROVED,
        },
        'x-component': 'Action',
        'x-component-props': {
          type: 'primary',
          htmlType: 'submit',
          useAction: '{{ useSubmit }}',
        },
        'x-designer': 'Action.Designer',
        'x-designer-props': {},
        'x-action': `${APPROVAL_TODO_STATUS.APPROVED}`,
      },
    },
    resource: 'approvalRecords',
    collection: 'approvalRecords',
  });

  delete formSchema['x-acl-action-props'];
  delete formSchema['x-acl-action'];
  formSchema['x-decorator'] = 'ApprovalFormBlockProvider';

  const [firstKey] = Object.keys(formSchema.properties);
  const firstProperty = formSchema.properties[firstKey];

  _.set(firstProperty, 'x-component-props.useProps', '{{useApprovalFormBlockProps}}');

  const [firstSchema] = flatSchemaArray(
    formSchema.properties[firstKey],
    (property) => property['x-component'] === 'ActionBar',
  );

  firstSchema['x-decorator'] = 'ActionBarProvider';

  _.set(firstSchema, 'x-component-props.style', { marginTop: '1.5em', flexWrap: 'wrap' });

  formSchema['x-block'] = 'action-form';
  const item = {
    ...itemConfig,
    schema: formSchema,
  };

  return <InitializerWithSwitch {...itemConfig} item={item} type={'x-block'} schema={formSchema} />;
};

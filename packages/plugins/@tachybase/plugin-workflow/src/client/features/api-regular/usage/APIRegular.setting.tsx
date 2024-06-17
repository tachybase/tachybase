import {
  ActionDesigner,
  SchemaSettings,
  SchemaSettingsItemType,
  useDesignable,
  useRequest,
  useSchemaToolbar,
  WorkflowConfig,
} from '@tachybase/client';
import { isValid, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { NAMESPACE_TRIGGER_API_REGULAR } from '../../../../common/constants';

const schemaSettingsItems: SchemaSettingsItemType[] = [
  {
    name: 'editButton',
    Component: ActionDesigner.ButtonEditor,
    useComponentProps() {
      const { buttonEditorProps } = useSchemaToolbar();
      return buttonEditorProps;
    },
  },
  {
    name: 'Date',
    type: 'select',
    useComponentProps() {
      const { dn } = useDesignable();
      const { t } = useTranslation();
      const fieldSchema = useFieldSchema();
      return {
        title: t('Data will be updated'),
        options: [
          { label: t('Selected'), value: 'selected' },
          { label: t('All'), value: 'all' },
        ],
        value: fieldSchema['x-action-settings']?.['updateMode'],
        onChange: (value) => {
          fieldSchema['x-action-settings']['updateMode'] = value;
          dn.emit('patch', {
            schema: {
              'x-uid': fieldSchema['x-uid'],
              'x-action-settings': fieldSchema['x-action-settings'],
            },
          });
        },
      };
    },
  },
  {
    name: 'workflowConfig',
    Component: WorkflowConfig,
    useVisible() {
      const fieldSchema = useFieldSchema();
      return isValid(fieldSchema?.['x-action-settings']?.triggerWorkflows);
    },
  },
  {
    name: 'Bind workflow',
    type: 'select',
    useComponentProps() {
      const { dn } = useDesignable();
      const { t } = useTranslation();
      const fieldSchema = useFieldSchema();
      const { data } = useRequest<any>({
        resource: 'workflows',
        action: 'list',
        params: {
          filter: {
            type: NAMESPACE_TRIGGER_API_REGULAR,
          },
        },
      });
      // FIXME 不会实时生效
      const options =
        data?.data?.map((workflow) => ({
          label: workflow.title,
          value: workflow.id,
        })) ?? [];
      return {
        title: t('Bind workflow'),
        value: fieldSchema['x-action-settings'].bindWorkflow,
        options: options.concat({
          label: t('disabled'),
          value: false,
        }),
        onChange(value) {
          fieldSchema['x-action-settings'].bindWorkflow = value;
          dn.emit('patch', {
            schema: {
              'x-uid': fieldSchema['x-uid'],
              'x-action-settings': fieldSchema['x-action-settings'],
            },
          });
        },
      };
    },
  },
  {
    name: 'remove',
    sort: 100,
    Component: ActionDesigner.RemoveButton as any,
    useComponentProps() {
      const { removeButtonProps } = useSchemaToolbar();
      return removeButtonProps;
    },
  },
];

export const APIRegularActionSettings = new SchemaSettings({
  name: 'actionSettings:APIRegular',
  items: schemaSettingsItems,
});

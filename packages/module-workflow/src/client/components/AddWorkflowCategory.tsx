import { useState } from 'react';
import {
  ActionContextProvider,
  SchemaComponent,
  useActionContext,
  useAPIClient,
  useCancelAction,
  useCompile,
  useDataBlockRequest,
} from '@tachybase/client';
import { ISchema, observer, useForm } from '@tachybase/schema';

import { PlusOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { cloneDeep } from 'lodash';

import { useTranslation } from '../locale';

const CollectionCategory = observer(
  (props: any) => {
    const { value } = props;
    const compile = useCompile();
    return (
      <>
        {value?.map((item) => {
          return (
            <Tag key={item.name} color={item.color}>
              {compile(item?.name)}
            </Tag>
          );
        })}
      </>
    );
  },
  { displayName: 'WorkflowCategory' },
);

const useCreateCategry = () => {
  const form = useForm();
  const ctx = useActionContext();
  const { refresh } = useDataBlockRequest();
  const api = useAPIClient();
  return {
    async run() {
      await form.submit();
      const values = cloneDeep(form.values);
      await api.resource('workflowCategories').create({
        values: {
          ...values,
        },
      });
      ctx.setVisible(false);
      await form.reset();
      await refresh();
    },
  };
};

export const AddWorkflowCategory = (props) => {
  return <AddWorkflowCategoryAction {...props} />;
};

export const AddWorkflowCategoryAction = (props) => {
  const { scope, getContainer, children } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <ActionContextProvider value={{ visible, setVisible }}>
      <div onClick={() => setVisible(true)} title={t('Add category')}>
        {children || <PlusOutlined />}
      </div>
      <SchemaComponent
        schema={workflowCategorySchema}
        components={{
          CollectionCategory,
          // CollectionTemplateTag
        }}
        scope={{
          getContainer,
          useCancelAction,
          createOnly: true,
          useCreateCategry,
          ...scope,
        }}
      />
    </ActionContextProvider>
  );
};

const workflowCategorySchema: ISchema = {
  type: 'object',
  properties: {
    form: {
      type: 'void',
      'x-decorator': 'Form',
      'x-component': 'Action.Modal',
      title: '{{ t("Add category") }}',
      'x-component-props': {
        width: 520,
        getContainer: '{{ getContainer }}',
      },
      properties: {
        name: {
          type: 'string',
          title: '{{t("Category name")}}',
          required: true,
          'x-disabled': '{{ !createOnly }}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        color: {
          type: 'string',
          title: '{{t("Color")}}',
          required: false,
          'x-decorator': 'FormItem',
          'x-component': 'ColorSelect',
        },
        footer: {
          type: 'void',
          'x-component': 'Action.Modal.Footer',
          properties: {
            action1: {
              title: '{{ t("Cancel") }}',
              'x-component': 'Action',
              'x-component-props': {
                useAction: '{{ useCancelAction }}',
              },
            },
            action2: {
              title: '{{ t("Submit") }}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction: '{{ useCreateCategry }}',
                style: {
                  marginLeft: '8px',
                },
              },
            },
          },
        },
      },
    },
  },
};

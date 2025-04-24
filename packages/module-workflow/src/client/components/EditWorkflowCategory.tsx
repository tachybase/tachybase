import { useEffect, useState } from 'react';
import {
  ActionContextProvider,
  RecordProvider,
  SchemaComponent,
  useActionContext,
  useAPIClient,
  useCancelAction,
  useCompile,
  useRecord,
  useRequest,
} from '@tachybase/client';
import { ISchema, useForm } from '@tachybase/schema';

import { cloneDeep } from 'lodash';

const useEditCategry = () => {
  const form = useForm();
  const ctx = useActionContext();
  // const { refresh } = useContext(CollectionCategroriesContext);
  // const { refresh: refreshCM } = useResourceActionContext();
  const api = useAPIClient();
  const { id } = useRecord();
  return {
    async run() {
      await form.submit();
      const values = cloneDeep(form.values);
      await api.resource('workflowCategories').update({
        filter: { id: id },
        values: {
          ...values,
        },
      });
      ctx.setVisible(false);
      await form.reset();
      // await refresh();
      // await refreshCM();
    },
  };
};

const useValuesFromRecord = (options) => {
  const record = useRecord();
  const result = useRequest(() => Promise.resolve({ data: cloneDeep(record) }), {
    ...options,
    manual: true,
  });
  const ctx = useActionContext();
  useEffect(() => {
    if (ctx.visible) {
      result.run();
    }
  }, [ctx.visible]);
  return result;
};

export const EditWorkflowCategory = (props) => {
  return <EditWorkflowCategoryAction {...props} />;
};

export const EditWorkflowCategoryAction = (props) => {
  const { scope, getContainer, item, children } = props;
  const [visible, setVisible] = useState(false);
  const compile = useCompile();
  return (
    <RecordProvider record={item}>
      <ActionContextProvider value={{ visible, setVisible }}>
        <>{children || <span onClick={() => setVisible(true)}>{compile('{{ t("Edit category") }}')}</span>}</>
        <SchemaComponent
          schema={collectionCategoryEditSchema}
          scope={{
            getContainer,
            useCancelAction,
            createOnly: true,
            useEditCategry,
            useValuesFromRecord,
            ...scope,
          }}
        />
      </ActionContextProvider>
    </RecordProvider>
  );
};

export const collectionCategoryEditSchema: ISchema = {
  type: 'object',
  properties: {
    form: {
      type: 'void',
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues: '{{ useValuesFromRecord }}',
      },
      'x-component': 'Action.Modal',
      title: '{{ t("Edit category") }}',
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
                useAction: '{{ useEditCategry }}',
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

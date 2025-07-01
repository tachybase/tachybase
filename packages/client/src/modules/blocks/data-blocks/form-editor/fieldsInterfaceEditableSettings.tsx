import { useContext, useMemo, useState } from 'react';
import { ArrayTable } from '@tachybase/components';
import { action, createForm, Field, ISchema, uid, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { Button } from 'antd';
import _, { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useAPIClient } from '../../../../api-client';
import { EditableSchemaSettings } from '../../../../application/schema-settings-editable';
import { usePageRefresh } from '../../../../built-in/dynamic-page/PageRefreshContext';
import {
  DataSourceContext_deprecated,
  useCancelAction,
  useCollection_deprecated,
  useCollectionManager_deprecated,
} from '../../../../collection-manager';
import * as components from '../../../../collection-manager/Configuration/components';
import useDialect from '../../../../collection-manager/hooks/useDialect';
// import { useCollectionField } from '../../../../data-source';
import { RecordProvider, useRecord } from '../../../../record-provider';
import {
  ActionContextProvider,
  SchemaComponent,
  useActionContext,
  useColumnSchema,
  useCompile,
  useIsAssociationField,
} from '../../../../schema-component';
import { getProperties, isSpecialInterrface } from './interfaceSchemaOptions';

export const fieldInterfaceEditableSettings = new EditableSchemaSettings({
  name: 'editableFieldSettings:Fields:Infterface',
  items: [
    {
      name: 'setCollectionField',
      useSchema() {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const record = useRecord();
        const field = useField<Field>();
        return {
          type: 'object',
          title: t('Edit field'),
          'x-decorator': 'FormItem',
          'x-component': SetCollectionFieldModalWrapper,
          'x-component-props': {
            record,
            fieldSchema,
            field,
          },
        };
      },
      useVisible() {
        const record = useRecord();
        return isSpecialInterrface(record?.interface);
      },
    },
  ],
});

export const SetCollectionFieldModalWrapper = (props) => {
  const { record, fieldSchema, field } = props;
  const { t } = useTranslation();
  const { collections, getCollection, refreshCM } = useCollectionManager_deprecated();
  const { refresh } = usePageRefresh();
  const [schema, setSchema] = useState({});
  const [visible, setVisible] = useState(false);
  const [targetScope, setTargetScope] = useState({});
  const api = useAPIClient();
  const [data, setData] = useState<any>({});
  const { isDialect } = useDialect();
  const compile = useCompile();
  const scopeKeyOptions = useMemo(() => {
    return (
      record?.fields ||
      getCollection(record.collectionName)
        .options.fields.filter((v) => {
          return v.interface === 'select';
        })
        .map((k) => {
          return {
            value: k.name,
            label: compile(k.uiSchema?.title),
          };
        })
    );
  }, [record.name]);
  const currentCollections = useMemo(() => {
    return collections.map((v) => {
      return {
        label: compile(v.title),
        value: v.name,
      };
    });
  }, []);

  const useUpdateCollectionField = () => {
    const api = useAPIClient();
    // const record = useRecord();
    const form = useForm();
    const ctx = useActionContext();
    const { name: collectionName } = useCollection_deprecated();
    return {
      async run() {
        await form.submit();
        const values = cloneDeep(form.values);
        if (values.autoCreateReverseField) {
          /* empty */
        } else {
          delete values.reverseField;
        }
        delete values.autoCreateReverseField;

        const isAssociationField = ['obo', 'oho', 'o2o', 'o2m', 'm2m', 'm2o', 'updatedBy', 'createdBy'].includes(
          record?.interface,
        );
        const extraValues: Record<string, any> = {};
        if (isAssociationField) {
          extraValues.foreignKey = `f_${uid()}`;
        }

        await api.resource('collections.fields', collectionName).update({
          filterByTk: record.name,
          values: {
            ...values,
            ...extraValues,
          },
        });
        if (isAssociationField) {
          const targetKey = values.targetKey || 'id';
          const targetCollection = getCollection(values.target);
          const titleField = targetCollection?.titleField || targetKey;

          // 更新 fieldSchema 和 componentProps
          fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
          fieldSchema['x-component-props'].fieldNames = {
            value: targetKey,
            label: titleField,
          };

          field.componentProps.fieldNames = fieldSchema['x-component-props'].fieldNames;
        }
        await refreshCM();
        refresh();
        ctx.setVisible(false);
        await form.reset();
      },
    };
  };

  return (
    <>
      <RecordProvider record={record}>
        <ActionContextProvider value={{ visible, setVisible }}>
          <Button
            style={{ width: '100%' }}
            onClick={async () => {
              const { data } = await api.resource('collections.fields', record.collectionName).get({
                filterByTk: record.name,
                appends: ['reverseField'],
              });
              setData(data?.data);
              // const interfaceConf = getInterface(record.interface);
              const defaultValues: any = cloneDeep(data?.data) || {};
              const schema = getSchema(defaultValues, record);
              if (schema) {
                setSchema(schema);
                setVisible(true);
              }
            }}
          >
            {t('Set default properties')}
          </Button>
          <SchemaComponent
            schema={schema}
            components={{ ...components, ArrayTable }}
            scope={{
              useUpdateCollectionField,
              useCancelAction,
              showReverseFieldConfig: !data?.reverseField,
              collections: currentCollections,
              isDialect,
              disabledJSONB: true,
              scopeKeyOptions,
              targetScope,
              createMainOnly: true,
              useAsyncDataSource,
              loadCollections,
              useCurrentFields,
            }}
          />
        </ActionContextProvider>
      </RecordProvider>
    </>
  );
};

const useCurrentFields = () => {
  const record = useRecord();
  const { getCollectionFields } = useCollectionManager_deprecated();

  // 仅当当前字段为子表单时，从DataSourceContext中获取已配置的字段列表
  if (record.__parent && record.__parent.interface === 'subTable') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ctx = useContext(DataSourceContext_deprecated);
    return ctx.dataSource;
  }

  const fields = getCollectionFields(record.collectionName || record.name) as any[];
  return fields;
};

const getSchema = (defaultValues, record): ISchema => {
  const gird = getProperties(record.interface);
  const form = createForm({
    initialValues: defaultValues,
  });
  return {
    type: 'object',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Action.Modal',
        title: '{{ t("Set default properties") }}',
        'x-decorator': 'FormV2',
        'x-decorator-props': {
          form,
        },
        properties: {
          ...gird,
          footer: {
            'x-component': 'Action.Modal.Footer',
            type: 'void',
            properties: {
              cancel: {
                title: '{{t("Cancel")}}',
                'x-component': 'Action',
                'x-use-component-props': 'useCancelActionProps',
              },
              submit: {
                title: '{{t("Submit")}}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  useAction: '{{ useUpdateCollectionField }}',
                },
              },
            },
          },
        },
      },
    },
  };
};

const useAsyncDataSource = (service: any, exclude?: string[]) => {
  return (field: any, options?: any) => {
    field.loading = true;
    service(field, options, exclude)
      .then(
        action.bound((data: any) => {
          field.dataSource = data;
          field.loading = false;
        }),
      )
      .catch(console.error);
  };
};

const loadCollections = async (field, options, exclude?: string[]) => {
  const { targetScope } = options;
  const compile = useCompile();
  const { getCollections } = useCollectionManager_deprecated();
  const isFieldInherits = field.props?.name === 'inherits';
  const filteredItems = getCollections().filter((item) => {
    if (exclude?.includes(item.template)) {
      return false;
    }
    const isAutoCreateAndThrough = item.autoCreate && item.isThrough;
    if (isAutoCreateAndThrough) {
      return false;
    }
    if (isFieldInherits && item.template === 'view') {
      return false;
    }
    const templateIncluded = !targetScope?.template || targetScope.template.includes(item.template);
    const nameIncluded = !targetScope?.[field.props?.name] || targetScope[field.props.name].includes(item.name);
    return templateIncluded && nameIncluded;
  });
  return filteredItems.map((item) => ({
    label: compile(item.title),
    value: item.name,
  }));
};

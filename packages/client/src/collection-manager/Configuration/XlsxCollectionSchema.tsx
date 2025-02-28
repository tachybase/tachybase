import React, { SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  IField,
  isTitleField,
  RecordProvider,
  useAPIClient,
  useBlockRequestContext,
  useCollectionManager_deprecated,
  useCollectionRecord,
  useDataBlockRequest,
  useDataBlockResource,
  useDataSourceManager,
  useRecord,
  useRequest,
  useResourceActionContext,
  useResourceContext,
} from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';
import { ArrayField, FormContext, ISchema, observer, uid, useEffectForm, useField, useForm } from '@tachybase/schema';

import { Alert, Cascader, Input, Select, Space, Spin, Switch, Table, Tag, Tooltip } from 'antd';
import { cloneDeep, omit, set } from 'lodash';
import { useTranslation } from 'react-i18next';

import { ActionContextProvider, SchemaComponent, useActionContext, useCompile } from '../../schema-component';
import { useCancelAction, useUpdateAction } from '../action-hooks';
import useDialect from '../hooks/useDialect';
import * as components from './components';
import { useFieldInterfaceOptions } from './interfaces';

interface FormValueProps {
  value?: any;
  setFormValue?: any;
}

export const FormValueContext = React.createContext<FormValueProps>({});
export const useFormValueContext = () => React.useContext(FormValueContext);

// const { setFormValue } = useFormValueContext

// const [formValue, setFormValue] = useState(null)

{
  /* <FormValueContext.Provider value={{
  value:formValue, 
  
  setFormValue}}> 
<></>

</FormValueContext.Provider> */
}

export const createXlsxCollectionSchema = (filelist, filedata) => {
  return {
    type: 'void',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'FormV2',
        'x-use-component-props': 'useFormBlockProps',
        properties: {
          action: {
            type: 'void',
            'x-component': 'ActionBar',
            'x-component-props': {
              layout: 'one-column',
              style: {
                justifyContent: 'right',
              },
            },
            properties: {
              // cancel: {
              //   title: 'Cancel',
              //   'x-component': 'Action',
              //   'x-component-props': {
              //     useAction: '{{ useCancel }}',
              //   },
              // },
              submit: {
                title: '{{t("Submit")}}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  htmlType: 'submit',
                  // useAction: '{{ useSaveValues }}',
                },
                'x-use-component-props': xlsxImportAction,
              },
            },
          },
          title: {
            type: 'string',
            default: filelist[0]?.name.replace(/\.[^/.]+$/, ''),
            title: '{{ t("Collection display name") }}',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          name: {
            type: 'string',
            title: '{{t("Collection name")}}',
            default: '{{ useNewId("t_") }}',
            required: true,
            // 'x-disabled': '{{ !createOnly }}',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-validator': 'uid',
            description:
              "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
          },
          category: {
            title: '{{t("Categories")}}',
            type: 'hasMany',
            name: 'category',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              mode: 'multiple',
            },
            'x-reactions': ['{{useAsyncDataSource(loadCategories)}}'],
          },
          description: {
            title: '{{t("Description")}}',
            type: 'string',
            name: 'description',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
          },
          // presetFields: {
          //   title: '{{t("Preset fields")}}',
          //   type: 'void',
          //   'x-decorator': 'FormItem',
          //   'x-visible': '{{ createOnly }}',
          //   'x-component': PresetFields,
          // },
          fields: {
            type: 'array',
            title: '{{t("Fields")}}',
            default: filedata.fields,
            'x-decorator': 'FormItem',
            'x-component': FieldsConfigure,
            'x-component-props': {
              filedata,
            },
            required: true,
          },
          // table: {
          //   type: 'void',
          //   title: '{{t("Preview")}}',
          //   'x-decorator': 'FormItem',
          //   'x-component': PreviewTable,
          //   'x-component-props': {
          //     filedata,
          //     // setFileData
          //   },
          // },
        },
      },
    },
  };
};

export const FieldsConfigure = observer(
  (props: any) => {
    const { filedata } = props;
    const dm = useDataSourceManager();
    const { t } = useTranslation();
    const initOptions = useFieldInterfaceOptions();
    const compile = useCompile();
    const [selectedTitleField, setSelectedTitleField] = useState<string | null>();
    const form = useForm();
    const [formValue, setFormValue] = useState(filedata.fields);

    const handleFieldChange = (updatedField: any, index: number) => {
      const updatedFieldData = [...formValue];
      updatedFieldData[index] = updatedField;
      setFormValue(updatedFieldData);
    };

    const handleTitleChange = (checked: boolean, field: any) => {
      const newTitleField = checked ? field.name : null;
      setSelectedTitleField(newTitleField);
      form.setValuesIn('titleField', newTitleField);
    };

    const getInterface = useCallback(
      (name: string) => {
        return dm?.collectionFieldInterfaceManager.getFieldInterface(name);
      },
      [dm],
    );

    const isTitleField = (field) => {
      return !field.isForeignKey && getInterface(field.interface)?.titleUsable;
    };

    const getOptions = (type) => {
      const InterfaceOptions = getInterfaceOptions(initOptions, type);
      const options = InterfaceOptions.map((group) => ({
        label: <span>{compile(group.label)}</span>,
        title: group.key,
        options: group.children.map((item) => ({
          label: <span>{compile(item.label)}</span>,
          value: item.name,
        })),
      }));
      return options;
    };

    const getInterfaceOptions = (data, type) => {
      const interfaceOptions = [];
      data.forEach((item) => {
        const options = item.children.filter((h) => h?.availableTypes?.includes(type));
        interfaceOptions.push({
          label: item.label,
          key: item.key,
          children: options,
        });
      });
      return interfaceOptions.filter((v) => {
        if (type === 'sort') {
          return v.key === 'advanced';
        }
        return v.children.length > 0;
      });
    };

    const columns = [
      {
        title: t('Field display name'),
        dataIndex: 'title',
        key: 'title',
        render: (text: string, record: any, index: number) => {
          const field = formValue[index];
          return (
            <Input
              value={field.uiSchema.title || text}
              onChange={(e) => handleFieldChange({ ...field, uiSchema: { title: e.target.value } }, index)}
            />
          );
        },
      },
      {
        title: t('Field name'),
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: any, index: number) => {
          const field = formValue[index];
          return <Input value={field.name || text} variant="borderless" disabled={true} />;
        },
      },
      {
        title: t('Field type'),
        dataIndex: 'type',
        key: 'type',
        render: (text: string, record: any, index: number) => {
          const field = formValue[index];
          return (
            <Select
              value={field.type || text}
              onChange={(e) => handleFieldChange({ ...field, type: e }, index)}
              options={[
                { value: 'string', label: <span>string</span> },
                { value: 'boolean', label: <span>boolean</span> },
                { value: 'integer', label: <span>integer</span> },
                { value: 'float', label: <span>float</span> },
                { value: 'json', label: <span>json</span> },
                { value: 'date', label: <span>date</span> },
              ]}
            />
          );
        },
      },
      {
        title: t('Field interface'),
        dataIndex: 'interface',
        key: 'interface',
        render: (text: string, record: any, index: number) => {
          const field = formValue[index];
          const options = getOptions(field.type);
          return (
            <Select
              aria-label={`field-interface-${field?.type}`}
              //@ts-ignore
              role="button"
              defaultValue={field.interface}
              popupMatchSelectWidth={false}
              onChange={(e) => handleFieldChange({ ...field, interface: e }, index)}
              options={options}
            />
          );
        },
      },
      {
        dataIndex: 'titleField',
        title: t('Title field'),
        render: function Render(_, record: any, index: any) {
          const field = formValue[index];
          return isTitleField(field) ? (
            <Tooltip
              title={t('Default title for each record')}
              placement="right"
              overlayInnerStyle={{ textAlign: 'center' }}
            >
              <Switch
                aria-label={`switch-title-field-${field.name}`}
                size="small"
                checked={field.name === selectedTitleField}
                onChange={(checked) => handleTitleChange(checked, field)}
              />
            </Tooltip>
          ) : null;
        },
      },
      {
        title: t('Description'),
        dataIndex: 'description',
        key: 'description',
        render: (text: string, record: any, index: number) => {
          const field = formValue[index];
          return <Input.TextArea value={field.description} variant="borderless" disabled={true} />;
        },
      },
      {
        title: t('Actions'),
        dataIndex: 'actions',
        key: 'actions',
        render: (text: string, record: any, index: number) => {
          const field = formValue[index];
          return (
            <Space size="middle">
              <EditFieldAction
                record={{ index, ...field }}
                // handleUiSchemaChange={(e) => handleFieldChange({ ...field, uiSchema: e }, index)}
                {...props}
              />
            </Space>
          );
        },
      },
    ];
    const previewTablecolumns = formValue.map((field) => ({
      title: field.uiSchema.title,
      dataIndex: field.name,
      key: field.name,
      render: (text) => text,
      width: 200,
    }));

    useEffect(() => {
      form.setValuesIn('fields', formValue);
      console.log('%c Line:354 🍊 formValue', 'font-size:18px;color:#42b983;background:#f5ce50', formValue);
      form.setValuesIn('collectionData', filedata.data);
    }, [formValue]);

    return (
      <FormValueContext.Provider
        value={{
          value: formValue,
          setFormValue,
        }}
      >
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={formValue}
          scroll={{ y: 300 }}
          pagination={false}
          rowClassName="row"
          rowKey="uid"
          style={{ marginBottom: '16px' }}
          {...props}
        />
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>预览：</div>
        <Table
          bordered
          size="small"
          columns={previewTablecolumns}
          dataSource={filedata.data}
          scroll={{ y: 300, x: 'max-content' }}
          pagination={false}
          rowKey="name"
        />
      </FormValueContext.Provider>
    );
  },
  { displayName: 'FieldsConfigure' },
);

const setUpdateCollectionField = () => {
  const form = useForm();
  const { refresh } = useResourceActionContext();
  const { value, setFormValue } = useFormValueContext();
  const ctx = useActionContext();

  const handleFieldChange = (index: number, updatedField: any) => {
    const updatedFieldData = [...value];
    updatedFieldData[index] = updatedField;
    setFormValue(updatedFieldData);
    ctx.setVisible(false);
  };

  return {
    async onClick() {
      await form.submit();
      const values = cloneDeep(form.values);
      if (values.autoCreateReverseField) {
      } else {
        delete values.reverseField;
      }
      delete values.autoCreateReverseField;
      const { index, ...updatedField } = values;
      await handleFieldChange(index, updatedField);
      // setFormValue(values);
      // refresh();
    },
  };
};

export const EditFieldAction = (props) => {
  const {
    scope,
    getContainer,
    record,
    parentItem: parentRecord,
    children,
    handleUiSchemaChange,
    ...otherProps
  } = props;
  const { getInterface, collections, getCollection } = useCollectionManager_deprecated();
  const [visible, setVisible] = useState(false);
  const [schema, setSchema] = useState({});
  const api = useAPIClient();
  const { t } = useTranslation();
  const compile = useCompile();
  const [data, setData] = useState<any>({ record });
  const { isDialect } = useDialect();

  return (
    <RecordProvider record={record} parent={parentRecord}>
      <ActionContextProvider value={{ visible, setVisible }}>
        <a
          {...otherProps}
          onClick={async () => {
            setData(record);
            const interfaceConf = getInterface(record.interface);
            const defaultValues: any = cloneDeep(record) || {};
            if (!defaultValues?.reverseField) {
              defaultValues.autoCreateReverseField = false;
              defaultValues.reverseField = interfaceConf?.default?.reverseField;
              set(defaultValues.reverseField, 'name', record.name);
              set(defaultValues, 'uiSchema.title', record.uiSchema.title);
            }
            const schema = getSchema(
              {
                ...interfaceConf,
                default: defaultValues,
              },
              record,
              compile,
              getContainer,
            );
            setSchema(schema);
            setVisible(true);
          }}
        >
          {children || t('Edit')}
        </a>
        <SchemaComponent
          schema={schema}
          components={{ ...components, ArrayTable }}
          scope={{
            getContainer,
            useCancelAction,
            showReverseFieldConfig: !data?.reverseField,
            // collections: currentCollections,
            isDialect,
            disabledJSONB: true,
            // scopeKeyOptions,
            createMainOnly: true,
            ...scope,
          }}
        />
      </ActionContextProvider>
    </RecordProvider>
  );
};

const getSchema = (schema: IField, record: any, compile, getContainer): ISchema => {
  if (!schema) {
    return;
  }
  const properties = cloneDeep(schema.properties) as any;
  if (properties?.name) {
    properties.name['x-disabled'] = true;
  }
  if (schema.hasDefaultValue === true) {
    properties['defaultValue'] = cloneDeep(schema.default) || {};
    properties.defaultValue.required = false;
    properties['defaultValue']['title'] = compile('{{ t("Default value") }}');
    properties['defaultValue']['x-decorator'] = 'FormItem';
    properties['defaultValue']['x-reactions'] = [
      {
        dependencies: [
          'uiSchema.x-component-props.gmt',
          'uiSchema.x-component-props.showTime',
          'uiSchema.x-component-props.dateFormat',
          'uiSchema.x-component-props.timeFormat',
        ],
        fulfill: {
          state: {
            componentProps: {
              gmt: '{{$deps[0]}}',
              showTime: '{{$deps[1]}}',
              dateFormat: '{{$deps[2]}}',
              timeFormat: '{{$deps[3]}}',
            },
          },
        },
      },
      {
        dependencies: ['primaryKey', 'unique', 'autoIncrement'],
        when: '{{$deps[0]||$deps[1]||$deps[2]}}',
        fulfill: {
          state: {
            hidden: true,
            value: undefined,
          },
        },
        otherwise: {
          state: {
            hidden: false,
          },
        },
      },
    ];
  }

  return {
    type: 'object',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Action.Drawer',
        'x-component-props': {
          getContainer: getContainer,
        },
        'x-decorator': 'Form',
        'x-decorator-props': {
          useValues(options) {
            return useRequest(
              () =>
                Promise.resolve({
                  data: cloneDeep(omit(schema.default, ['uiSchema.rawTitle'])),
                }),
              options,
            );
          },
        },
        title: `${compile(record.uiSchema.title)} - ${compile('{{ t("Edit field") }}')}`,
        properties: {
          summary: {
            type: 'void',
            'x-component': 'FieldSummary',
            'x-component-props': {
              schemaKey: schema.name,
            },
          },
          // @ts-ignore
          ...properties,
          description: {
            type: 'string',
            title: '{{t("Description")}}',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
          },
          footer: {
            type: 'void',
            'x-component': 'Action.Drawer.Footer',
            properties: {
              // action1: {
              //   title: '{{ t("Cancel") }}',
              //   'x-component': 'Action',
              //   'x-component-props': {
              //     useAction: '{{ useCancelAction }}',
              //   },
              // },
              action2: {
                title: '{{ t("Submit") }}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                },
                'x-use-component-props': setUpdateCollectionField,
              },
            },
          },
        },
      },
    },
  };
};

const PreviewTable = observer(
  (props: any) => {
    const { filedata } = props;
    const { t } = useTranslation();
    const previewTablecolumns = filedata.fields.map((field) => ({
      title: field.uiSchema.title,
      dataIndex: field.name,
      key: field.name,
      render: (text) => text,
      width: 200,
    }));

    return (
      <Table
        bordered
        size="small"
        columns={previewTablecolumns}
        dataSource={filedata.data}
        scroll={{ y: 300, x: 'max-content' }}
        pagination={false}
        rowKey="name"
      />
    );
  },
  { displayName: 'PreviewTable' },
);

const xlsxImportAction = () => {
  const form = useForm();
  const ctx = useActionContext();
  const field = useField();
  const api = useAPIClient();
  // const { collectionData, ...collections } = form.values

  return {
    async onClick() {
      field.data = field.data || {};
      field.data.loading = true;
      try {
        await form.submit();
        const values = cloneDeep(form.values);
        const { collectionData, ...collections } = values;
        console.log('%c Line:644 🍬 collections', 'font-size:18px;color:#ed9ec7;background:#fca650', collections);
        console.log('%c Line:644 🍤 collectionData', 'font-size:18px;color:#2eafb0;background:#3f7cff', collectionData);
        if (!collections.autoCreateReverseField) {
          delete collections.reverseField;
        }
        delete collections.autoCreateReverseField;
        await api.resource('collections').create({
          values: {
            logging: true,
            ...collections,
          },
        });
        api.resource(`${collections.name}`).create({
          values: collectionData,
        });
        ctx.setVisible(false);
        // await form.reset();
        field.data.loading = false;
      } catch (error) {
        field.data.loading = false;
      }
    },
  };
};

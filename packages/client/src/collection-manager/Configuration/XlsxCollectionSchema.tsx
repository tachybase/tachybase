import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ArrayField, observer, useField, useForm } from '@tachybase/schema';

import { Alert, Cascader, Input, Select, Spin, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { useAsyncData } from '../../async-data-provider';
import { useCompile } from '../../schema-component';
import { useCollectionManager_deprecated } from '../hooks';
import { ResourceActionContext } from '../ResourceActionProvider';
import { FieldOptions } from '../types';
import { useFieldInterfaceOptions } from './interfaces';

export const createXlsxCollectionSchema = (filelist, filedata) => ({
  type: 'void',
  properties: {
    form: {
      type: 'void',
      'x-component': 'FormV2',
      'x-use-component-props': 'useFormBlockProps',
      properties: {
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
        // inherits: {
        //   title: '{{t("Inherits")}}',
        //   type: 'hasMany',
        //   name: 'inherits',
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Select',
        //   'x-component-props': {
        //     mode: 'multiple',
        //   },
        //   'x-disabled': '{{ !createOnly }}',
        //   'x-visible': '{{ enableInherits}}',
        //   'x-reactions': ['{{useAsyncDataSource(loadCollections, ["file"])}}'],
        // },
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
          'x-decorator': 'FormItem',
          'x-component': FieldsConfigure,
          'x-component-props': { filedata: filedata },
          required: true,
        },
        // table: {
        //   type: 'void',
        //   title: '{{t("Preview")}}',
        //   'x-decorator': 'FormItem',
        //   'x-component': PreviewTable,
        // },
      },
    },
  },
});

const inferInterface = (field: string, value: any) => {
  if (field.toLowerCase().includes('id')) {
    return 'id';
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return 'integer';
    }
    return 'number';
  }
  if (typeof value === 'boolean') {
    return 'checkbox';
  }
  if (dayjs(value).isValid()) {
    return 'datetime';
  }
  return 'input';
};

const useSourceFieldsOptions = () => {
  const form = useForm();
  const { sources = [] } = form.values;
  const { t } = useTranslation();
  const { getCollection, getInheritCollections, getParentCollectionFields } = useCollectionManager_deprecated();
  const data = [];
  sources.forEach((item: string) => {
    const collection = getCollection(item);
    const inherits = getInheritCollections(item);
    const result = inherits.map((v) => {
      const fields: FieldOptions[] = getParentCollectionFields(v, item);
      return {
        type: 'group',
        key: v,
        label: t(`Parent collection fields`) + t(`(${getCollection(v).title})`),
        children: fields
          .filter((v) => !['hasOne', 'hasMany', 'belongsToMany'].includes(v?.type))
          .map((k) => {
            return {
              value: k.name,
              label: t(k.uiSchema?.title),
            };
          }),
      };
    });
    if (!collection) {
      return;
    }
    const children = (collection.fields as FieldOptions[])
      .filter((v) => !['hasOne', 'hasMany', 'belongsToMany'].includes(v?.type))
      ?.map((v) => {
        return { value: v.name, label: t(v.uiSchema?.title) };
      });

    data.push({
      value: item,
      label: t(collection.title),
      children: [...children, ...result],
    });
  });
  return data;
};

const FieldsConfigure = observer(
  (props: any) => {
    const { filedata, setFileData } = props;
    const { t } = useTranslation();
    // const [filedata, setDataSource] = useState([]);
    // const { data: res, error, loading } = useAsyncData();
    // const { data, fields: sourceFields } = res || {};
    // const field: ArrayField = useField();
    // const { data: curFields } = useContext(ResourceActionContext);
    // const compile = useCompile();
    // const { getInterface, getCollectionField } = useCollectionManager_deprecated();
    // const options = useFieldInterfaceOptions();

    // const interfaceOptions = useMemo(
    //   () =>
    //     options
    //       .filter((v) => !['relation'].includes(v.key))
    //       .map((options, index) => ({
    //         ...options,
    //         key: index,
    //         label: compile(options.label),
    //         options: options.children.map((option) => ({
    //           ...option,
    //           label: compile(option.label),
    //         })),
    //       })),
    //   [compile],
    // );
    // const sourceFieldsOptions = useSourceFieldsOptions();

    // const refGetInterface = useRef(getInterface);
    // useEffect(() => {
    //   const fieldsMp = new Map();
    //   if (!loading) {
    //     if (data && data.length) {
    //       Object.entries(data?.[0] || {}).forEach(([col, val]) => {
    //         const sourceField = sourceFields[col];
    //         const fieldInterface = inferInterface(col, val);
    //         const defaultConfig = refGetInterface.current(fieldInterface)?.default;
    //         const uiSchema = sourceField?.uiSchema || defaultConfig?.uiSchema || {};
    //         fieldsMp.set(col, {
    //           name: col,
    //           interface: sourceField?.interface || fieldInterface,
    //           type: sourceField?.type || defaultConfig?.type,
    //           source: sourceField?.source,
    //           uiSchema: {
    //             title: col,
    //             ...uiSchema,
    //           },
    //         });
    //       });
    //     } else {
    //       Object.entries(sourceFields || {}).forEach(([col, val]: [string, any]) =>
    //         fieldsMp.set(col, {
    //           name: col,
    //           ...val,
    //           uiSchema: {
    //             title: col,
    //             ...(val?.uiSchema || {}),
    //           },
    //         }),
    //       );
    //     }
    //   }

    //   if (field.value?.length) {
    //     field.value.forEach((item) => {
    //       if (fieldsMp.has(item.name)) {
    //         fieldsMp.set(item.name, item);
    //       }
    //     });
    //   }

    //   // if (curFields?.data.length) {
    //   //   curFields.data.forEach((field: any) => {
    //   //     if (fieldsMp.has(field.name)) {
    //   //       fieldsMp.set(field.name, field);
    //   //     }
    //   //   });
    //   // }

    //   const fields = Array.from(fieldsMp.values());
    //   if (!fields.length) {
    //     return;
    //   }
    //   setDataSource(fields);
    //   field.setValue(fields);
    // }, [loading, data, field, sourceFields, curFields]);

    // if (loading) {
    //   return <Spin />;
    // }
    // if (!data && !error) {
    //   return <Alert showIcon message={t('Please use a valid SELECT or WITH AS statement')} />;
    // }
    // const err = error as any;
    // if (err) {
    //   const errMsg =
    //     err?.response?.data?.errors?.map?.((item: { message: string }) => item.message).join('\n') || err.message;
    //   return <Alert showIcon message={`${t('SQL error: ')}${errMsg}`} type="error" />;
    // }

    const handleFieldChange = (updatedField: any, index: number) => {
      const updatedFileData = [...filedata];
      updatedFileData[index] = { ...updatedField };
      setFileData(updatedFileData);
    };

    const columns = [
      {
        title: t('Field display name'),
        // dataIndex: 'title',
        // key: 'title',
        width: 180,
        render: (text: string, record: any, index: number) => {
          const field = filedata[index];
          return (
            <Input
              value={field?.title || text}
              onChange={(e) => handleFieldChange({ field, title: e.target.value }, index)}
            />
          );
        },
      },

      // {
      //   title: t('Field name'),
      //   dataIndex: 'name',
      //   key: 'name',
      //   width: 130,
      // },
      // {
      //   title: t('Field source'),
      //   dataIndex: 'source',
      //   key: 'source',
      //   width: 200,
      //   render: (text: string, record: any, index: number) => {
      //     const field = dataSource[index];
      //     return (
      //       <Cascader
      //         defaultValue={typeof text === 'string' ? text?.split('.') : text}
      //         allowClear
      //         options={compile(sourceFieldsOptions)}
      //         placeholder={t('Select field source')}
      //         onChange={(value: string[]) => {
      //           let sourceField = sourceFields[value?.[1]];
      //           if (!sourceField) {
      //             sourceField = getCollectionField(value?.join('.') || '');
      //           }
      //           handleFieldChange(
      //             {
      //               ...field,
      //               source: value,
      //               interface: sourceField?.interface,
      //               type: sourceField?.type,
      //               uiSchema: sourceField?.uiSchema,
      //             },
      //             index,
      //           );
      //         }}
      //       />
      //     );
      //   },
      // },
      {
        title: t('Field interface'),
        // dataIndex: 'interface',
        // key: 'interface',
        // width: 150,
        // render: (text: string, record: any, index: number) => {
        //   const field = dataSource[index];
        //   return field.source ? (
        //     <Tag>{compile(getInterface(text)?.title) || text}</Tag>
        //   ) : (
        //     <Select
        //       defaultValue={field.interface || 'input'}
        //       style={{ width: '100%' }}
        //       popupMatchSelectWidth={false}
        //       onChange={(value) => {
        //         const interfaceConfig = getInterface(value);
        //         handleFieldChange(
        //           {
        //             ...field,
        //             interface: value || null,
        //             uiSchema: {
        //               ...interfaceConfig?.default?.uiSchema,
        //               title: interfaceConfig?.default?.uiSchema?.title || field.uiSchema?.title,
        //             },
        //             type: interfaceConfig?.default?.type,
        //           },
        //           index,
        //         );
        //       }}
        //       allowClear={true}
        //       options={interfaceOptions}
        //     />
        //   );
        // },
      },
    ];
    return (
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={filedata}
        scroll={{ y: 300 }}
        pagination={false}
        rowClassName="editable-row"
        rowKey="name"
      />
    );
  },
  { displayName: 'FieldsConfigure' },
);

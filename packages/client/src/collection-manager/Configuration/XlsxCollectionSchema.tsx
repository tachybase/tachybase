import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ArrayField, observer, uid, useField, useForm } from '@tachybase/schema';
import { Alert, Cascader, Input, Select, Spin, Switch, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCompile } from '../../schema-component';
import { useFieldInterfaceOptions } from './interfaces';
import React from 'react';
import { CollectionFieldOptions, DataSourceManager, isTitleField, useDataSourceManager } from '@tachybase/client';

export const createXlsxCollectionSchema = (filelist, filedata) => ({
  type: 'void',
  properties: {
    [uid()]: {
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
          'x-component-props': {
            filedata,
            // setFileData
          },
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

const FieldsConfigure = observer(
  (props: any) => {
    const { filedata } = props;
    const dm = useDataSourceManager();
    const { t } = useTranslation();
    const [fields, setFields] = useState(filedata.fields);
    const initOptions = useFieldInterfaceOptions();
    const compile = useCompile();
    const [selectedTitleField, setSelectedTitleField] = useState<string | null>(null);

    const handleFieldChange = (updatedField: any, index: number) => {
      const updatedFieldData = [...fields];
      updatedFieldData[index] = updatedField;
      setFields(updatedFieldData);
    };

    const handleTitleChange = (checked, field) => {
      // 如果开启当前字段的标题，则设置为选中的字段
      if (checked) {
        setSelectedTitleField(field.key);
      } else {
        // 如果关闭当前字段的标题，则取消选中
        setSelectedTitleField(null);
      }
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
      const options = InterfaceOptions.map(group => ({
        label: <span>{compile(group.label)}</span>,
        title: group.key,
        options: group.children.map(item => ({
          label: <span>{compile(item.label)}</span>,
          value: item.name,
        })),
      }));
      return options;
    }

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
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: any, index: number) => {
          const field = fields[index];
          return (
            <Input
              value={field.name || text}
              onChange={(e) => handleFieldChange({ ...field, name: e.target.value }, index)}
            />
          );
        },
      },
      {
        title: t('Field name'),
        dataIndex: 'key',
        key: 'key',
        render: (text: string, record: any, index: number) => {
          const field = fields[index];
          return (
            <Input
              value={field.key || text}
              variant="borderless"
              disabled={true}
            />
          );
        },
      },
      {
        title: t('Field type'),
        dataIndex: 'type',
        key: 'type',
        render: (text: string, record: any, index: number) => {
          const field = fields[index];
          return (
            <Select
              value={field.type || text}
              onChange={(e) => handleFieldChange({ ...field, type: e }, index)}
              options={[
                { value: 'string', label: <span>string</span> },
                { value: 'boolean', label: <span>boolean</span> },
                { value: 'integer', label: <span>integer</span> },
                { value: 'float', label: <span>float</span> },
                { value: 'json', label: <span>json</span> }
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
          const field = fields[index];
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
          const field = fields[index];
          return isTitleField(field) ? (
            <Tooltip title={t('Default title for each record')} placement="right" overlayInnerStyle={{ textAlign: 'center' }}>
              <Switch
                aria-label={`switch-title-field-${field.name}`}
                size="small"
                checked={field.key === selectedTitleField}
                onChange={(checked) => handleTitleChange(checked, field)}
              // onChange={handleChange}
              />
            </Tooltip>
          ) : null;
        },
      },
    ];



    return (
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={fields}
        scroll={{ y: 300 }}
        pagination={false}
        rowClassName="editable-row"
        rowKey="uid"
      />
    );
  },
  { displayName: 'FieldsConfigure' },
);

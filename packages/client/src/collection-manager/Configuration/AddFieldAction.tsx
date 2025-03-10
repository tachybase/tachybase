import React, { useCallback, useMemo, useState } from 'react';
import { ArrayTable } from '@tachybase/components';
import { uid, useField, useForm } from '@tachybase/schema';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import { MenuItemGroupType, MenuItemType } from 'antd/es/menu/interface';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useRequest } from '../../api-client';
import { RecordProvider, useRecord } from '../../record-provider';
import { ActionContextProvider, SchemaComponent, useActionContext, useCompile } from '../../schema-component';
import { useCancelAction } from '../action-hooks';
import { useCollectionManager_deprecated } from '../hooks';
import useDialect from '../hooks/useDialect';
import { IField } from '../interfaces/types';
import { useResourceActionContext, useResourceContext } from '../ResourceActionProvider';
import * as components from './components';
import { useFieldInterfaceOptions } from './interfaces';

const getSchema = (schema: IField, record: any, compile) => {
  if (!schema) {
    return;
  }

  const properties = cloneDeep(schema.properties) as any;

  if (schema.hasDefaultValue === true) {
    properties['defaultValue'] = cloneDeep(schema?.default?.uiSchema);
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
            value: null,
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
  const initialValue: any = {
    name: `f_${uid()}`,
    ...cloneDeep(schema.default),
    interface: schema.name,
  };
  if (initialValue.reverseField) {
    initialValue.reverseField.name = `f_${uid()}`;
  }
  // initialValue.uiSchema.title = schema.title;
  return {
    type: 'object',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Action.Drawer',
        'x-component-props': {
          getContainer: '{{ getContainer }}',
        },
        'x-decorator': 'Form',
        'x-decorator-props': {
          useValues(options) {
            return useRequest(
              () =>
                Promise.resolve({
                  data: initialValue,
                }),
              options,
            );
          },
        },
        title: `${compile(record.title)} - ${compile('{{ t("Add field") }}')}`,
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
                  useAction: '{{ useCreateCollectionField }}',
                },
              },
            },
          },
        },
      },
    },
  };
};

export const useCollectionFieldFormValues = () => {
  const form = useForm();
  return {
    getValues() {
      const values = cloneDeep(form.values);
      if (values.autoCreateReverseField) {
        /* empty */
      } else {
        delete values.reverseField;
      }
      delete values.autoCreateReverseField;
      return values;
    },
  };
};

const useCreateCollectionField = () => {
  const form = useForm();
  const { refreshCM } = useCollectionManager_deprecated();
  const ctx = useActionContext();
  const { refresh } = useResourceActionContext();
  const { resource } = useResourceContext();
  const field = useField();
  return {
    async run() {
      await form.submit();
      field.data = field.data || {};
      field.data.loading = true;
      const values = cloneDeep(form.values);
      if (values.autoCreateReverseField) {
        /* empty */
      } else {
        delete values.reverseField;
      }
      delete values.autoCreateReverseField;
      try {
        await resource.create({ values });
        ctx.setVisible(false);
        await form.reset();
        field.data.loading = false;
        refresh();
        await refreshCM();
      } catch (error) {
        field.data.loading = false;
      }
    },
  };
};

export const AddCollectionField = (props) => {
  const record = useRecord();
  return <AddFieldAction item={record} {...props} />;
};

export const AddFieldAction = (props) => {
  const { scope, getContainer, item: record, children, trigger, align, database } = props;
  const { getInterface, getTemplate, collections, getCollection } = useCollectionManager_deprecated();
  const [visible, setVisible] = useState(false);
  const [targetScope, setTargetScope] = useState();
  const [schema, setSchema] = useState({});
  const compile = useCompile();
  const { t } = useTranslation();
  const { isDialect } = useDialect();
  const options = useFieldInterfaceOptions();
  const fields = getCollection(record.name)?.options?.fields || record.fields || [];

  const currentCollections = useMemo(() => {
    return collections.map((v) => {
      return {
        label: compile(v.title),
        value: v.name,
      };
    });
  }, []);
  const getFieldOptions = useCallback(() => {
    const { availableFieldInterfaces } = getTemplate(record.template) || {};
    const { exclude, include } = (availableFieldInterfaces || {}) as any;
    const optionArr = [];
    options.forEach((v) => {
      if (v.key === 'systemInfo') {
        optionArr.push({
          ...v,
          children: v.children.filter((v) => {
            if (v.hidden) {
              return false;
            } else if (v.value === 'tableoid') {
              if (include?.length) {
                return include.includes(v.value);
              }
              return database?.dialect === 'postgres';
            } else {
              return typeof record[v.value] === 'boolean' ? record[v.value] : true;
            }
          }),
        });
      } else {
        let children = [];
        if (include?.length) {
          include.forEach((k) => {
            const field = v?.children?.find((h) => [k, k.interface].includes(h.name));
            field &&
              children.push({
                ...field,
                targetScope: k?.targetScope,
              });
          });
        } else if (exclude?.length) {
          children = v?.children?.filter((v) => {
            return !exclude.includes(v.name);
          });
        } else {
          children = v?.children;
        }
        children?.length &&
          optionArr.push({
            ...v,
            children,
          });
      }
    });
    return optionArr;
  }, [getTemplate, record]);
  const items = useMemo<MenuProps['items']>(() => {
    return getFieldOptions()
      .map((option) => {
        if (option?.children?.length === 0) {
          return null;
        }
        if (record.template === 'view') {
          return {
            type: 'group',
            label: compile(option.label),
            title: compile(option.label),
            key: option.label,
            children: option.children
              .filter((child) => ['m2o', 'custom', 'm2m'].includes(child.name))
              .map((child) => {
                return {
                  label: compile(child.title),
                  title: compile(child.title),
                  key: child.name,
                  dataTargetScope: child.targetScope,
                };
              }),
          } as MenuItemGroupType<MenuItemType>;
        }
        return {
          type: 'group',
          label: compile(option.label),
          title: compile(option.label),
          key: option.label,
          children: option?.children
            .filter((child) => !['o2o', 'subTable', 'linkTo'].includes(child.name))
            .map((child) => {
              return {
                label: compile(child.title),
                title: compile(child.title),
                key: child.name,
                dataTargetScope: child.targetScope,
              };
            }),
        } as MenuItemGroupType<MenuItemType>;
      })
      .filter((v) => v?.children?.length);
  }, [getFieldOptions]);
  const menu = useMemo<MenuProps>(() => {
    return {
      style: {
        maxHeight: '60vh',
        overflow: 'auto',
      },
      onClick: (e) => {
        const targetScope = (e.item as any).props['data-targetScope'];
        targetScope && setTargetScope(targetScope);
        const schema = getSchema(getInterface(e.key), record, compile);
        if (schema) {
          setSchema(schema);
          setVisible(true);
        }
      },
      items,
    };
  }, [getInterface, items, record]);
  const scopeKeyOptions = useMemo(() => {
    return fields
      .filter((v) => {
        return ['string', 'bigInt', 'integer'].includes(v.type);
      })
      .map((k) => {
        return {
          value: k.name,
          label: compile(k.uiSchema?.title),
        };
      });
  }, [fields?.length]);
  return (
    record.template !== 'sql' && (
      <RecordProvider record={record}>
        <ActionContextProvider value={{ visible, setVisible }}>
          <Dropdown getPopupContainer={getContainer} trigger={trigger} align={align} menu={menu}>
            {children || (
              <Button icon={<PlusOutlined />} type={'primary'}>
                {t('Add field')}
              </Button>
            )}
          </Dropdown>
          <SchemaComponent
            schema={schema}
            components={{ ...components, ArrayTable }}
            scope={{
              getContainer,
              useCancelAction,
              createOnly: true,
              isOverride: false,
              override: false,
              useCreateCollectionField,
              record,
              showReverseFieldConfig: true,
              targetScope,
              collections: currentCollections,
              isDialect,
              disabledJSONB: false,
              scopeKeyOptions,
              createMainOnly: true,
              ...scope,
            }}
          />
        </ActionContextProvider>
      </RecordProvider>
    )
  );
};

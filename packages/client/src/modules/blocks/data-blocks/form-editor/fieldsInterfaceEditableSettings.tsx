import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrayTable } from '@tachybase/components';
import { action, createForm, Field, Form, ISchema, uid, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { Button, Modal, Select, Spin } from 'antd';
import _, { cloneDeep, omit, set } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useAPIClient, useRequest } from '../../../../api-client';
import { EditableSchemaSettings } from '../../../../application/schema-settings-editable';
import {
  IField,
  useCancelAction,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useResourceActionContext,
  useResourceContext,
} from '../../../../collection-manager';
import * as components from '../../../../collection-manager/Configuration/components';
import useDialect from '../../../../collection-manager/hooks/useDialect';
import { useCollectionField } from '../../../../data-source';
import { RecordProvider, useRecord } from '../../../../record-provider';
import {
  ActionContextProvider,
  SchemaComponent,
  useActionContext,
  useColumnSchema,
  useCompile,
  useIsAssociationField,
} from '../../../../schema-component';
import { useEditableDesignable } from './EditableDesignable';

export const fieldInterfaceEditableSettings = new EditableSchemaSettings({
  name: 'editableFieldSettings:Fields:Association',
  items: [
    {
      name: 'setCollectionField',
      useSchema() {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const { getCollection } = useCollectionManager_deprecated();
        const { name } = useCollection_deprecated();
        const collection = getCollection(name);
        const record = collection.getField(fieldSchema.name);
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
        return useIsAssociationField();
      },
    },
    // {
    //   name: 'setCollectionField',
    //   useSchema() {
    //     const { t } = useTranslation();
    //     const fieldSchema = useFieldSchema();
    //     const field = useField<Field>();
    //     const { getCollection } = useCollectionManager_deprecated();
    //     const { name } = useCollection_deprecated();
    //     const collection = getCollection(name);
    //     const record = collection.getField(fieldSchema.name);
    //     const gird = getProperties(record.interface);
    //     const form = createForm({
    //       initialValues: record,
    //     });
    //     return {
    //       type: 'object',
    //       title: t('设置关联属性'),
    //       'x-decorator': 'FormItem',
    //       'x-component': 'Action',
    //       'x-component-props': {
    //         style: {
    //           width: '100%',
    //         },
    //       },
    //       properties: {
    //         modal: {
    //           type: 'void',
    //           'x-component': 'Action.Modal',
    //           title: t('设置关联属性'),
    //           'x-decorator': 'FormV2',
    //           'x-decorator-props': {
    //             form,
    //           },
    //           properties: {
    //             gird,
    //             footer: {
    //               'x-component': 'Action.Modal.Footer',
    //               type: 'void',
    //               properties: {
    //                 cancel: {
    //                   title: '{{t("Cancel")}}',
    //                   'x-component': 'Action',
    //                   'x-use-component-props': 'useCancelActionProps',
    //                 },
    //                 submit: {
    //                   title: '{{t("Submit")}}',
    //                   'x-component': 'Action',
    //                   'x-use-component-props': () => {
    //                     const form = useForm();
    //                     const ctx = useActionContext();
    //                     return {
    //                       async onClick() {
    //                       },
    //                     };
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     }
    //   },
    //   useVisible() {
    //     return useIsAssociationField()
    //   }
    // }
  ],
});

const getProperties = (fieldInterface) => {
  switch (fieldInterface) {
    case 'oho':
      return {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          row1: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col11: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  source: {
                    type: 'void',
                    title: '{{t("Source collection")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceCollection',
                    'x-disabled': true,
                  },
                },
              },
              col12: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  target: {
                    type: 'string',
                    title: '{{t("Target collection")}}',
                    required: true,
                    // 'x-reactions': ['{{useAsyncDataSource(loadCollections, ["file"])}}'],
                    'x-decorator': 'FormItem',
                    'x-component': 'CollectionSelect',
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
          row2: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col21: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  sourceKey: {
                    type: 'string',
                    title: '{{t("Source key")}}',
                    description: "{{t('Field values must be unique.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceKey',
                  },
                },
              },
              col22: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  foreignKey: {
                    type: 'string',
                    title: '{{t("Foreign key")}}',
                    required: true,
                    // default: '{{ useNewId("f_") }}',
                    description:
                      "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'ForeignKey',
                    'x-validator': 'uid',
                    'x-disabled': true,
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
        },
      };
    case 'obo':
      return {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          row1: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col11: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  source: {
                    type: 'void',
                    title: '{{t("Source collection")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceCollection',
                    'x-disabled': true,
                  },
                },
              },
              col12: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  target: {
                    type: 'string',
                    title: '{{t("Target collection")}}',
                    required: true,
                    // 'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                    'x-decorator': 'FormItem',
                    'x-component': 'CollectionSelect',
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
          row2: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col21: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  foreignKey: {
                    type: 'string',
                    title: '{{t("Foreign key")}}',
                    required: true,
                    default: '{{ useNewId("f_") }}',
                    description:
                      "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'ForeignKey',
                    'x-validator': 'uid',
                    'x-disabled': true,
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
              col22: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  targetKey: {
                    type: 'string',
                    default: 'id',
                    title: '{{t("Target key")}}',
                    description: "{{t('Field values must be unique.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'TargetKey',
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
        },
      };
    case 'o2o':
      return {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          row1: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col11: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  source: {
                    type: 'void',
                    title: '{{t("Source collection")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceCollection',
                    'x-disabled': true,
                  },
                },
              },
              col12: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  target: {
                    type: 'string',
                    title: '{{t("Target collection")}}',
                    required: true,
                    // 'x-reactions': ['{{useAsyncDataSource(loadCollections, ["file"])}}'],
                    'x-decorator': 'FormItem',
                    'x-component': 'CollectionSelect',
                  },
                },
              },
            },
          },
          row2: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col21: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  sourceKey: {
                    type: 'string',
                    title: '{{t("Source key")}}',
                    description: "{{t('Field values must be unique.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceKey',
                  },
                },
              },
              col22: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  foreignKey: {
                    type: 'string',
                    title: '{{t("Foreign key")}}',
                    required: true,
                    default: '{{ useNewId("f_") }}',
                    description:
                      "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'ForeignKey',
                    'x-validator': 'uid',
                  },
                },
              },
            },
          },
        },
      };
    case 'o2m':
      return {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          row1: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col11: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  source: {
                    type: 'void',
                    title: '{{t("Source collection")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceCollection',
                    'x-disabled': true,
                  },
                },
              },
              col12: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  target: {
                    type: 'string',
                    title: '{{t("Target collection")}}',
                    required: true,
                    // 'x-reactions': ['{{useAsyncDataSource(loadCollections, ["file"])}}'],
                    'x-decorator': 'FormItem',
                    'x-component': 'CollectionSelect',
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
          row2: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col21: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  sourceKey: {
                    type: 'string',
                    title: '{{t("Source key")}}',
                    description: "{{t('Field values must be unique.')}}",
                    default: 'id',
                    enum: [{ label: 'ID', value: 'id' }],
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceKey',
                    'x-disabled': true,
                  },
                },
              },
              col22: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  foreignKey: {
                    type: 'string',
                    title: '{{t("Foreign key")}}',
                    required: true,
                    default: '{{ useNewId("f_") }}',
                    description:
                      "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'ForeignKey',
                    'x-validator': 'uid',
                    'x-disabled': true,
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
          row3: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col21: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {},
              },
              col22: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  targetKey: {
                    type: 'string',
                    default: 'id',
                    title: '{{t("Target key")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'TargetKey',
                    // 'x-disabled': '{{ !createOnly }}',
                    description: "{{t('Field values must be unique.')}}",
                  },
                },
              },
            },
          },
        },
      };
    case 'm2o':
      return {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          row1: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col11: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  source: {
                    type: 'void',
                    title: '{{t("Source collection")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceCollection',
                    'x-disabled': true,
                  },
                },
              },
              col12: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  target: {
                    type: 'string',
                    title: '{{t("Target collection")}}',
                    required: true,
                    // 'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                    'x-decorator': 'FormItem',
                    'x-component': 'CollectionSelect',
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
          row2: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col21: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  foreignKey: {
                    type: 'string',
                    title: '{{t("Foreign key")}}',
                    required: true,
                    // default: '{{ useNewId("f_") }}',
                    description:
                      "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'ForeignKey',
                    'x-validator': 'uid',
                    'x-disabled': true,
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
              col22: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  targetKey: {
                    type: 'string',
                    title: '{{t("Target key")}}',
                    default: 'id',
                    description: "{{t('Field values must be unique.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'TargetKey',
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
        },
      };
    case 'm2m':
      return {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          row1: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col11: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  source: {
                    type: 'string',
                    title: '{{t("Source collection")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceCollection',
                    'x-disabled': true,
                  },
                },
              },
              col12: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  through: {
                    type: 'string',
                    title: '{{t("Through collection")}}',
                    description: '{{ t("Generated automatically if left blank") }}',
                    'x-decorator': 'FormItem',
                    'x-disabled': '{{ !createOnly }}',
                    'x-component': 'ThroughCollection',
                    'x-component-props': {
                      allowClear: true,
                    },
                  },
                },
              },
              col13: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  target: {
                    type: 'string',
                    title: '{{t("Target collection")}}',
                    required: true,
                    // 'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                    'x-decorator': 'FormItem',
                    'x-component': 'CollectionSelect',
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
            },
          },
          row2: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col21: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  sourceKey: {
                    type: 'string',
                    title: '{{t("Source key")}}',
                    description: "{{t('Field values must be unique.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'SourceKey',
                    'x-disabled': true,
                    // 'x-disabled': '{{ !createOnly }}',
                  },
                },
              },
              col22: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  foreignKey: {
                    type: 'string',
                    title: '{{t("Foreign key 1")}}',
                    required: true,
                    default: '{{ useNewId("f_") }}',
                    description:
                      "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'ForeignKey',
                    'x-validator': 'uid',
                    'x-disabled': true,
                    // 'x-disabled': '{{ !createOnly||override }}',
                  },
                },
              },
              col23: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {},
              },
            },
          },
          row3: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              col21: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {},
              },
              col22: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  otherKey: {
                    type: 'string',
                    title: '{{t("Foreign key 2")}}',
                    required: true,
                    default: '{{ useNewId("f_") }}',
                    description:
                      "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'ForeignKey',
                    'x-validator': 'uid',
                    'x-disabled': true,
                    // 'x-disabled': '{{ !createOnly||override }}',
                  },
                },
              },
              col23: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  targetKey: {
                    type: 'string',
                    default: 'id',
                    title: '{{t("Target key")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'TargetKey',
                    // 'x-disabled': '{{ !createOnly }}',
                    description: "{{t('Field values must be unique.')}}",
                  },
                },
              },
            },
          },
        },
      };
  }
};

export const SetCollectionFieldModalWrapper = (props) => {
  const { record, fieldSchema, field } = props;
  const { t } = useTranslation();
  const { collections, getCollection } = useCollectionManager_deprecated();
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
    const record = useRecord();
    const form = useForm();
    const { refreshCM, getCollectionFields } = useCollectionManager_deprecated();
    const ctx = useActionContext();
    const { name: collectionName } = useCollection_deprecated();
    const { uiSchema, fieldSchema: tableColumnSchema, collectionField: tableColumnField } = useColumnSchema();
    const targetCollectionField = useCollectionField();
    const collectionField = tableColumnField || targetCollectionField;
    const fieldNames = {
      ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
      ...field?.componentProps?.fieldNames,
      ...fieldSchema?.['x-component-props']?.['fieldNames'],
    };
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
        await api.resource('collections.fields', collectionName).update({
          filterByTk: record.name,
          values: {
            ...values,
            foreignKey: `f_${uid()}`,
          },
        });
        const targetKey = values.targetKey || 'id';
        const targetCollection = getCollection(collectionField.target);
        const titleField = targetCollection?.titleField || targetKey;
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'].fieldNames = {
          value: targetKey,
          label: titleField,
        };
        await refreshCM();
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
            {t('设置默认属性')}
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
            }}
          />
        </ActionContextProvider>
      </RecordProvider>
    </>
  );
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
        title: '{{ t("设置关联属性") }}',
        'x-decorator': 'FormV2',
        'x-decorator-props': {
          form,
        },
        properties: {
          gird: gird,
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

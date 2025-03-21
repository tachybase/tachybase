import { useEffect, useMemo, useState } from 'react';
import { ArrayItems, Switch } from '@tachybase/components';
import { Field, ISchema, useField, useFieldSchema } from '@tachybase/schema';

import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useCollectionManager_deprecated, useSortFields } from '../../../../collection-manager';
import { useFieldComponentName } from '../../../../common/useFieldComponentName';
import { useCollectionManager } from '../../../../data-source';
import { useCompile, useDesignable, useFieldModeOptions, useIsAddNewForm } from '../../../../schema-component';
import { isSubMode } from '../../../../schema-component/antd/association-field/util';
import { useIsAssociationField, useIsFieldReadPretty } from '../../../../schema-component/antd/form-item';
import { SchemaSettingsItem, SchemaSettingsSubMenu } from '../../../../schema-settings';

// const SchemaSettingsClickToSelect = (props) => {
//   const { t } = useTranslation();
//   const emptyDescription = t('No blocks to connect');
//   const Content = [];
//   return (
//     <SchemaSettingsSubMenu title={t('Click to Select')}>
//       {Content.length ? (
//         Content
//       ) : (
//         <SchemaSettingsItem title="empty">
//           <Empty
//             style={{ width: 160, padding: '0 1em' }}
//             description={emptyDescription}
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//           />
//         </SchemaSettingsItem>
//       )}
//     </SchemaSettingsSubMenu>
//   )
// };

const fieldComponent: any = {
  name: 'fieldComponent',
  type: 'select',
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField<Field>();
    const fieldSchema = useFieldSchema();
    const fieldModeOptions = useFieldModeOptions();
    const isAddNewForm = useIsAddNewForm();
    const fieldComponentName = useFieldComponentName();
    const { dn } = useDesignable();

    return {
      title: t('Field component'),
      options: fieldModeOptions,
      value: fieldComponentName,
      onChange(mode) {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['mode'] = mode;
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps = field.componentProps || {};
        field.componentProps.mode = mode;

        // 子表单状态不允许设置默认值
        if (isSubMode(fieldSchema) && isAddNewForm) {
          // @ts-ignore
          schema.default = null;
          fieldSchema.default = null;
          field.setInitialValue(null);
          field.setValue(null);
        }

        void dn.emit('patch', {
          schema,
        });
        dn.refresh();
      },
    };
  },
};

const allowSelectExistingRecord = {
  name: 'allowSelectExistingRecord',
  type: 'switch',
  useVisible() {
    const readPretty = useIsFieldReadPretty();
    return !readPretty;
  },
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField<Field>();
    const fieldSchema = useFieldSchema();
    const { dn, refresh } = useDesignable();
    return {
      title: t('Allow selection of existing records'),
      checked: fieldSchema['x-component-props']?.allowSelectExistingRecord,
      onChange(value) {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        field.componentProps.allowSelectExistingRecord = value;
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'].allowSelectExistingRecord = value;
        schema['x-component-props'] = fieldSchema['x-component-props'];
        dn.emit('patch', {
          schema,
        });
        refresh();
      },
    };
  },
};

export const setDefaultSortingRules = {
  name: 'SetDefaultSortingRules',
  type: 'modal',
  useComponentProps() {
    const { getCollectionJoinField } = useCollectionManager_deprecated();
    const field = useField();
    const fieldSchema = useFieldSchema();
    const association = fieldSchema['x-collection-field'];
    const { target } = getCollectionJoinField(association) || {};
    const sortFields = useSortFields(target);
    const { t } = useTranslation();
    const { dn } = useDesignable();
    const defaultSort = field.componentProps.sortArr || [];
    const sort = defaultSort?.map((item: string) => {
      return item?.startsWith('-')
        ? {
            field: item.substring(1),
            direction: 'desc',
          }
        : {
            field: item,
            direction: 'asc',
          };
    });

    return {
      title: t('Set default sorting rules'),
      components: { ArrayItems },
      schema: {
        type: 'object',
        title: t('Set default sorting rules'),
        properties: {
          sort: {
            type: 'array',
            default: sort,
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            items: {
              type: 'object',
              properties: {
                space: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    sort: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.SortHandle',
                    },
                    field: {
                      type: 'string',
                      enum: sortFields,
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-component-props': {
                        style: {
                          width: 260,
                        },
                        optionLabelProp: 'fullLabel',
                      },
                    },
                    direction: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Radio.Group',
                      'x-component-props': {
                        optionType: 'button',
                      },
                      enum: [
                        {
                          label: t('ASC'),
                          value: 'asc',
                        },
                        {
                          label: t('DESC'),
                          value: 'desc',
                        },
                      ],
                    },
                    remove: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.Remove',
                    },
                  },
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                title: t('Add sort field'),
                'x-component': 'ArrayItems.Addition',
              },
            },
          },
        },
      } as ISchema,
      onSubmit: ({ sort }) => {
        const sortArr = sort.map((item) => {
          return item.direction === 'desc' ? `-${item.field}` : item.field;
        });
        field.componentProps.sortArr = sortArr;
        fieldSchema['x-component-props'].sortArr = sortArr;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': fieldSchema['x-component-props'],
          },
        });
      },
    };
  },
  useVisible() {
    const { getCollectionJoinField } = useCollectionManager_deprecated();
    const fieldSchema = useFieldSchema();
    const association = fieldSchema['x-collection-field'];
    const { interface: targetInterface } = getCollectionJoinField(association) || {};
    const readPretty = useIsFieldReadPretty();
    return readPretty && ['m2m', 'o2m'].includes(targetInterface);
  },
};

export const allowAddNewData = {
  name: 'allowAddNewData',
  type: 'switch',
  useVisible() {
    const readPretty = useIsFieldReadPretty();
    const isAssociationField = useIsAssociationField();
    return !readPretty && isAssociationField;
  },
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField<Field>();
    const fieldSchema = useFieldSchema();
    const { dn, refresh } = useDesignable();
    return {
      title: t('Allow add new'),
      checked: fieldSchema['x-component-props']?.allowAddnew !== (false as boolean),
      onChange(value) {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        field.componentProps.allowAddnew = value;
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'].allowAddnew = value;
        schema['x-component-props'] = fieldSchema['x-component-props'];
        dn.emit('patch', {
          schema,
        });
        refresh();
      },
    };
  },
};

export const clickToSelect = {
  name: 'clicktoselect',
  type: 'modal',
  useVisible() {
    const readPretty = useIsFieldReadPretty();
    const isAssociationField = useIsAssociationField();
    return !readPretty && isAssociationField;
  },
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField<Field>();
    const fieldSchema = useFieldSchema();
    const { dn, refresh } = useDesignable();
    const compile = useCompile();
    const cm = useCollectionManager();
    const [firstLevelValue, setFirstLevelValue] = useState(
      fieldSchema['x-component-props']['quickAddField']?.value || 'none',
    );
    const options = cm.getCollection(fieldSchema['x-collection-field']);
    // const defVal = fieldSchema['x-component-props']['quickAddField']?.value || 'none';
    const isAddNewForm = useIsAddNewForm();

    const fieldTabsOptions = options.fields
      .map((item) => {
        if (item.interface === 'm2o' || item.interface === 'select') {
          return {
            ...item,
            label: compile(item.uiSchema?.title),
            value: item.name,
          };
        }
      })
      .filter(Boolean);
    fieldTabsOptions.unshift({
      label: t('None'),
      value: 'none',
    });
    const Parentoptions = cm.getCollectionFields(`${fieldSchema['x-collection-field']}.${firstLevelValue}`);
    const fieldParentTabsOptions = Parentoptions.map((item) => {
      if (item.interface === 'm2o')
        return {
          ...item,
          label: compile(item.uiSchema.title),
          value: item.name,
        };
    }).filter(Boolean);
    fieldParentTabsOptions.unshift({
      label: t('None'),
      value: 'none',
    });
    const defParentVal = fieldSchema['x-component-props']?.['quickAddParentCollection']?.value || 'none';
    const schema = useMemo<ISchema>(() => {
      return {
        type: 'object',
        title: t('Click to select'),
        properties: {
          isquickaddtabs: {
            title: t('Enable quick create'),
            type: 'boolean',
            default: fieldSchema['x-component-props']?.isQuickAdd || false,
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {},
          },
          firstLevelselection: {
            title: t('Set Quick Add Tabs'),
            default: firstLevelValue,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: fieldTabsOptions,
            'x-reactions': [
              {
                dependencies: ['isquickaddtabs'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] === true}}',
                  },
                },
              },
            ],
            'x-component-props': {
              onChange(value) {
                setFirstLevelValue(value);
              },
            },
          },
          secondLevelselection: {
            title: t('Set Quick Add Parent Tabs'),
            default: defParentVal,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              options: fieldParentTabsOptions,
            },
            'x-reactions': [
              {
                dependencies: ['firstLevelselection', 'isquickaddtabs'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] !== "none" && $deps[1] === true}}',
                  },
                },
              },
            ],
          },
        },
      };
    }, [firstLevelValue, fieldParentTabsOptions]);

    return {
      components: {
        Switch,
      },
      title: t('Quick create'),
      schema,
      onSubmit: async ({ isquickaddtabs, firstLevelselection, secondLevelselection }) => {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        field.componentProps['isQuickAdd'] = isquickaddtabs;
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['isQuickAdd'] = isquickaddtabs;
        schema['x-component-props'] = fieldSchema['x-component-props'];
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['quickAddField'] = {
          fieldInterface: fieldTabsOptions.find((item) => item.value === firstLevelselection)?.['interface'] || 'none',
          value: firstLevelselection,
        };
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps = field.componentProps || {};
        field.componentProps['quickAddField'] = fieldSchema['x-component-props']['quickAddField'];

        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['quickAddParentCollection'] = {
          collectionField: `${fieldSchema['x-collection-field']}.${firstLevelValue}.${secondLevelselection}`,
          value: secondLevelselection,
        };
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps = field.componentProps || {};
        field.componentProps['quickAddParentCollection'] = {
          collectionField: `${fieldSchema['x-collection-field']}.${firstLevelValue}.${secondLevelselection}`,
          value: secondLevelselection,
        };

        // 子表单状态不允许设置默认值
        if (isSubMode(fieldSchema) && isAddNewForm) {
          // @ts-ignore
          schema.default = null;
          fieldSchema.default = null;
          field.setInitialValue(null);
          field.setValue(null);
        }

        void dn.emit('patch', {
          schema: schema,
        });
        refresh();
        dn.refresh();
      },
    };
  },
};

export const subTablePopoverComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:SubTable',
  items: [fieldComponent, allowAddNewData, allowSelectExistingRecord, setDefaultSortingRules, clickToSelect],
});

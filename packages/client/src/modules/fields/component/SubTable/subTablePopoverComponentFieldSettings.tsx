import { useState } from 'react';
import { ArrayItems } from '@tachybase/components';
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
  type: 'subMenu',
  useVisible() {
    const readPretty = useIsFieldReadPretty();
    const isAssociationField = useIsAssociationField();
    return !readPretty && isAssociationField;
  },
  useComponentProps() {
    return {
      title: 'Click to select',
    };
  },
  useChildren() {
    // const [selectedFirstLevel, setSelectedFirstLevel] = useState('none');
    // const [selectedSecondLevel, setSelectedSecondLevel] = useState('none');
    const children = [
      {
        name: 'none',
        type: 'item',
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
            title: 'none',
            onClick() {
              debugger;
              const schema = {
                ['x-uid']: fieldSchema['x-uid'],
              };
              field.componentProps['isQuickAdd'] = false;
              fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
              fieldSchema['x-component-props']['isQuickAdd'] = false;
              // fieldSchema['x-component-props']['quickAddField'] = 'none';
              // fieldSchema['x-component-props']['quickAddParentCollection'] = 'none';
              // setSelectedFirstLevel('none');
              // setSelectedSecondLevel('none');
              schema['x-component-props'] = fieldSchema['x-component-props'];

              dn.emit('patch', {
                schema,
              });
              refresh();
            },
          };
        },
      },
      {
        name: 'first-levelselection',
        type: 'select',
        useComponentProps() {
          const { t } = useTranslation();
          const field = useField<Field>();
          const compile = useCompile();
          const fieldSchema = useFieldSchema();
          const cm = useCollectionManager();
          const options = cm.getCollection(fieldSchema['x-collection-field']);
          const defVal = fieldSchema['x-component-props']['quickAddField'] || 'none';
          const { dn, refresh } = useDesignable();
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
            label: 'none',
            value: 'none',
          });
          return {
            title: t('First-level selection'),
            options: fieldTabsOptions,
            value: defVal,
            onChange(mode) {
              debugger;
              const schema = {
                ['x-uid']: fieldSchema['x-uid'],
              };
              if (mode === 'none') {
              } else {
                field.componentProps['isQuickAdd'] = true;
                fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
                fieldSchema['x-component-props']['isQuickAdd'] = true;
                schema['x-component-props'] = fieldSchema['x-component-props'];
                refresh();
              }

              fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
              fieldSchema['x-component-props']['quickAddField'] = {
                fieldInterface: fieldTabsOptions.find((item) => item.value === mode)['interface'] || 'none',
                value: mode,
              };
              schema['x-component-props'] = fieldSchema['x-component-props'];
              field.componentProps = field.componentProps || {};
              field.componentProps['quickAddField'] = fieldSchema['x-component-props']['quickAddField'];

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
        // useVisible() {
        //   const fieldSchema = useFieldSchema();
        //   return fieldSchema['x-component-props']['isQuickAdd'];
        // },
      },
      {
        name: 'second-levelselection',
        type: 'select',
        useComponentProps() {
          const { t } = useTranslation();
          const field = useField<Field>();
          const compile = useCompile();
          const fieldSchema = useFieldSchema();
          const cm = useCollectionManager();
          const { value: quickField } = fieldSchema['x-component-props']?.['quickAddField'] || {};
          const options = cm.getCollectionFields(`${fieldSchema['x-collection-field']}.${quickField}`);
          const { dn, refresh } = useDesignable();
          const isAddNewForm = useIsAddNewForm();
          const fieldTabsOptions = options
            .map((item) => {
              if (item.interface === 'm2o')
                return {
                  ...item,
                  label: compile(item.uiSchema.title),
                  value: item.name,
                };
            })
            .filter(Boolean);
          fieldTabsOptions.unshift({
            label: t('none'),
            value: 'none',
          });
          const defValue = fieldSchema['x-component-props']?.['quickAddParentCollection']?.value || 'none';
          return {
            title: t('Second-level selection'),
            options: fieldTabsOptions,
            value: defValue,
            onChange(mode) {
              const schema = {
                ['x-uid']: fieldSchema['x-uid'],
              };
              fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
              fieldSchema['x-component-props']['quickAddParentCollection'] = {
                collectionField: `${fieldSchema['x-collection-field']}.${quickField}.${mode}`,
                value: mode,
              };
              schema['x-component-props'] = fieldSchema['x-component-props'];
              field.componentProps = field.componentProps || {};
              field.componentProps['quickAddParentCollection'] = {
                collectionField: `${fieldSchema['x-collection-field']}.${quickField}.${mode}`,
                value: mode,
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
                schema,
              });
              dn.refresh();
            },
          };
        },
        useVisible() {
          const fieldSchema = useFieldSchema();
          return (
            fieldSchema['x-component-props']['isQuickAdd'] &&
            fieldSchema['x-component-props']['quickAddField'] &&
            fieldSchema['x-component-props']['quickAddField'] !== 'none'
          );
        },
      },
    ];
    return children;
  },
};

// export const isQuickAddTabs = {
//   name: 'isquickaddtabs',
//   type: 'switch',
//   useVisible() {
//     const readPretty = useIsFieldReadPretty();
//     const isAssociationField = useIsAssociationField();
//     return !readPretty && isAssociationField;
//   },

//   useComponentProps() {
//     const { t } = useTranslation();
//     const field = useField<Field>();
//     const fieldSchema = useFieldSchema();
//     const { dn, refresh } = useDesignable();
//     return {
//       title: t('Is Quick Add Tabs'),
//       checked: fieldSchema['x-component-props']?.isQuickAdd || false,
//       onChange(value) {
//         const schema = {
//           ['x-uid']: fieldSchema['x-uid'],
//         };
//         field.componentProps['isQuickAdd'] = value;
//         console.log("%c Line:494 🍺 field.componentProps['isQuickAdd']", "font-size:18px;color:#b03734;background:#ffdd4d", field.componentProps['isQuickAdd']);
//         fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
//         console.log("%c Line:496 🍰 fieldSchema['x-component-props']", "font-size:18px;color:#ed9ec7;background:#465975", fieldSchema['x-component-props']);
//         fieldSchema['x-component-props']['isQuickAdd'] = value;
//         console.log("%c Line:498 🍺 fieldSchema['x-component-props']['isQuickAdd']", "font-size:18px;color:#2eafb0;background:#f5ce50", fieldSchema['x-component-props']['isQuickAdd']);
//         schema['x-component-props'] = fieldSchema['x-component-props'];
//         console.log("%c Line:499 🍿 schema['x-component-props']", "font-size:18px;color:#42b983;background:#ffdd4d", schema['x-component-props']);
//         dn.emit('patch', {
//           schema,
//         });
//         refresh();
//       },
//     };
//   },
// };

// export const setQuickAddTabs = {
//   name: 'setquickaddtabs',
//   type: 'select',
//   useComponentProps() {
//     const { t } = useTranslation();
//     const field = useField<Field>();
//     const compile = useCompile();
//     const fieldSchema = useFieldSchema();
//     const cm = useCollectionManager();
//     const options = cm.getCollection(fieldSchema['x-collection-field']);
//     const defVal = fieldSchema['x-component-props']['quickAddField'] || 'none';
//     const { dn } = useDesignable();
//     const isAddNewForm = useIsAddNewForm();
//     const fieldTabsOptions = options.fields
//       .map((item) => {
//         if (item.interface === 'm2o' || item.interface === 'select') {
//           return {
//             ...item,
//             label: compile(item.uiSchema?.title),
//             value: item.name,
//           };
//         }
//       })
//       .filter(Boolean);
//     fieldTabsOptions.unshift({
//       label: 'none',
//       value: 'none',
//     });
//     return {
//       title: t('Set Quick Add Tabs'),
//       options: fieldTabsOptions,
//       value: defVal,
//       onChange(mode) {
//         const schema = {
//           ['x-uid']: fieldSchema['x-uid'],
//         };
//         fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
//         fieldSchema['x-component-props']['quickAddField'] = {
//           fieldInterface: fieldTabsOptions.find((item) => item.value === mode)['interface'] || 'none',
//           value: mode,
//         };
//         schema['x-component-props'] = fieldSchema['x-component-props'];
//         field.componentProps = field.componentProps || {};
//         field.componentProps['quickAddField'] = fieldSchema['x-component-props']['quickAddField'];

//         // 子表单状态不允许设置默认值
//         if (isSubMode(fieldSchema) && isAddNewForm) {
//           // @ts-ignore
//           schema.default = null;
//           fieldSchema.default = null;
//           field.setInitialValue(null);
//           field.setValue(null);
//         }

//         void dn.emit('patch', {
//           schema,
//         });
//         dn.refresh();
//       },
//     };
//   },
//   useVisible() {
//     const fieldSchema = useFieldSchema();
//     return fieldSchema['x-component-props']['isQuickAdd'];
//   },
// };

// export const setQuickAddParentTabs = {
//   name: 'setquickaddparenttabs',
//   type: 'select',
//   useComponentProps() {
//     const { t } = useTranslation();
//     const field = useField<Field>();
//     const compile = useCompile();
//     const fieldSchema = useFieldSchema();
//     const cm = useCollectionManager();
//     const { value: quickField } = fieldSchema['x-component-props']?.['quickAddField'] || {};
//     const options = cm.getCollectionFields(`${fieldSchema['x-collection-field']}.${quickField}`);
//     const { dn } = useDesignable();
//     const isAddNewForm = useIsAddNewForm();
//     const fieldTabsOptions = options
//       .map((item) => {
//         if (item.interface === 'm2o')
//           return {
//             ...item,
//             label: compile(item.uiSchema.title),
//             value: item.name,
//           };
//       })
//       .filter(Boolean);
//     fieldTabsOptions.unshift({
//       label: t('none'),
//       value: 'none',
//     });
//     const defValue = fieldSchema['x-component-props']?.['quickAddParentCollection']?.value || 'none';
//     return {
//       title: t('Set Quick Add Parent Tabs'),
//       options: fieldTabsOptions,
//       value: defValue,
//       onChange(mode) {
//         const schema = {
//           ['x-uid']: fieldSchema['x-uid'],
//         };
//         fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
//         fieldSchema['x-component-props']['quickAddParentCollection'] = {
//           collectionField: `${fieldSchema['x-collection-field']}.${quickField}.${mode}`,
//           value: mode,
//         };
//         schema['x-component-props'] = fieldSchema['x-component-props'];
//         field.componentProps = field.componentProps || {};
//         field.componentProps['quickAddParentCollection'] = {
//           collectionField: `${fieldSchema['x-collection-field']}.${quickField}.${mode}`,
//           value: mode,
//         };
//         // 子表单状态不允许设置默认值
//         if (isSubMode(fieldSchema) && isAddNewForm) {
//           // @ts-ignore
//           schema.default = null;
//           fieldSchema.default = null;
//           field.setInitialValue(null);
//           field.setValue(null);
//         }
//         void dn.emit('patch', {
//           schema,
//         });
//         dn.refresh();
//       },
//     };
//   },
//   useVisible() {
//     const fieldSchema = useFieldSchema();
//     return (
//       fieldSchema['x-component-props']['isQuickAdd'] &&
//       fieldSchema['x-component-props']['quickAddField'] &&
//       fieldSchema['x-component-props']['quickAddField'] !== 'none'
//     );
//   },
// };

export const subTablePopoverComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:SubTable',
  items: [
    fieldComponent,
    allowAddNewData,
    allowSelectExistingRecord,
    setDefaultSortingRules,
    clickToSelect,
    // isQuickAddTabs,
    // setQuickAddTabs,
    // setQuickAddParentTabs,
  ],
});

// interface SchemaSettingsClickToSelectProps {
//   type: FilterBlockType;
//   emptyDescription?: string;
// }

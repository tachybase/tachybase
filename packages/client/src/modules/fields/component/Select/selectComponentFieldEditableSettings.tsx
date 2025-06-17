import React, { useCallback } from 'react';
import { Field, ISchema, useField, useFieldSchema, useForm } from '@tachybase/schema';

import _, { property } from 'lodash';
import { useTranslation } from 'react-i18next';

import { EditableSchemaSettings } from '../../../../application/schema-settings-editable';
import { useFormBlockContext } from '../../../../block-provider';
import { useCollection_deprecated, useCollectionManager_deprecated } from '../../../../collection-manager';
import { useCollectionFilterOptionsV2 } from '../../../../collection-manager/action-hooks';
import { useFieldComponentName } from '../../../../common/useFieldComponentName';
import { useCollectionField } from '../../../../data-source';
import { FlagProvider, useFlag } from '../../../../flag-provider';
import { useRecord } from '../../../../record-provider';
import {
  DatePickerProvider,
  removeNullCondition,
  SchemaComponent,
  useActionContext,
  useDesignable,
  useFieldModeOptions,
  useIsAddNewForm,
} from '../../../../schema-component';
import { isSubMode } from '../../../../schema-component/antd/association-field/util';
import { DynamicComponentProps } from '../../../../schema-component/antd/filter/DynamicComponent';
import {
  useIsAssociationField,
  useIsFieldReadPretty,
  useIsMuiltipleAble,
  useIsSelectFieldMode,
  useTitleFieldOptions,
} from '../../../../schema-component/antd/form-item/FormItem.Settings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';
import {
  BaseVariableProvider,
  EditFormulaTitleField,
  getShouldChange,
  IsDisabledParams,
  useFormulaTitleOptions,
  useFormulaTitleVisible,
  VariableInput,
} from '../../../../schema-settings';
import { useIsShowMultipleSwitch } from '../../../../schema-settings/hooks/useIsShowMultipleSwitch';
import { SchemaSettingsDataScope } from '../../../../schema-settings/SchemaSettingsDataScope';
import { SchemaSettingsSortingRule } from '../../../../schema-settings/SchemaSettingsSortingRule';
import { useLocalVariables, useVariables } from '../../../../variables';
import { useEditableDesignable } from '../../../blocks/data-blocks/form-editor/EditableDesignable';

export const selectComponentFieldEditableSettings = new EditableSchemaSettings({
  name: 'editableFieldSettings:component:Select',
  items: [
    {
      name: 'fieldComponent',
      useSchema() {
        return {
          type: 'string',
          title: '{{t("Field component")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
        };
      },
      useVisible: useIsMuiltipleAble,
      useComponentProps() {
        const { t } = useTranslation();
        const eddn = useEditableDesignable();
        const field = useField<Field>();
        const isAddNewForm = useIsAddNewForm();
        const fieldMode = useFieldComponentName();
        const collectionFieldCurrent = useCollectionField();
        const { fieldSchema: tableColumnSchema, collectionField } = useColumnSchema();
        const schema = useFieldSchema();
        const fieldSchema = tableColumnSchema || schema;
        const fieldModeOptions = useFieldModeOptions({ fieldSchema: tableColumnSchema, collectionField });
        const isMuiltipleSelect = ['select'].includes(collectionFieldCurrent?.interface);
        const optionsMuiltipleSelect = [
          { label: t('Select'), value: 'Select' },
          { label: t('Radio group'), value: 'Radio group' },
        ];
        return {
          options: isMuiltipleSelect ? optionsMuiltipleSelect : fieldModeOptions,
          onChange: (mode) => {
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
              field?.setInitialValue?.(null);
              field?.setValue?.(null);
            }
            eddn.refresh();
          },
          value: fieldMode,
        };
      },
    },
    {
      name: 'setTheDataScope',
      useSchema() {
        const { t } = useTranslation();
        const { getCollectionJoinField, getAllCollectionsInheritChain } = useCollectionManager_deprecated();
        const { getField } = useCollection_deprecated();
        const { form } = useFormBlockContext();
        const record = useRecord();
        const { fieldSchema: tableColumnSchema, collectionField: tableColumnField } = useColumnSchema();
        const schema = useFieldSchema();
        const fieldSchema = tableColumnSchema || schema;
        const collectionField =
          tableColumnField ||
          getField(fieldSchema['name']) ||
          getCollectionJoinField(fieldSchema['x-collection-field']);
        const { getFields } = useCollectionFilterOptionsV2(collectionField?.target);
        const { isInSubForm, isInSubTable } = useFlag() || {};
        const variables = useVariables();
        const localVariables = useLocalVariables();
        const { dn } = useEditableDesignable();
        const dynamicComponent = (props: DynamicComponentProps) => {
          return (
            <VariableInput
              {...props}
              form={form}
              collectionField={props.collectionField}
              record={record}
              shouldChange={getShouldChange({
                collectionField: props.collectionField,
                variables,
                localVariables,
                getAllCollectionsInheritChain,
              })}
            />
          );
        };
        return {
          type: 'object',
          title: t('Set the data scope'),
          'x-decorator': 'FormItem',
          'x-component': 'Action',
          'x-component-props': {
            style: {
              width: '100%',
            },
          },
          properties: {
            modal: {
              type: 'void',
              'x-component': 'Action.Modal',
              title: t('Set the data scope'),
              'x-decorator': 'FormV2',
              properties: {
                filter: {
                  enum: getFields(),
                  'x-decorator': (props) => (
                    <BaseVariableProvider {...props}>
                      <FlagProvider isInSubForm={isInSubForm} isInSubTable={isInSubTable}>
                        {props.children}
                      </FlagProvider>
                    </BaseVariableProvider>
                  ),
                  'x-decorator-props': {
                    isDisabled,
                  },
                  'x-component': 'Filter',
                  'x-component-props': {
                    collectionName: collectionField?.target,
                    dynamicComponent: dynamicComponent,
                    defaultFilter: fieldSchema?.['x-component-props']?.service?.params?.filter || {},
                    onChange: (data) => {
                      console.log('%c Line:158 🥑 data', 'font-size:18px;color:#4fff4B;background:#7f2b82', data);
                    },
                  },
                },
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
                      // 'x-component-props': {
                      //   type: 'primary',
                      //   // useAction: useSubmitAction,
                      // },
                      'x-use-component-props': () => {
                        const form = useForm();
                        const ctx = useActionContext();
                        return {
                          async onClick() {
                            let filter = form.values.filter;
                            filter = removeNullCondition(filter);
                            _.set(fieldSchema['x-component-props'], 'service.params.filter', filter);
                            ctx?.setVisible?.(false);
                            dn.refresh();
                          },
                        };
                      },
                    },
                  },
                },
              },
            },
          },
        };
      },
      useVisible() {
        const isSelectFieldMode = useIsSelectFieldMode();
        const isFieldReadPretty = useIsFieldReadPretty();
        return isSelectFieldMode && !isFieldReadPretty;
      },
    },
    // {
    //   ...setDefaultSortingRules,
    //   useComponentProps() {
    //     const { fieldSchema } = useColumnSchema();
    //     return {
    //       fieldSchema,
    //     };
    //   },
    //   useVisible() {
    //     const isSelectFieldMode = useIsSelectFieldMode();
    //     const isFieldReadPretty = useIsFieldReadPretty();
    //     return isSelectFieldMode && !isFieldReadPretty;
    //   },
    // },
    // {
    //   ...quickCreate,
    //   useVisible() {
    //     const isAssociationField = useIsAssociationField();
    //     const readPretty = useIsFieldReadPretty();
    //     const { fieldSchema } = useColumnSchema();
    //     return isAssociationField && !fieldSchema && !readPretty;
    //   },
    // },
    // {
    //   ...allowMultiple,
    //   useVisible() {
    //     const isAssociationField = useIsAssociationField();
    //     const IsShowMultipleSwitch = useIsShowMultipleSwitch();
    //     return isAssociationField && IsShowMultipleSwitch();
    //   },
    // },
    // {
    //   ...titleField,
    //   useVisible: useIsAssociationField,
    // },
    // {
    //   ...enableLink,
    //   useVisible() {
    //     const readPretty = useIsFieldReadPretty();
    //     return useIsAssociationField() && readPretty;
    //   },
    // }
  ],
});

export const EditableSchemaSettingsDataScope = (props) => {
  const { t } = useTranslation();
  const { getFields } = useCollectionFilterOptionsV2(props.collectionName);
  const record = useRecord();
  const { form } = useFormBlockContext();
  const variables = useVariables();
  const localVariables = useLocalVariables();
  const { getAllCollectionsInheritChain } = useCollectionManager_deprecated();
  const { isInSubForm, isInSubTable } = useFlag() || {};

  const dynamicComponent = useCallback(
    (props: DynamicComponentProps) => {
      return (
        <DatePickerProvider value={{ utc: false }}>
          <VariableInput
            {...props}
            form={form}
            record={record}
            shouldChange={getShouldChange({
              collectionField: props.collectionField,
              variables,
              localVariables,
              getAllCollectionsInheritChain,
            })}
          />
        </DatePickerProvider>
      );
    },
    [form, getAllCollectionsInheritChain, localVariables, record, variables],
  );
  const getSchema = () => {
    return {
      type: 'object',
      title: t('Set the data scope'),
      properties: {
        filter: {
          enum: props.collectionFilterOption || getFields(),
          'x-decorator': (props) => (
            <BaseVariableProvider {...props}>
              <FlagProvider isInSubForm={isInSubForm} isInSubTable={isInSubTable}>
                {props.children}
              </FlagProvider>
            </BaseVariableProvider>
          ),
          'x-decorator-props': {
            isDisabled,
          },
          'x-component': 'Filter',
          'x-component-props': {
            collectionName: props.collectionName,
            dynamicComponent: props.dynamicComponent || dynamicComponent,
          },
        },
      },
    };
  };

  return <SchemaComponent schema={getSchema()} />;
};

function isDisabled(params: IsDisabledParams) {
  const { option, collectionField, uiSchema } = params;

  if (!uiSchema || !collectionField) {
    return true;
  }

  // json 类型的字段，允许设置任意类型的值
  if (collectionField.interface === 'json') {
    return false;
  }

  // 数据范围支持选择 `对多` 、`对一` 的关系字段
  if (option.target) {
    return false;
  }

  if (['input', 'markdown', 'richText', 'textarea', 'username'].includes(collectionField.interface)) {
    return !['string', 'number'].includes(option.schema?.type);
  }

  if (collectionField.interface && option.interface) {
    return collectionField.interface !== option.interface;
  }

  if (uiSchema?.['x-component'] !== option.schema?.['x-component']) {
    return true;
  }

  return false;
}

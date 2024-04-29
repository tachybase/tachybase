import { ArrayCollapse, FormLayout } from '@tachybase/components';
import { Field } from '@tachybase/schema';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useApp, useSchemaToolbar } from '../../../../application';
import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useFormBlockContext } from '../../../../block-provider';
import { useCollectionManager_deprecated, useCollection_deprecated } from '../../../../collection-manager';
import { useFieldComponentName } from '../../../../common/useFieldComponentName';
import { useDesignable, useValidateSchema } from '../../../../schema-component';
import { useIsFormReadPretty } from '../../../../schema-component/antd/form-item/FormItem.Settings';
import { getTempFieldState } from '../../../../schema-component/antd/form-v2/utils';
import { isPatternDisabled } from '../../../../schema-settings';
import { ActionType } from '../../../../schema-settings/LinkageRules/type';
import { SchemaSettingsDefaultValue } from '../../../../schema-settings/SchemaSettingsDefaultValue';
import { useIsAllowToSetDefaultValue } from '../../../../schema-settings/hooks/useIsAllowToSetDefaultValue';
import { css } from '@nocobase/client';

export const fieldSettingsFormItem = new SchemaSettings({
  name: 'fieldSettings:FormItem',
  items: [
    {
      name: 'decoratorOptions',
      type: 'itemGroup',
      hideIfNoChildren: true,
      useComponentProps() {
        const { t } = useTranslation();
        return {
          title: t('Generic properties'),
        };
      },
      useChildren(): any {
        return [
          {
            name: 'editFieldTitle',
            type: 'modal',
            useComponentProps() {
              const { t } = useTranslation();
              const { dn } = useDesignable();
              const field = useField<Field>();
              const fieldSchema = useFieldSchema();
              const { getCollectionJoinField } = useCollectionManager_deprecated();
              const { getField } = useCollection_deprecated();
              const collectionField =
                getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);

              return {
                title: t('Edit field title'),
                schema: {
                  type: 'object',
                  title: t('Edit field title'),
                  properties: {
                    title: {
                      title: t('Field title'),
                      default: field?.title,
                      description: `${t('Original field title: ')}${collectionField?.uiSchema?.title}`,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {},
                    },
                  },
                } as ISchema,
                onSubmit({ title }) {
                  if (title) {
                    field.title = title;
                    fieldSchema.title = title;
                    dn.emit('patch', {
                      schema: {
                        'x-uid': fieldSchema['x-uid'],
                        title: fieldSchema.title,
                      },
                    });
                  }
                  dn.refresh();
                },
              };
            },
          },
          {
            name: 'displayTitle',
            type: 'switch',
            useComponentProps() {
              const { t } = useTranslation();
              const { dn } = useDesignable();
              const field = useField<Field>();
              const fieldSchema = useFieldSchema();

              return {
                title: t('Display title'),
                checked: fieldSchema['x-decorator-props']?.['showTitle'] ?? true,
                onChange(checked) {
                  fieldSchema['x-decorator-props'] = fieldSchema['x-decorator-props'] || {};
                  fieldSchema['x-decorator-props']['showTitle'] = checked;
                  field.decoratorProps.showTitle = checked;
                  dn.emit('patch', {
                    schema: {
                      'x-uid': fieldSchema['x-uid'],
                      'x-decorator-props': {
                        ...fieldSchema['x-decorator-props'],
                        showTitle: checked,
                      },
                    },
                  });
                  dn.refresh();
                },
              };
            },
          },
          {
            name: 'editDescription',
            type: 'modal',
            useComponentProps() {
              const { t } = useTranslation();
              const { dn } = useDesignable();
              const field = useField<Field>();
              const fieldSchema = useFieldSchema();

              return {
                title: t('Edit description'),
                schema: {
                  type: 'object',
                  title: t('Edit description'),
                  properties: {
                    description: {
                      // title: t('Description'),
                      default: field?.description,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input.TextArea',
                      'x-component-props': {},
                    },
                  },
                } as ISchema,
                onSubmit({ description }) {
                  field.description = description;
                  fieldSchema.description = description;
                  dn.emit('patch', {
                    schema: {
                      'x-uid': fieldSchema['x-uid'],
                      description: fieldSchema.description,
                    },
                  });
                  dn.refresh();
                },
              };
            },
          },
          {
            name: 'editTooltip',
            type: 'modal',
            useComponentProps() {
              const { t } = useTranslation();
              const { dn } = useDesignable();
              const field = useField<Field>();
              const fieldSchema = useFieldSchema();

              return {
                title: t('Edit tooltip'),
                schema: {
                  type: 'object',
                  title: t('Edit tooltip'),
                  properties: {
                    tooltip: {
                      default: fieldSchema?.['x-decorator-props']?.tooltip,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input.TextArea',
                      'x-component-props': {},
                    },
                  },
                } as ISchema,
                onSubmit({ tooltip }) {
                  field.decoratorProps.tooltip = tooltip;
                  fieldSchema['x-decorator-props'] = fieldSchema['x-decorator-props'] || {};
                  fieldSchema['x-decorator-props']['tooltip'] = tooltip;
                  dn.emit('patch', {
                    schema: {
                      'x-uid': fieldSchema['x-uid'],
                      'x-decorator-props': fieldSchema['x-decorator-props'],
                    },
                  });
                  dn.refresh();
                },
              };
            },
          },
          {
            name: 'required',
            type: 'switch',
            useVisible() {
              const field = useField<Field>();
              const fieldSchema = useFieldSchema();
              const { required = true } = useSchemaToolbar();
              return !field.readPretty && fieldSchema['x-component'] !== 'FormField' && required;
            },
            useComponentProps() {
              const { t } = useTranslation();
              const field = useField<Field>();
              const fieldSchema = useFieldSchema();
              const { dn, refresh } = useDesignable();

              return {
                title: t('Required'),
                checked: fieldSchema.required as boolean,
                onChange(required) {
                  const schema = {
                    ['x-uid']: fieldSchema['x-uid'],
                  };
                  field.required = required;
                  fieldSchema['required'] = required;
                  schema['required'] = required;
                  dn.emit('patch', {
                    schema,
                  });
                  refresh();
                },
              };
            },
          },
          {
            name: 'setDefaultValue',
            useVisible() {
              const { isAllowToSetDefaultValue } = useIsAllowToSetDefaultValue();
              return isAllowToSetDefaultValue();
            },
            Component: SchemaSettingsDefaultValue,
          },
          {
            name: 'layoutDirection',
            type: 'select',
            useComponentProps() {
              const { t } = useTranslation();
              const fieldSchema = useFieldSchema();
              const { dn } = useDesignable();
              const initialValue = fieldSchema['x-decorator-props']?.layoutDirection ?? 'column';
              return {
                title: t('Layout Direction'),
                options: [
                  { label: t('Row'), value: 'row' },
                  { label: t('Column'), value: 'column' },
                ],
                value: initialValue,
                onChange(v) {
                  const schema: ISchema = {
                    ['x-uid']: fieldSchema['x-uid'],
                  };

                  const styleValue = {
                    layoutDirection: v ?? 'column',
                    style: {
                      display: 'flex',
                      flexDirection: `${v === 'row' ? 'row' : 'column'}`,
                      alignItems: 'baseline',
                    },
                  };

                  _.set(fieldSchema, 'x-decorator-props', styleValue);
                  _.set(schema, 'x-decorator-props', styleValue);

                  dn.emit('patch', {
                    schema,
                  });

                  dn.refresh();
                },
              };
            },
          },
          {
            name: 'pattern',
            type: 'select',
            useVisible() {
              const { form } = useFormBlockContext();
              const fieldSchema = useFieldSchema();
              return form && !form?.readPretty && !isPatternDisabled(fieldSchema);
            },
            useComponentProps() {
              const { t } = useTranslation();
              const field = useField<Field>();
              const fieldSchema = useFieldSchema();
              const { dn } = useDesignable();
              let readOnlyMode = 'editable';
              if (fieldSchema['x-disabled'] === true) {
                readOnlyMode = 'readonly';
              }
              if (fieldSchema['x-read-pretty'] === true) {
                readOnlyMode = 'read-pretty';
              }
              return {
                title: t('Pattern'),
                options: [
                  { label: t('Editable'), value: 'editable' },
                  { label: t('Readonly'), value: 'readonly' },
                  { label: t('Easy-reading'), value: 'read-pretty' },
                ],
                value: readOnlyMode,
                onChange(v) {
                  const schema: ISchema = {
                    ['x-uid']: fieldSchema['x-uid'],
                  };

                  switch (v) {
                    case 'readonly': {
                      fieldSchema['x-read-pretty'] = false;
                      fieldSchema['x-disabled'] = true;
                      schema['x-read-pretty'] = false;
                      schema['x-disabled'] = true;
                      field.readPretty = false;
                      field.disabled = true;
                      _.set(field, 'initStateOfLinkageRules.pattern', getTempFieldState(true, ActionType.ReadOnly));
                      break;
                    }
                    case 'read-pretty': {
                      fieldSchema['x-read-pretty'] = true;
                      fieldSchema['x-disabled'] = false;
                      schema['x-read-pretty'] = true;
                      schema['x-disabled'] = false;
                      field.readPretty = true;
                      _.set(field, 'initStateOfLinkageRules.pattern', getTempFieldState(true, ActionType.ReadPretty));
                      break;
                    }
                    default: {
                      fieldSchema['x-read-pretty'] = false;
                      fieldSchema['x-disabled'] = false;
                      schema['x-read-pretty'] = false;
                      schema['x-disabled'] = false;
                      field.readPretty = false;
                      field.disabled = false;
                      _.set(field, 'initStateOfLinkageRules.pattern', getTempFieldState(true, ActionType.Editable));
                      break;
                    }
                  }

                  dn.emit('patch', {
                    schema,
                  });

                  dn.refresh();
                },
              };
            },
          },
          {
            name: 'setValidationRules',
            type: 'modal',
            useComponentProps() {
              const { t } = useTranslation();
              const field = useField<Field>();
              const fieldSchema = useFieldSchema();
              const { dn, refresh } = useDesignable();
              const validateSchema = useValidateSchema();
              const { getCollectionJoinField } = useCollectionManager_deprecated();
              const { getField } = useCollection_deprecated();
              const collectionField =
                getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);

              return {
                title: t('Set validation rules'),
                components: { ArrayCollapse, FormLayout },
                schema: {
                  type: 'object',
                  title: t('Set validation rules'),
                  properties: {
                    rules: {
                      type: 'array',
                      default: fieldSchema?.['x-validator'],
                      'x-component': 'ArrayCollapse',
                      'x-decorator': 'FormItem',
                      'x-component-props': {
                        accordion: true,
                      },
                      maxItems: 3,
                      items: {
                        type: 'object',
                        'x-component': 'ArrayCollapse.CollapsePanel',
                        'x-component-props': {
                          header: '{{ t("Validation rule") }}',
                        },
                        properties: {
                          index: {
                            type: 'void',
                            'x-component': 'ArrayCollapse.Index',
                          },
                          layout: {
                            type: 'void',
                            'x-component': 'FormLayout',
                            'x-component-props': {
                              labelStyle: {
                                marginTop: '6px',
                              },
                              labelCol: 8,
                              wrapperCol: 16,
                            },
                            properties: {
                              ...validateSchema,
                              message: {
                                type: 'string',
                                title: '{{ t("Error message") }}',
                                'x-decorator': 'FormItem',
                                'x-component': 'Input.TextArea',
                                'x-component-props': {
                                  autoSize: {
                                    minRows: 2,
                                    maxRows: 2,
                                  },
                                },
                              },
                            },
                          },
                          remove: {
                            type: 'void',
                            'x-component': 'ArrayCollapse.Remove',
                          },
                          moveUp: {
                            type: 'void',
                            'x-component': 'ArrayCollapse.MoveUp',
                          },
                          moveDown: {
                            type: 'void',
                            'x-component': 'ArrayCollapse.MoveDown',
                          },
                        },
                      },
                      properties: {
                        add: {
                          type: 'void',
                          title: '{{ t("Add validation rule") }}',
                          'x-component': 'ArrayCollapse.Addition',
                          'x-reactions': {
                            dependencies: ['rules'],
                            fulfill: {
                              state: {
                                disabled: '{{$deps[0].length >= 3}}',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                } as ISchema,
                onSubmit(v) {
                  const rules = [];
                  for (const rule of v.rules) {
                    rules.push(_.pickBy(rule, _.identity));
                  }
                  const schema = {
                    ['x-uid']: fieldSchema['x-uid'],
                  };
                  if (['percent'].includes(collectionField?.interface)) {
                    for (const rule of rules) {
                      if (!!rule.maxValue || !!rule.minValue) {
                        rule['percentMode'] = true;
                      }

                      if (rule.percentFormat) {
                        rule['percentFormats'] = true;
                      }
                    }
                  }
                  const concatValidator = _.concat([], collectionField?.uiSchema?.['x-validator'] || [], rules);
                  field.validator = concatValidator;
                  fieldSchema['x-validator'] = rules;
                  schema['x-validator'] = rules;
                  dn.emit('patch', {
                    schema,
                  });
                  refresh();
                },
              };
            },
            useVisible() {
              const { form } = useFormBlockContext();
              const isFormReadPretty = useIsFormReadPretty();
              const validateSchema = useValidateSchema();
              return form && !isFormReadPretty && validateSchema;
            },
          },
        ];
      },
    },
    {
      name: 'componentOptions',
      type: 'itemGroup',
      hideIfNoChildren: true,
      useComponentProps() {
        const { t } = useTranslation();
        return {
          title: t('Specific properties'),
        };
      },
      useChildren() {
        const app = useApp();
        const fieldComponentName = useFieldComponentName();
        const componentSettings = app.schemaSettingsManager.get(`fieldSettings:component:${fieldComponentName}`);
        return componentSettings?.items || [];
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'delete',
      type: 'remove',
      sort: 100,
      useComponentProps() {
        const { t } = useTranslation();

        return {
          removeParentsIfNoChildren: true,
          confirm: {
            title: t('Delete field'),
          },
          breakRemoveOn: {
            'x-component': 'Grid',
          },
        };
      },
    },
  ],
});

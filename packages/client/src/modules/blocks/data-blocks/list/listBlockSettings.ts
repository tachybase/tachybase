import { ArrayItems } from '@tachybase/components';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useFormBlockContext } from '../../../../block-provider';
import { useCollection_deprecated, useSortFields } from '../../../../collection-manager';
import { removeNullCondition, useDesignable } from '../../../../schema-component';
import { SchemaSettingsBlockTitleItem, SchemaSettingsTemplate } from '../../../../schema-settings';
import { SchemaSettingsDataScope } from '../../../../schema-settings/SchemaSettingsDataScope';
import { SetDataLoadingMode, setDataLoadingModeSettingsItem } from '../details-multi/setDataLoadingModeSettingsItem';

export const listBlockSettings = new SchemaSettings({
  name: 'blockSettings:list',
  items: [
    {
      name: 'EditBlockTitle',
      Component: SchemaSettingsBlockTitleItem,
    },
    {
      name: 'SetTheDataScope',
      Component: SchemaSettingsDataScope,
      useComponentProps() {
        const { name } = useCollection_deprecated();
        const fieldSchema = useFieldSchema();
        const { form } = useFormBlockContext();
        const field = useField();
        const { dn } = useDesignable();

        return {
          collectionName: name,
          defaultFilter: fieldSchema?.['x-decorator-props']?.params?.filter || {},
          form: form,
          onSubmit: ({ filter }) => {
            filter = removeNullCondition(filter);
            _.set(fieldSchema, 'x-decorator-props.params.filter', filter);
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params, page: 1 };
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': fieldSchema['x-decorator-props'],
              },
            });
          },
        };
      },
    },
    {
      name: 'SetDefaultSortingRules',
      type: 'modal',
      useComponentProps() {
        const { name } = useCollection_deprecated();
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const field = useField();
        const { dn } = useDesignable();
        const sortFields = useSortFields(name);
        const defaultSort = fieldSchema?.['x-decorator-props']?.params?.sort || [];
        const sort = defaultSort?.map((item: string) => {
          return item.startsWith('-')
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

            _.set(fieldSchema, 'x-decorator-props.params.sort', sortArr);
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params, page: 1 };
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': fieldSchema['x-decorator-props'],
              },
            });
          },
        };
      },
    },
    {
      name: 'setDataLoadingMode',
      Component: SetDataLoadingMode,
    },
    {
      name: 'RecordsPerPage',
      type: 'select',
      useComponentProps() {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const field = useField();
        const { dn } = useDesignable();

        return {
          title: t('Records per page'),
          value: field.decoratorProps?.params?.pageSize || 20,
          options: [
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
            { label: '80', value: 80 },
            { label: '100', value: 100 },
          ],
          onChange: (pageSize) => {
            _.set(fieldSchema, 'x-decorator-props.params.pageSize', pageSize);
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params, page: 1 };
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': fieldSchema['x-decorator-props'],
              },
            });
          },
        };
      },
    },
    {
      name: 'ConvertReferenceToDuplicate',
      Component: SchemaSettingsTemplate,
      useComponentProps() {
        const { name } = useCollection_deprecated();
        const fieldSchema = useFieldSchema();
        const defaultResource =
          fieldSchema?.['x-decorator-props']?.resource || fieldSchema?.['x-decorator-props']?.association;

        return {
          componentName: 'List',
          collectionName: name,
          resourceName: defaultResource,
        };
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'delete',
      type: 'remove',
      useComponentProps() {
        return {
          removeParentsIfNoChildren: true,
          breakRemoveOn: {
            'x-component': 'Grid',
          },
        };
      },
    },
  ],
});

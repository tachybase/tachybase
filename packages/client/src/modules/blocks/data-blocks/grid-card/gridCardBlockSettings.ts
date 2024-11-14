import { useMemo } from 'react';
import { ArrayItems } from '@tachybase/components';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useFormBlockContext } from '../../../../block-provider';
import { useCollection_deprecated, useCollectionFieldsOptions, useSortFields } from '../../../../collection-manager';
import { useCollection, useDataSource } from '../../../../data-source';
import { removeNullCondition, useDesignable } from '../../../../schema-component';
import {
  defaultColumnCount,
  gridSizes,
  pageSizeOptions,
  screenSizeMaps,
  screenSizeTitleMaps,
} from '../../../../schema-component/antd/grid-card/options';
import { SchemaSettingsTemplate } from '../../../../schema-settings';
import { SchemaSettingsDataScope } from '../../../../schema-settings/SchemaSettingsDataScope';
import { setDataLoadingModeSettingsItem } from '../details-multi/setDataLoadingModeSettingsItem';
import { columnCountMarks } from './utils';

export const gridCardBlockSettings = new SchemaSettings({
  name: 'blockSettings:gridCard',
  items: [
    {
      name: 'SetTheCountOfColumnsDisplayedInARow',
      type: 'modal',
      useComponentProps() {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const field = useField();
        const { dn } = useDesignable();
        const columnCount = field.decoratorProps.columnCount || defaultColumnCount;

        const columnCountSchema = useMemo(() => {
          return {
            'x-component': 'Slider',
            'x-decorator': 'FormItem',
            'x-component-props': {
              min: 1,
              max: 24,
              marks: columnCountMarks,
              tooltip: {
                formatter: (value) => `${value}${t('Column')}`,
              },
              step: null,
            },
          };
        }, [t]);

        const columnCountProperties = useMemo(() => {
          return gridSizes.reduce((o, k) => {
            o[k] = {
              ...columnCountSchema,
              title: t(screenSizeTitleMaps[k]),
              description: `${t('Screen size')} ${screenSizeMaps[k]} ${t('pixels')}`,
            };
            return o;
          }, {});
        }, [columnCountSchema, t]);

        return {
          title: t('Set the count of columns displayed in a row'),
          initialValues: columnCount,
          schema: {
            type: 'object',
            title: t('Set the count of columns displayed in a row'),
            properties: columnCountProperties,
          } as ISchema,

          onSubmit: (columnCount) => {
            _.set(fieldSchema, 'x-decorator-props.columnCount', columnCount);
            field.decoratorProps.columnCount = columnCount;
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
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params };
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
                          required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            style: {
                              width: 260,
                            },
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
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params };
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
    setDataLoadingModeSettingsItem,
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
          options: pageSizeOptions.map((v) => ({ value: v })),
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
      name: 'LayoutDirection',
      type: 'select',
      useComponentProps() {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const field = useField();
        const { dn } = useDesignable();
        return {
          title: t('Layout Direction'),
          value: field.decoratorProps?.layoutDirection || 'column',
          options: [{ value: 'row' }, { value: 'column' }],
          onChange: (layoutDirection) => {
            _.set(fieldSchema, 'x-decorator-props.layoutDirection', layoutDirection);
            _.set(field, 'decoratorProps.layoutDirection', layoutDirection);

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
      name: 'setLinkable',
      type: 'switch',
      useComponentProps() {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const field = useField();
        const { dn } = useDesignable();
        return {
          title: t('Set Linkable'),
          checked: fieldSchema['x-decorator-props']?.['isLinkable'] ?? false,
          onChange: (isLinkable) => {
            _.set(fieldSchema, 'x-decorator-props.isLinkable', isLinkable);
            field.decoratorProps.isLinkable = isLinkable;
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': fieldSchema['x-decorator-props'],
              },
            });
          },
        };
      },
      useVisible() {
        const fieldSchema = useFieldSchema();
        return fieldSchema['x-decorator-props']?.['linkConfig']?.['link'];
      },
    },
    {
      name: 'setInfiniteScroll',
      type: 'switch',
      useComponentProps() {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const field = useField();
        const { dn } = useDesignable();
        return {
          title: t('Set InfiniteScroll'),
          checked: fieldSchema['x-decorator-props']?.['needInfiniteScroll'],
          onChange: (needInfiniteScroll) => {
            _.set(fieldSchema, 'x-decorator-props.needInfiniteScroll', needInfiniteScroll);
            field.decoratorProps.needInfiniteScroll = needInfiniteScroll;
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
      name: 'setLinkConfig',
      type: 'modal',
      useComponentProps() {
        const { t } = useTranslation();
        const collection = useCollection();
        const fieldSchema = useFieldSchema();
        const fields = useSortFields(fieldSchema['x-decorator-props']?.['collection'] || collection.name);
        const { dn } = useDesignable();
        const dataSource = useDataSource();
        return {
          title: t('Set LinkConfig'),
          schema: {
            type: 'object',
            title: 'Set LinkConfig',
            properties: {
              link: {
                type: 'string',
                title: t('Link'),
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                default: fieldSchema['x-decorator-props']?.['linkConfig']?.['link'] || '',
              },
              fields: {
                type: 'object',
                title: t('Field'),
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: fields,
                default: fieldSchema['x-decorator-props']?.['linkConfig']?.['fields'] || null,
                'x-component-props': {
                  multiple: true,
                },
              },
            },
          },
          onSubmit: (value) => {
            fieldSchema['x-decorator-props']['linkConfig'] = {
              ...fieldSchema['x-decorator-props']?.['linkConfig'],
              link: value.link,
              fields: value.fields,
              linkDataSource: dataSource.key,
              linkCollection: collection.name,
            };
            dn.emit('patch', {
              schema: { 'x-uid': fieldSchema['x-uid'], 'x-decorator-props': fieldSchema['x-decorator-props'] },
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
          componentName: 'GridCard',
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

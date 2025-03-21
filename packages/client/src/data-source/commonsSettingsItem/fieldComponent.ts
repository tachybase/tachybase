import { Field, useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import type { SchemaSettingsItemType } from '../../application';
import { useColumnSchema, useCompile, useDesignable } from '../../schema-component';
import { useCollectionField } from '../collection-field/CollectionFieldProvider';
import { useDataSourceManager } from '../data-source/DataSourceManagerProvider';

export const fieldComponentSettingsItem: SchemaSettingsItemType = {
  name: 'fieldComponent',
  type: 'select',
  useVisible() {
    const collectionField = useCollectionField();
    const dm = useDataSourceManager();
    if (!collectionField) return false;
    const collectionInterface = dm.collectionFieldInterfaceManager.getFieldInterface(collectionField?.interface) as any;
    return (
      Array.isArray(collectionInterface?.componentOptions) &&
      collectionInterface.componentOptions.length > 1 &&
      collectionInterface.componentOptions.filter((item) => !item.useVisible || item.useVisible()).length > 1
    );
  },
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField<Field>();
    const schema = useFieldSchema();
    const collectionField = useCollectionField();
    const dm = useDataSourceManager();
    const collectionInterface = dm.collectionFieldInterfaceManager.getFieldInterface(collectionField?.interface);
    const { fieldSchema: tableColumnSchema } = useColumnSchema();
    const fieldSchema = tableColumnSchema || schema;
    const { dn } = useDesignable();
    const compile = useCompile();
    const options =
      collectionInterface?.componentOptions
        ?.filter((item) => !item.useVisible || item.useVisible())
        ?.map((item) => {
          return {
            label: compile(item.label),
            value: item.value,
            useProps: item.useProps,
          };
        }) || [];
    return {
      title: t('Field component'),
      options,
      value: fieldSchema['x-component-props']?.['component'] || options[0]?.value,
      onChange(component) {
        const componentOptions = options.find((item) => item.value === component);
        const componentProps = {
          component,
          ...(componentOptions?.useProps?.() || {}),
        };
        field.componentProps = componentProps;
        field.component = component;
        _.set(fieldSchema, 'x-component-props', componentProps);
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': componentProps,
          },
        });
        dn.refresh();
      },
    };
  },
};

import { ISchema } from '@tachybase/schema';

import { TFunction } from 'i18next';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { SchemaSettingsItemType } from '../../application';
import { useColumnSchema, useCompile, useDesignable } from '../../schema-component';
import { getNewSchema, useHookDefault, useSchemaByType } from './util';

export interface CreateModalSchemaSettingsItemProps {
  name: string;
  title: string | ((t: TFunction<'translation', undefined>) => string);
  parentSchemaKey?: string;
  defaultValue?: any;
  useDefaultValue?: () => any;
  schema: (defaultValue: any) => ISchema;
  valueKeys?: string[];
  useVisible?: () => boolean;
  width?: number | string;
  useSubmit?: () => (values: any) => void;
  /**
   * @default 'common'
   */
  type?: 'common' | 'field';
}

/**
 * create `switch` type schema settings item
 *
 * @internal
 * @unstable
 */
export function createModalSettingsItem(options: CreateModalSchemaSettingsItemProps): SchemaSettingsItemType {
  const {
    name,
    parentSchemaKey,
    valueKeys,
    schema,
    title,
    useSubmit = useHookDefault,
    useVisible,
    defaultValue: propsDefaultValue,
    useDefaultValue = useHookDefault,
    width,
    type = 'common',
  } = options;
  return {
    name,
    type: 'actionModal',
    useVisible,
    useComponentProps() {
      const fieldSchema = useSchemaByType(type);
      const { dn } = useDesignable();
      const defaultValue = useDefaultValue(propsDefaultValue);
      const values = parentSchemaKey ? _.get(fieldSchema, parentSchemaKey) : undefined;
      const compile = useCompile();
      const { t } = useTranslation();
      const onSubmit = useSubmit();
      const { fieldSchema: tableColumnSchema } = useColumnSchema() || {};

      return {
        title: typeof title === 'function' ? title(t) : compile(title),
        width,
        schema: schema({ ...defaultValue, ...values }),
        onSubmit(values) {
          const newSchema = getNewSchema({ fieldSchema, parentSchemaKey: parentSchemaKey, value: values, valueKeys });
          if (tableColumnSchema) {
            dn.emit('patch', {
              schema: newSchema,
            });
            dn.refresh();
          } else {
            dn.deepMerge(newSchema);
          }
          return onSubmit?.(values);
        },
      };
    },
  };
}

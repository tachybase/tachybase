import { TFunction } from 'i18next';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { SchemaSettingsItemType } from '../../application';
import { useColumnSchema, useCompile, useDesignable } from '../../schema-component';
import { getNewSchema, useHookDefault, useSchemaByType } from './util';

export interface CreateSwitchSchemaSettingsItemProps {
  name: string;
  title: string | ((t: TFunction<'translation', undefined>) => string);
  schemaKey: string;
  defaultValue?: boolean;
  useDefaultValue?: () => boolean;
  useVisible?: () => boolean;
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
export function createSwitchSettingsItem(options: CreateSwitchSchemaSettingsItemProps): SchemaSettingsItemType {
  const {
    name,
    useVisible,
    schemaKey,
    title,
    type = 'common',
    defaultValue: propsDefaultValue,
    useDefaultValue = useHookDefault,
  } = options;
  return {
    name,
    useVisible,
    type: 'switch',
    useComponentProps() {
      const fieldSchema = useSchemaByType(type);
      const { dn } = useDesignable();
      const defaultValue = useDefaultValue(propsDefaultValue);
      const compile = useCompile();
      const { t } = useTranslation();
      const { fieldSchema: tableColumnSchema } = useColumnSchema() || {};

      return {
        title: typeof title === 'function' ? title(t) : compile(title),
        checked: !!_.get(fieldSchema, schemaKey, defaultValue),
        onChange(v) {
          const newSchema = getNewSchema({ fieldSchema, schemaKey, value: v });
          if (tableColumnSchema) {
            dn.emit('patch', {
              schema: newSchema,
            });
            dn.refresh();
          } else {
            dn.deepMerge(newSchema);
          }
        },
      };
    },
  };
}

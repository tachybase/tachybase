import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { SchemaSettingsItemType } from '../../application';
import { useCompile } from '../../schema-component';
import { useHookDefault } from './util';

export interface CreateTextSchemaSettingsItemProps {
  name: string;
  useVisible?: () => boolean;
  title: string | ((t: TFunction<'translation', undefined>) => string);
  useTextClick: () => void;
}

export function createTextSettingsItem(options: CreateTextSchemaSettingsItemProps): SchemaSettingsItemType {
  const { name, useVisible, title, useTextClick = useHookDefault } = options;
  return {
    name,
    type: 'item',
    useVisible,
    useComponentProps() {
      const compile = useCompile();
      const { t } = useTranslation();
      const onClick = useTextClick();
      return {
        title: typeof title === 'function' ? title(t) : compile(title),
        onClick,
      };
    },
  };
}

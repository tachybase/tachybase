import React from 'react';
import { useField } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import {
  GeneralSchemaDesigner,
  SchemaSettingsDivider,
  SchemaSettingsItem,
  SchemaSettingsRemove,
} from '../../../schema-settings';

export const MarkdownVoidDesigner = () => {
  const field = useField();
  const { t } = useTranslation();
  return (
    <GeneralSchemaDesigner>
      <SchemaSettingsItem
        title={t('Edit markdown')}
        onClick={() => {
          field.editable = true;
        }}
      />
      <SchemaSettingsDivider />
      <SchemaSettingsRemove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};

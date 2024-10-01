import React from 'react';
import { SchemaComponent, Space } from '@tachybase/client';

import { useTranslation } from '../../../locale';
import { schemaDataSourceSettingsForm as schema } from './DataSourceSettingsForm.schema';

export const DataSourceSettingsForm = () => {
  const { t } = useTranslation();
  return <SchemaComponent schema={schema} components={{ Space }} scope={{ t }} />;
};

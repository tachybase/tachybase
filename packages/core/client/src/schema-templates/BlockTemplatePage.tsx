import React from 'react';

import { PageHeader as AntdPageHeader } from '@ant-design/pro-layout';
import { useTranslation } from 'react-i18next';

import { SchemaComponent } from '../schema-component';
import { uiSchemaTemplatesSchema } from './schemas/uiSchemaTemplates';

export const BlockTemplatePage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <AntdPageHeader style={{ backgroundColor: 'white' }} ghost={false} title={t('Block templates')} />
      <div style={{ margin: 'var(--tb-spacing)' }}>
        <SchemaComponent schema={uiSchemaTemplatesSchema} />
      </div>
    </div>
  );
};

export const BlockTemplatesPane = () => {
  return <SchemaComponent schema={uiSchemaTemplatesSchema} />;
};

import { SchemaInitializerChildren } from '@nocobase/client';
import { useFilterAssociatedFormItemInitializerFields } from './utils';
import { useTranslation } from 'react-i18next';
import React from 'react';
export const FilterAssociatedFields = () => {
  const associationFields = useFilterAssociatedFormItemInitializerFields();
  const { t } = useTranslation();
  const res: any[] = [
    {
      type: 'itemGroup',
      title: t('Display association fields'),
      children: associationFields,
    },
  ];
  return <SchemaInitializerChildren>{res}</SchemaInitializerChildren>;
};

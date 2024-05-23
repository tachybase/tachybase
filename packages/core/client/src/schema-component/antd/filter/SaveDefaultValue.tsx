import React from 'react';
import { useFieldSchema, useForm } from '@tachybase/schema';

import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { useDesignable } from '../../hooks';

export const SaveDefaultValue = (props) => {
  const { t } = useTranslation();
  const { designable, dn, refresh } = useDesignable();
  const fieldSchema = useFieldSchema();
  const form = useForm();
  if (!designable) {
    return null;
  }
  return (
    <Button
      style={{
        borderColor: 'var(--colorSettings)',
        color: 'var(--colorSettings)',
      }}
      type={'dashed'}
      onClick={() => {
        const filterSchema = fieldSchema?.parent?.parent?.parent?.properties?.filter;
        if (!filterSchema) {
          return;
        }
        const defaultValue = form.values.filter;
        dn.emit('patch', {
          schema: {
            'x-uid': filterSchema['x-uid'],
            default: defaultValue,
          },
        });
        dn.refresh();
        filterSchema.default = defaultValue;
      }}
    >
      {t('Save conditions')}
    </Button>
  );
};

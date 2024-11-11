import React from 'react';
import { Cron, FormProvider, SchemaComponent } from '@tachybase/client';
import { FormItem } from '@tachybase/components';

import { useTranslation } from 'react-i18next';

const schema = {
  type: 'object',
  properties: {
    cron: {
      type: 'string',
      title: 'Cron',
      'x-decorator': 'FormItem',
      'x-component': 'Cron',
    },
  },
};

export default () => {
  const { t } = useTranslation();

  return (
    <FormProvider>
      <SchemaComponent components={{ Cron, FormItem }} scope={{ t }} schema={schema} />
    </FormProvider>
  );
};

import React from 'react';
import { Variable } from '@tachybase/client';

import { useTranslation } from '../locale';

export const CustomResponseTemplate: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const { t } = useTranslation();
  const { value, onChange } = props;
  const variableOptions = [
    {
      value: 'res.data',
      label: t('Response body'),
    },
  ];

  return (
    <Variable.CodeMirror
      value={value}
      onChange={onChange}
      scope={variableOptions}
      fieldNames={{
        value: 'value',
        label: 'value',
      }}
    />
  );
};

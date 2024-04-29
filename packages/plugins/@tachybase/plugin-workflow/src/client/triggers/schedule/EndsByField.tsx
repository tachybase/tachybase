import { css } from '@nocobase/client';
import { DatePicker, Select } from 'antd';
import { dayjs } from '@nocobase/utils/client';
import React from 'react';
import { useWorkflowTranslation } from '../../locale';
import { OnField } from './OnField';

export function EndsByField({ value, onChange }) {
  const { t } = useWorkflowTranslation();
  const type = value != null ? (typeof value === 'object' && !(value instanceof Date) ? 'field' : 'date') : null;
  return (
    <fieldset
      className={css`
        display: flex;
        gap: 0.5em;
      `}
    >
      <Select
        value={type}
        onChange={(t) => {
          onChange(t ? (t === 'field' ? {} : new Date()) : null);
        }}
        className="auto-width"
      >
        <Select.Option value={null}>{t('No end')}</Select.Option>
        <Select.Option value={'field'}>{t('By field')}</Select.Option>
        <Select.Option value={'date'}>{t('By custom date')}</Select.Option>
      </Select>
      {type === 'field' ? <OnField value={value} onChange={onChange} /> : null}
      {type === 'date' ? (
        <DatePicker
          showTime
          value={dayjs(value)}
          onChange={(v) => {
            onChange(v ? v.toDate() : null);
          }}
        />
      ) : null}
    </fieldset>
  );
}

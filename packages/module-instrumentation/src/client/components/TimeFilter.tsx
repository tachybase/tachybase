import { css } from '@tachybase/client';

import { Checkbox, DatePicker, InputNumber } from 'antd';
import dayjs from 'dayjs';

import { useTranslation } from '../locale';

export function timeFilter({ value, onChange }) {
  return <TimeFilterGroup value={value} onChange={onChange} />;
}

function TimeFilterGroup({ value, onChange }) {
  const { t } = useTranslation();

  const { after, before, on, rangeDays, today } = value;

  const getActiveField = () => {
    if (after || before) return 'range';
    if (on) return 'on';
    if (rangeDays != null) return 'rangeDays';
    if (today) return 'today';
    return null;
  };

  const active = getActiveField();

  const updateField = (field: string, val: any) => {
    const newValue = {
      ...value,
      [field]: val,
    };

    if (field === 'after' || field === 'before') {
      delete newValue.on;
      delete newValue.rangeDays;
      delete newValue.today;
    } else {
      delete newValue.after;
      delete newValue.before;

      if (field !== 'on') delete newValue.on;
      if (field !== 'rangeDays') delete newValue.rangeDays;
      if (field !== 'today') delete newValue.today;
    }

    onChange?.(newValue);
  };

  const rowStyle = css`
    display: flex;
    align-items: center;
    gap: 0.5em;
    width: 100%;
  `;

  const labelStyle = css`
    min-width: 50px;
    flex-shrink: 0;
  `;

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 100%;
      `}
    >
      {(!active || active === 'range') && (
        <div
          className={css`
            display: flex;
            gap: 0.5em;
            width: 100%;
          `}
        >
          <div className={rowStyle} style={{ flex: 1 }}>
            <span className={labelStyle}>{t('After')}:</span>
            <DatePicker
              style={{ flex: 1 }}
              value={after ? dayjs(after) : null}
              onChange={(d) => updateField('after', d ? d.toISOString() : undefined)}
            />
          </div>
          <div className={rowStyle} style={{ flex: 1 }}>
            <span className={labelStyle}>{t('Before')}:</span>
            <DatePicker
              style={{ flex: 1 }}
              value={before ? dayjs(before) : null}
              onChange={(d) => updateField('before', d ? d.toISOString() : undefined)}
            />
          </div>
        </div>
      )}

      {(!active || active === 'on') && (
        <div className={rowStyle}>
          <span className={labelStyle}>{t('On')}:</span>
          <DatePicker
            style={{ flex: 1 }}
            value={on ? dayjs(on) : null}
            onChange={(d) => updateField('on', d ? d.toISOString() : undefined)}
          />
        </div>
      )}

      {(!active || active === 'rangeDays') && (
        <div className={rowStyle}>
          <span className={labelStyle}>{t('RangeDays')}:</span>
          <InputNumber
            style={{ flex: 1 }}
            value={rangeDays}
            onChange={(v) => updateField('rangeDays', v ?? undefined)}
            precision={0}
            step={1}
            min={1}
          />
        </div>
      )}

      {(!active || active === 'today') && (
        <div className={rowStyle}>
          <span className={labelStyle}>{t('On today')}:</span>
          <Checkbox checked={!!today} onChange={(e) => updateField('today', e.target.checked ? true : undefined)} />
        </div>
      )}
    </div>
  );
}

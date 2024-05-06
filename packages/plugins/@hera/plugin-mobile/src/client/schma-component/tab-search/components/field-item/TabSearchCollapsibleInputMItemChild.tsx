import React, { useState } from 'react';
import { useTranslation } from '../../../../locale';
import { Grid, Divider, Picker, Input, Space, ActionSheet, DatePicker, CalendarPicker } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import type { Action } from 'antd-mobile/es/components/action-sheet';
import { changFormat, convertFormat } from '../../utils';
import { dayjs } from '@nocobase/utils/client';

export const ISelect = (props) => {
  const { options, onChange, customLabelKey } = props;
  const actions: Action[] = options.map((item) => {
    return {
      text: item.label,
      key: item.value,
    };
  });
  const [visible, setVisible] = useState(false);
  return options.length > 1 ? (
    <Grid.Item
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      onClick={() => {
        setVisible(true);
      }}
    >
      <span style={{ textAlign: 'center', width: '100%' }}>
        {options.find((option) => option.value === customLabelKey).label}
      </span>
      <DownOutline />
      {options.length <= 5 ? (
        <ActionSheet
          visible={visible}
          actions={actions}
          closeOnAction
          onClose={() => setVisible(false)}
          onAction={(v) => {
            onChange(v.key);
          }}
        />
      ) : (
        <Picker
          columns={[options]}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          defaultValue={customLabelKey}
          onConfirm={(v) => {
            onChange(v[0]);
          }}
        />
      )}

      <Divider direction="vertical" style={{ height: '70%', margin: '0 0 0 5px' }} />
    </Grid.Item>
  ) : null;
};

export const IDatePicker = (props) => {
  const { options, value, onChange, onInputChange } = props;
  const time = value.split('&');
  const [visible, setVisible] = useState(false);
  return (
    <Grid.Item span={options.length > 1 ? 3 : 4}>
      <div
        onClick={() => {
          setVisible(true);
        }}
      >
        <Grid columns={5}>
          <Grid.Item span={2} style={{ textAlign: 'end' }}>
            {convertFormat(JSON.parse(time[0]))}
          </Grid.Item>
          <Grid.Item span={1} style={{ textAlign: 'center' }}>
            -
          </Grid.Item>
          <Grid.Item span={2} style={{ textAlign: 'start' }}>
            {convertFormat(JSON.parse(time[1]))}
          </Grid.Item>
        </Grid>
      </div>
      <CalendarPicker
        visible={visible}
        selectionMode="range"
        onMaskClick={() => setVisible(false)}
        onClose={() => setVisible(false)}
        onConfirm={([start, end]) => {
          const startTime = dayjs(start).startOf('date').toISOString();
          const endTime = dayjs(end).endOf('date').toISOString();

          // TODO: 此处受上游影响,格式必须确定为这样, 时间有限,不再往上追查
          const timeString = `"${startTime}"&"${endTime}"`;

          onInputChange(timeString);
          onChange(timeString);
        }}
      />
    </Grid.Item>
  );
};

export const IInput = (props) => {
  const { options, value, onChange } = props;
  const { t } = useTranslation();
  return (
    <Grid.Item style={{ flex: 1 }} span={options.length > 1 ? 2 : 3}>
      <Input
        placeholder={t('Please enter search content')}
        value={value}
        onChange={onChange}
        style={{ '--font-size': '12px', marginLeft: '5px' }}
      />
    </Grid.Item>
  );
};

export const IButton = (props) => {
  const { onClick } = props;
  const { t } = useTranslation();
  return (
    <Grid.Item onClick={onClick} style={{ color: '#2c6eff', textAlign: 'center', cursor: 'pointer' }}>
      {t('Search')}
    </Grid.Item>
  );
};

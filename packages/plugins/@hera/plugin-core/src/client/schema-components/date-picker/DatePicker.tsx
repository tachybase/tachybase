import { connect, mapProps, mapReadPretty } from '@formily/react';
import { DatePicker as AntdDatePicker } from 'antd';
import type {
  DatePickerProps as AntdDatePickerProps,
  RangePickerProps as AntdRangePickerProps,
} from 'antd/es/date-picker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReadPretty } from './ReadPretty';
import { getDateRanges, mapDatePicker, mapRangePicker } from './util';
import dayjs from 'dayjs';

interface IDatePickerProps {
  utc?: boolean;
}

type ComposedDatePicker = React.FC<AntdDatePickerProps> & {
  ReadPretty?: React.FC<AntdDatePickerProps>;
  RangePicker?: React.FC<AntdRangePickerProps>;
};

const DatePickerContext = React.createContext<IDatePickerProps>({ utc: true });

export const useDatePickerContext = () => React.useContext(DatePickerContext);
export const DatePickerProvider = DatePickerContext.Provider;

const InternalDatePicker: ComposedDatePicker = connect(
  AntdDatePicker,
  mapProps(mapDatePicker()),
  mapReadPretty(ReadPretty.DatePicker),
);

const InternalRangePicker = connect(
  AntdDatePicker.RangePicker,
  mapProps(mapRangePicker()),
  mapReadPretty(ReadPretty.DateRangePicker),
);

export const DatePicker = (props) => {
  const { utc = true } = useDatePickerContext();
  const value = Array.isArray(props.value) ? props.value[0] : props.value;
  props = { utc, ...props };
  return <InternalDatePicker {...props} value={value} />;
};

DatePicker.ReadPretty = ReadPretty.DatePicker;

DatePicker.RangePicker = function RangePicker(props) {
  const { t } = useTranslation();
  const { utc = true } = useDatePickerContext();
  const rangesValue = getDateRanges();
  const presets = [
    { label: t('This year'), value: rangesValue.thisYear },
    ...Array(5)
      .fill(0)
      .map((_, i) => ({ label: dayjs().year() - i - 1 + '年', value: rangesValue.year(dayjs().year() - i - 1) })),
    { label: t('This month'), value: rangesValue.thisMonth },
    { label: t('Last month'), value: rangesValue.lastMonth },
  ];
  props = { utc, presets, ...props };
  return <InternalRangePicker {...props} />;
};

export default DatePicker;

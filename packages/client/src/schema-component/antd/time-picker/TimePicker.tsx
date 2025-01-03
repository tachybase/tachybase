import { dayjsable, formatDayjsValue } from '@tachybase/components';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { TimePicker as AntdTimePicker } from 'antd';
import { TimePickerProps as AntdTimePickerProps, TimeRangePickerProps } from 'antd/es/time-picker';
import dayjs from 'dayjs';

import { ReadPretty } from './ReadPretty';

type ComposedTimePicker = React.FC<AntdTimePickerProps> & {
  RangePicker?: React.FC<TimeRangePickerProps>;
};

const mapTimeFormat = function () {
  return (props: any, field) => {
    const format = props['format'] || 'HH:mm:ss';
    const onChange = props.onChange;
    return {
      ...props,
      format,
      value: dayjsable(props.value, format),
      onChange: (value: dayjs.Dayjs | dayjs.Dayjs[]) => {
        if (onChange) {
          onChange(formatDayjsValue(value, format) || null);
        }
      },
    };
  };
};

// @ts-ignore
export const TimePicker: ComposedTimePicker = connect(
  AntdTimePicker,
  mapProps(mapTimeFormat()),
  mapReadPretty(ReadPretty),
);

TimePicker.RangePicker = connect(AntdTimePicker.RangePicker, mapProps(mapTimeFormat()), mapReadPretty(ReadPretty));

export default TimePicker;

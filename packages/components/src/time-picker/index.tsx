import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { TimePicker as AntdTimePicker, TimePickerProps as AntdTimePickerProps, TimeRangePickerProps } from 'antd';
import dayjs from 'dayjs';

import { dayjsable, formatDayjsValue } from '../__builtins__';
import { PreviewText } from '../preview-text';

type ComposedTimePicker = React.FC<React.PropsWithChildren<AntdTimePickerProps>> & {
  RangePicker?: React.FC<React.PropsWithChildren<TimeRangePickerProps>>;
};

const mapTimeFormat = function () {
  return (props: any) => {
    const format = props['format'] || 'HH:mm:ss';
    const onChange = props.onChange;
    return {
      ...props,
      format,
      value: dayjsable(props.value, format),
      onChange: (value: dayjs.Dayjs | dayjs.Dayjs[]) => {
        if (onChange) {
          onChange(formatDayjsValue(value, format));
        }
      },
    };
  };
};

// @ts-ignore
const InternalTimePicker: ComposedTimePicker = connect(
  AntdTimePicker,
  mapProps(mapTimeFormat()),
  mapReadPretty(PreviewText.TimePicker),
);

const RangePicker = connect(
  AntdTimePicker.RangePicker,
  mapProps(mapTimeFormat()),
  mapReadPretty(PreviewText.TimeRangePicker),
);

export const TimePicker = Object.assign(InternalTimePicker, { RangePicker });

export default TimePicker;

// FOR: https://github.com/ant-design/antd-moment-webpack-plugin
import { isArr, isFn, isEmpty } from '@formily/shared';
import moment, { MomentInput, Moment } from 'moment';

export function dayjsable(value: MomentInput, format?: string): Moment;
export function dayjsable(value: MomentInput[], format?: string): Moment[];

export function dayjsable(value: MomentInput | MomentInput[], format?: string): any {
  if (!value) return value;
  if (Array.isArray(value)) {
    return value.map((val) => {
      const date = moment(val, format);
      if (date.isValid()) return date;
      const _date = moment(val);
      return _date.isValid() ? _date : val;
    });
  } else {
    const date = moment(value, format);
    if (date.isValid()) return date;
    const _date = moment(value);
    return _date.isValid() ? _date : value;
  }
}

export const formatDayjsValue = (value: any, format: any, placeholder?: string): string | string[] => {
  const validFormatDate = (date: any, format: any) => {
    if (typeof date === 'number') {
      return moment(date).format(format);
    }
    const _date = moment(date, format);
    return _date.isValid() ? _date.format(format) : date;
  };

  const formatDate = (date: any, format: any, i = 0) => {
    if (!date) return placeholder;
    if (isArr(format)) {
      const _format = format[i];
      if (isFn(_format)) {
        return _format(date);
      }
      if (isEmpty(_format)) {
        return date;
      }
      return validFormatDate(date, _format);
    } else {
      if (isFn(format)) {
        return format(date);
      }
      if (isEmpty(format)) {
        return date;
      }
      return validFormatDate(date, format);
    }
  };
  if (isArr(value)) {
    return value.map((val, index) => {
      return formatDate(val, format, index);
    });
  } else {
    return value ? formatDate(value, format) : value || placeholder;
  }
};

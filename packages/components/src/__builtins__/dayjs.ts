import { isArr, isEmpty, isFn } from '@formily/shared';
import dayjs, { ConfigType, Dayjs } from 'dayjs';

export function dayjsable(value: ConfigType, format?: string): Dayjs;
export function dayjsable(value: ConfigType[], format?: string): Dayjs[];

export function dayjsable(value: ConfigType | ConfigType[], format?: string): any {
  if (!value) return value;
  if (Array.isArray(value)) {
    return value.map((val) => {
      const date = dayjs(val, format);
      if (date.isValid()) return date;
      const _date = dayjs(val);
      return _date.isValid() ? _date : val;
    });
  } else {
    const date = dayjs(value, format);
    if (date.isValid()) return date;
    const _date = dayjs(value);
    return _date.isValid() ? _date : value;
  }
}

export const formatDayjsValue = (value: any, format: any, placeholder?: string): string | string[] => {
  const validFormatDate = (date: any, format: any) => {
    if (typeof date === 'number') {
      return dayjs(date).format(format);
    }
    const _date = dayjs(date, format);
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

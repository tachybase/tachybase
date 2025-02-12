import { CollectionFieldInterface, i18n } from '@tachybase/client';
import { dayjs } from '@tachybase/utils/client';

import { DatePicker, type DatePickerProps } from 'antd';

// 定义日期选择器类型
const DATE_PICKER_TYPES = {
  date: {
    component: DatePicker,
    format: 'YYYY-MM-DD',
    // operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'null', 'notNull']
  },
  month: {
    component: DatePicker,
    format: 'YYYY-MM',
    // operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'null', 'notNull']
  },
  quarter: {
    component: DatePicker,
    format: 'YYYY-[Q]Q',
    // operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'null', 'notNull']
  },
  year: {
    component: DatePicker,
    format: 'YYYY',
    // operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'null', 'notNull']
  },
} as const;

type DatePickerType = keyof typeof DATE_PICKER_TYPES;

interface DateFieldOptions {
  showTime?: boolean;
  gmt?: boolean;
  picker?: DatePickerType;
  utc?: boolean;
  timezone?: string;
}

// 日期选择器组件
const DatePickerComponent = ({
  value,
  onChange,
  format,
  showTime,
  picker = 'date',
  ...props
}: DatePickerProps & DateFieldOptions) => {
  return (
    <DatePicker
      {...props}
      value={value ? dayjs(value) : null}
      onChange={onChange}
      format={format || DATE_PICKER_TYPES[picker].format}
      picker={picker}
      showTime={showTime}
    />
  );
};

export class DateOnlyFieldInterface extends CollectionFieldInterface {
  name = 'date-only';
  type = 'object';
  title = i18n.t('Date only');
  default = {
    type: 'date-only',
    // 默认UI组件配置
    uiSchema: {
      type: 'string',
      'x-component': 'DatePicker',
      'x-component-props': {
        format: 'YYYY-MM-DD',
        picker: 'date',
        utc: true,
        showTime: false,
        gmt: false,
      },
    },
  };
  properties = {
    // 日期选择器类型
    picker: {
      type: 'string',
      title: i18n.t('Picker type'),
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      default: 'date',
      enum: [
        { label: i18n.t('Date'), value: 'date' },
        { label: i18n.t('Month'), value: 'month' },
        { label: i18n.t('Quarter'), value: 'quarter' },
        { label: i18n.t('Year'), value: 'year' },
      ],
    },
    // 显示时间选择
    showTime: {
      type: 'boolean',
      title: i18n.t('Show time picker'),
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-reactions': {
        dependencies: ['picker'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "date"}}',
          },
        },
      },
    },
    // // UTC 时间
    // utc: {
    //   type: 'boolean',
    //   title: i18n.t('Use UTC'),
    //   'x-component': 'Checkbox',
    //   'x-decorator': 'FormItem',
    //   default: true
    // },
    // // GMT 时间
    // gmt: {
    //   type: 'boolean',
    //   title: i18n.t('Use GMT'),
    //   'x-component': 'Checkbox',
    //   'x-decorator': 'FormItem'
    // },
    // // 时区设置
    // timezone: {
    //   type: 'string',
    //   title: i18n.t('Timezone'),
    //   'x-component': 'Select',
    //   'x-decorator': 'FormItem',
    //   enum: [
    //     { label: 'UTC', value: 'UTC' },
    //     { label: 'Local', value: 'Local' }
    //   ]
    // },
    // 日期格式
    format: {
      type: 'string',
      title: i18n.t('Date format'),
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-reactions': {
        dependencies: ['picker', 'showTime'],
        fulfill: {
          state: {
            value:
              '{{$deps[0] === "date" ? ($deps[1] ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD") : $deps[0] === "month" ? "YYYY-MM" : $deps[0] === "quarter" ? "YYYY-[Q]Q" : "YYYY"}}',
            dataSource:
              '{{$deps[0] === "date" ? ($deps[1] ? [{"label":"YYYY-MM-DD HH:mm:ss","value":"YYYY-MM-DD HH:mm:ss"},{"label":"MM/DD/YYYY HH:mm:ss","value":"MM/DD/YYYY HH:mm:ss"}] : [{"label":"YYYY-MM-DD","value":"YYYY-MM-DD"},{"label":"MM/DD/YYYY","value":"MM/DD/YYYY"},{"label":"DD/MM/YYYY","value":"DD/MM/YYYY"}]) : $deps[0] === "month" ? [{"label":"YYYY-MM","value":"YYYY-MM"},{"label":"MM/YYYY","value":"MM/YYYY"}] : $deps[0] === "quarter" ? [{"label":"YYYY-[Q]Q","value":"YYYY-[Q]Q"},{"label":"[Q]Q/YYYY","value":"[Q]Q/YYYY"}] : [{"label":"YYYY","value":"YYYY"}]}}',
          },
        },
      },
    },
  };
  component = DatePickerComponent;
  tableColumnProps = {
    render: (value: any, record: any, field: any) => {
      if (!value) return null;
      const { picker = 'date', format } = field?.uiSchema?.['x-component-props'] || {};
      return dayjs(value).format(format || DATE_PICKER_TYPES[picker as DatePickerType].format);
    },
  };
  // filterable = {
  //   operators: DATE_PICKER_TYPES.date.operators,
  //   component: DatePickerComponent,
  //   transformValue: (value: any, field: any) => {
  //     if (!value) return null;
  //     const { picker = 'date', format } = field?.uiSchema?.['x-component-props'] || {};
  //     return dayjs(value).format(format || DATE_PICKER_TYPES[picker as DatePickerType].format);
  //   }
  // };
  dataSource = {
    toForm(value) {
      return value ? dayjs(value) : null;
    },
    toStorage(value, field) {
      if (!value) return null;
      const { picker = 'date', format } = field?.uiSchema?.['x-component-props'] || {};
      return value.format(format || DATE_PICKER_TYPES[picker as DatePickerType].format);
    },
  };
}

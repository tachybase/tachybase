import { CollectionFieldInterface, defaultProps, i18n, useToken } from '@tachybase/client';
import { dayjs } from '@tachybase/utils/client';

import { css } from '@emotion/css';
import { DatePicker, type DatePickerProps } from 'antd';

const DateTimeFormatPreview = ({ content }) => {
  const { token } = useToken();
  return (
    <span
      style={{
        display: 'inline-block',
        background: token.colorBgTextHover,
        marginLeft: token.marginMD,
        lineHeight: '1',
        padding: token.paddingXXS,
        borderRadius: token.borderRadiusOuter,
      }}
    >
      {content}
    </span>
  );
};

const DateFormatCom = (props?) => {
  const date = dayjs();
  return (
    <div style={{ display: 'inline-flex' }}>
      <span>{props.format}</span>
      <DateTimeFormatPreview content={date.format(props.format)} />
    </div>
  );
};

// 定义日期选择器类型
const DATE_PICKER_TYPES = {
  date: {
    format: 'YYYY-MM-DD',
  },
  month: {
    format: 'YYYY-MM',
  },
  quarter: {
    format: 'YYYY-[Q]Q',
  },
  year: {
    format: 'YYYY',
  },
};

// 日期选择器组件
const DatePickerComponent = ({ value, onChange, format, showTime, picker = 'date', ...props }: DatePickerProps) => {
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
  name = 'dateOnly';
  type = 'object';
  title = i18n.t('DateOnly');
  sortable = true;
  group = 'datetime';
  default = {
    type: 'dateOnly',
    // 默认UI组件配置
    uiSchema: {
      type: 'string',
      'x-component': 'DatePicker',
      'x-component-props': {
        dateOnly: true,
      },
    },
  };
  availableTypes = ['dateOnly'];
  hasDefaultValue = true;
  properties = {
    ...defaultProps,
    'uiSchema.x-component-props.picker': {
      type: 'string',
      title: '{{t("Picker")}}',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      default: 'date',
      enum: [
        {
          label: '{{t("Date")}}',
          value: 'date',
        },
        // {
        //   label: '{{t("Week")}}',
        //   value: 'week',
        // },
        {
          label: '{{t("Month")}}',
          value: 'month',
        },
        {
          label: '{{t("Quarter")}}',
          value: 'quarter',
        },
        {
          label: '{{t("Year")}}',
          value: 'year',
        },
      ],
    },
    'uiSchema.x-component-props.dateFormat': {
      type: 'string',
      title: '{{t("Date format")}}',
      'x-decorator': 'FormItem',
      'x-component': 'ExpiresRadio',
      'x-decorator-props': {},
      'x-component-props': {
        className: css`
          .ant-radio-wrapper {
            display: flex;
            margin: 5px 0px;
          }
        `,
        defaultValue: 'dddd',
        formats: ['MMMM Do YYYY', 'YYYY-MM-DD', 'MM/DD/YY', 'YYYY/MM/DD', 'DD/MM/YYYY'],
      },
      default: 'YYYY-MM-DD',
      enum: [
        {
          label: DateFormatCom({ format: 'MMMM Do YYYY' }),
          value: 'MMMM Do YYYY',
        },
        {
          label: DateFormatCom({ format: 'YYYY-MM-DD' }),
          value: 'YYYY-MM-DD',
        },
        {
          label: DateFormatCom({ format: 'MM/DD/YY' }),
          value: 'MM/DD/YY',
        },
        {
          label: DateFormatCom({ format: 'YYYY/MM/DD' }),
          value: 'YYYY/MM/DD',
        },
        {
          label: DateFormatCom({ format: 'DD/MM/YYYY' }),
          value: 'DD/MM/YYYY',
        },
        {
          label: 'custom',
          value: 'custom',
        },
      ],
      'x-reactions': {
        dependencies: ['uiSchema.x-component-props.picker'],
        fulfill: {
          state: {
            value: `{{ getPickerFormat($deps[0]) }}`,
            componentProps: { picker: `{{$deps[0]}}` },
          },
        },
      },
    },
  };
  // component = DatePickerComponent;
  // tableColumnProps = {
  //   render: (value: any, record: any, field: any) => {
  //     if (!value) return null;
  //     const { picker = 'date', format } = field?.uiSchema?.['x-component-props'] || {};
  //     return dayjs(value).format(format || DATE_PICKER_TYPES[picker].format);
  //   },
  // };
  // filterable = {
  //   operators: DATE_PICKER_TYPES.date.operators,
  //   component: DatePickerComponent,
  //   transformValue: (value: any, field: any) => {
  //     if (!value) return null;
  //     const { picker = 'date', format } = field?.uiSchema?.['x-component-props'] || {};
  //     return dayjs(value).format(format || DATE_PICKER_TYPES[picker as DatePickerType].format);
  //   }
  // };
  titleUsable = true;
}

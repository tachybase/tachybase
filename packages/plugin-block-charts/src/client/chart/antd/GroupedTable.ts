import { uid } from '@tachybase/utils/client';

import { Table as AntdTable } from 'antd';

import { RenderProps } from '../chart';
import { AntdChart } from './antd';

export class GroupedTable extends AntdChart {
  constructor() {
    super({
      name: 'groupedTable',
      title: 'GroupedTable',
      Component: AntdTable,
      config: [
        {
          categoryField: {
            title: '{{t("Category Field")}}',
            type: 'array',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems',
            items: {
              type: 'void',
              'x-component': 'Space',
              properties: {
                sort: {
                  type: 'void',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayItems.SortHandle',
                },
                input: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-reactions': '{{ useChartFields }}',
                  'x-component-props': {
                    style: {
                      minWidth: '200px',
                    },
                  },
                  required: true,
                },
                remove: {
                  type: 'void',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayItems.Remove',
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                title: '{{t("Add")}}',
                'x-component': 'ArrayItems.Addition',
              },
            },
          },
        },
      ],
    });
  }

  getProps({ data, fieldProps, general, advanced, ctx }: RenderProps) {
    const { transform, config, service } = ctx;
    const categoryField = config?.general?.categoryField;
    const measures = service?.params.find((item) => typeof item === 'object')?.measures;
    const columns = data.length
      ? Object.keys(data[0]).map((item) => ({
          title: fieldProps[item]?.label || item,
          dataIndex: item,
          key: item,
          calculate: true,
        }))
      : [];
    data.forEach((item: any, index) => {
      Object.keys(item).forEach((key: string) => {
        const props = fieldProps[key];
        if (props?.interface === 'percent') {
          const value = Math.round(parseFloat(item[key]) * 100).toFixed(2);
          item[key] = `${value}%`;
        }
        if (typeof item[key] === 'boolean') {
          item[key] = item[key].toString();
        }
        if (props?.transformer) {
          item[key] = props.transformer(item[key]);
        }
      });
    });
    const dataSource = buildTree(data, categoryField);
    categoryField.forEach((item) => countDataSource(dataSource, measures, transform));
    return {
      bordered: true,
      size: 'middle',
      pagination: false,
      dataSource,
      columns,
      scroll: {
        x: 'max-content',
      },
      rowKey: (record) => record.key,
      ...general,
      ...advanced,
      expandRowByClick: true,
    };
  }
}

const buildTree = (data, fields) => {
  const recursiveBuild = (data, fieldIndex) => {
    if (fieldIndex >= fields.length) {
      return data.map((item) => ({ key: uid(), ...item }));
    }

    const field = fields[fieldIndex];
    const grouped = groupBy(data, field);

    return Object.keys(grouped).map((key) => {
      const value = [...grouped[key].value];
      delete grouped[key].value;
      for (let groupKey in grouped[key]) {
        if (groupKey !== field) grouped[key][groupKey] = '';
      }
      const item = {
        ...grouped[key],
        key: key + uid(),
        children: recursiveBuild(value, fieldIndex + 1),
      };
      return item;
    });
  };

  const groupBy = (array, key) => {
    return array.reduce((acc, item) => {
      const fieldValue = item[key];
      if (!acc[fieldValue]) acc[fieldValue] = { ...item, value: [] };
      acc[fieldValue].value.push(item);
      return acc;
    }, {});
  };

  return recursiveBuild(data, 0);
};

const countDataSource = (dataSource, measures, transform) => {
  measures?.forEach((dataValue) => {
    const countData = (data) => {
      data.forEach((value) => {
        if (!value.children?.length) return;
        const dataKey = dataValue.field.join('.');
        if (isNaN(Number(value[dataKey]))) {
          value[dataKey] = 0;
        }
        let number: any = transform.filter((value) => value.field === dataKey)[0];
        if (number) {
          number = number.specific ? number.specific : 3;
          switch (number) {
            case 'TwoDigits':
              number = 2;
              break;
            case 'ThreeDigits':
              number = 3;
              break;
            case 'FourDigits':
              number = 4;
              break;
          }
        } else {
          number = 3;
        }
        const options: Intl.NumberFormatOptions = {
          style: 'decimal',
          minimumFractionDigits: number,
          maximumFractionDigits: number,
        };

        const numberFormat = new Intl.NumberFormat('zh-CN', options);
        const num = String(value[dataKey]).includes(',') ? String(value[dataKey]).replace(/,/g, '') : value[dataKey];
        if (!isNaN(num)) {
          const sum = value.children.reduce((sum, curr) => {
            const sub = String(curr[dataKey]).includes(',')
              ? String(curr[dataKey]).replace(/,/g, '')
              : isNaN(Number(curr[dataKey]))
                ? 0
                : curr[dataKey];
            return sum + parseFloat(sub);
          }, 0);
          value[dataKey] = numberFormat.format(sum || 0);
        }
        if (value.children) {
          countData(value.children);
        }
      });
    };
    countData(dataSource);
  });
};

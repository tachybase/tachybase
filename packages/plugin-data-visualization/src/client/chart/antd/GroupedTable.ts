import { uid } from '@tachybase/utils/client';

import { Table as AntdTable } from 'antd';

import { RenderProps } from '../chart';
import { AntdChart } from './antd';

export class GroupedTable extends AntdChart {
  constructor() {
    super({ name: 'groupedTable', title: 'GroupedTable', Component: AntdTable });
  }

  getProps({ data, fieldProps, general, advanced, ctx }: RenderProps) {
    const { transform } = ctx;
    const columns = data.length
      ? Object.keys(data[0]).map((item) => ({
          title: fieldProps[item]?.label || item,
          dataIndex: item,
          key: item,
          calculate: true,
        }))
      : [];
    const dataSource = [];
    let key = 0;
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
      const dataValue = dataSource.filter((value) => value['product.name'] == item['product.name'])[0];
      if (dataValue) {
        dataSource[dataValue.key].children.push({
          key: `key${uid()}${uid()}`,
          ...item,
        });
      } else {
        dataSource.push({
          key: key,
          ...item,
          children: [
            {
              key: `key${uid()}`,
              ...item,
            },
          ],
        });
        key++;
      }
    });
    advanced?.columns?.forEach((dataValue) => {
      dataSource.forEach((value) => {
        if (dataValue.calculate) {
          let number: any = transform.filter((value) => value.field == dataValue.key)[0];
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
          const options = {
            style: 'decimal',
            minimumFractionDigits: number,
            maximumFractionDigits: number,
          };
          const numberFormat = new Intl.NumberFormat('zh-CN', options);
          const num = String(value[dataValue.key]).includes(',')
            ? String(value[dataValue.key]).replace(/,/g, '')
            : value[dataValue.key];
          if (!isNaN(num)) {
            const sum = value.children.reduce((sum, curr) => {
              const sub = String(curr[dataValue.key]).includes(',')
                ? String(curr[dataValue.key]).replace(/,/g, '')
                : curr[dataValue.key];
              return sum + parseFloat(sub);
            }, 0);
            value[dataValue.key] = numberFormat.format(sum);
          }
        } else {
          value[dataValue.key] = '';
        }
      });
    });
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

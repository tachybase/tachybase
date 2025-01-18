import { Table as AntdTable } from 'antd';

import { RenderProps } from '../chart';
import { AntdChart } from './antd';

export class Table extends AntdChart {
  constructor() {
    super({ name: 'table', title: 'Table', Component: AntdTable });
  }

  getProps({ data, fieldProps, general, advanced, ctx }: RenderProps) {
    const originDimensions = ctx.query?.dimensions || [];
    const originMeasures = ctx.query?.measures || [];

    const dimensions = originDimensions.map((dim) => (!dim.alias ? dim.field.join('.') : dim.alias));
    const measures = originMeasures.map((dim) => (!dim.alias ? dim.field.join('.') : dim.alias));

    const columns = [];
    [...dimensions, ...measures].forEach((item) => {
      columns.push({
        title: fieldProps[item]?.label || item,
        dataIndex: item,
        key: item,
      });
    });

    const dataSource = data.map((item: any, index: number) => {
      Object.keys(item).map((key: string) => {
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
      item._key = index;
      return item;
    });
    const pageSize = ctx.config?.pageSize || advanced?.pagination?.pageSize || 10;
    return {
      // bordered: true,
      size: 'middle',
      pagination:
        dataSource.length < pageSize
          ? false
          : {
              pageSize,
              onShowSizeChange: (curr, size) => {
                ctx.config.setPageSize(size);
              },
            },
      dataSource,
      columns,
      scroll: {
        x: 'max-content',
      },
      rowKey: '_key',
      ...general,
      ...advanced,
    };
  }
}

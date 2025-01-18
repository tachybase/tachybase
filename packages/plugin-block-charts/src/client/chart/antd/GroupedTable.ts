import { Table as AntdTable } from 'antd';

import { RenderProps } from '../chart';
import { AntdChart } from './antd';
import { getGroupData } from './tools/getGroupData';
import { renderText } from './tools/renderText';

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

  /**
   * transform 数据格式化配置
   * config 图表配置, general.categoryField(同参数 general) 分类字段 advanced.columns 数据表列配置(同参数 advanced)
   * service 网络请求, service.data 返回数据, (同参数 data)
   * measures 度量配置
   * fieldProps 度量和维度构造的列配置, interface 维度类型, transformer 维度转换器 label 显示名称
   * dimensions 维度配置
   * query 图表查询条件, measures 度量配置, dimensions 维度配置, filters 过滤条件, orders 排序条件, limit 限制条数
   */
  getProps({ data, fieldProps, general, advanced, ctx }: RenderProps) {
    const { columns = [] } = advanced || {};
    const { categoryField = [] } = general || {};

    const groupedData = getGroupData(data, categoryField);

    // 注入图标配置的格式化函数, 并且保证用户的图表配置的 render 函数能生效
    const cookedColumns = columns.map((item) => ({
      ...item,
      render: (text, record) =>
        renderText(text, record, {
          fieldProps,
          dataIndex: item.dataIndex,
          render: item.render,
        }),
    }));

    return {
      bordered: true,
      size: 'middle',
      pagination: false,
      scroll: {
        x: 'max-content',
      },
      rowKey: (record) => record.key,
      expandRowByClick: true,
      dataSource: groupedData,
      columns: cookedColumns,
    };
  }
}

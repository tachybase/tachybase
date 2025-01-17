import { Table as AntdTable } from 'antd';

import { RenderProps } from '../chart';
import { AntdChart } from './antd';
import { buildTree } from './tools/buildTree';
import { countDataSource } from './tools/countDataSource';
import { getGroupData } from './tools/getGroupData';
import { renderByConfig } from './tools/renderByConfig';

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
    /**
     * transform 数据格式化配置
     * config 图表配置, general.categoryField(同参数 general) 分类字段 advanced.columns 数据表列配置(同参数 advanced)
     * service 网络请求, service.data 返回数据, (同参数 data)
     * measures 度量配置
     * fieldProps 度量和维度构造的列配置, interface 维度类型, transformer 维度转换器 label 显示名称
     * dimensions 维度配置
     * query 图表查询条件, measures 度量配置, dimensions 维度配置, filters 过滤条件, orders 排序条件, limit 限制条数
     */
    const { query, transform } = ctx;
    const { columns } = advanced || {};
    const { categoryField } = general || {};
    const { measures, dimensions } = query || {};

    // 1. 这个写法保证用户的图表配置能生效
    const cookedColumns = columns.map((item) => ({
      ...item,
      render: (text, record) => {
        const cookedText = renderByConfig(text, record, {
          measures,
          dimensions,
          transform,
        });

        if (typeof item.render === 'function') {
          return item.render(cookedText, record);
        }
        return text;
      },
    }));

    const groupedData = getGroupData(data, categoryField);
    console.log('%c Line:97 🚀 groupedData', 'font-size:18px;color:#4fff4B;background:#fca650', groupedData);

    return {
      bordered: true,
      size: 'middle',
      pagination: false,
      scroll: {
        x: 'max-content',
      },
      rowKey: (record) => record.key,
      expandRowByClick: true,
      columns: cookedColumns,
      dataSource: groupedData,
    };
  }
}

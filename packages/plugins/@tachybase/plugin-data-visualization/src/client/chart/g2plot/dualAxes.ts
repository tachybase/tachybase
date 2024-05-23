import React, { useContext } from 'react';

import { DualAxes as G2DualAxes } from '@ant-design/plots';
import lodash from 'lodash';

import { ChartRendererContext } from '../../renderer';
import { ChartType, RenderProps } from '../chart';
import { G2PlotChart } from './g2plot';

export class DualAxes extends G2PlotChart {
  constructor() {
    super({ name: 'dualAxes', title: 'Dual Axes Chart', Component: G2DualAxes });
    this.config = [
      'xField',
      {
        yField: {
          title: '{{t("yField")}}',
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
    ];
  }

  init: ChartType['init'] = (fields, { measures, dimensions }) => {
    const { xField, yFields } = this.infer(fields, { measures, dimensions });
    return {
      general: {
        xField: xField?.value,
        yField: yFields?.map((f) => f.value) || [],
      },
    };
  };

  getProps({ data, general, advanced, fieldProps, ctx }: RenderProps) {
    const props = super.getProps({ data, general, advanced, fieldProps, ctx });
    return {
      ...lodash.omit(props, ['legend', 'tooltip']),
      children:
        props.yField?.map((yField: string, index: number) => {
          return {
            type: 'line',
            yField,
            colorField: () => {
              const props = fieldProps[yField];
              return props?.label || yField;
            },
            axis: {
              y: {
                title: fieldProps[yField]?.label || yField,
                position: index === 0 ? 'left' : 'right',
                labelFormatter: (datnum) => {
                  const props = fieldProps[yField];
                  const transformer = props?.transformer;
                  return transformer ? transformer(datnum) : datnum;
                },
              },
            },
          };
        }) || [],
    };
  }
}

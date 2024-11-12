import { Pie as G2Pie } from '@ant-design/plots';

import { ChartType, RenderProps } from '../chart';
import { G2PlotChart } from './g2plot';

export class Pie extends G2PlotChart {
  constructor() {
    super({ name: 'pie', title: 'Pie Chart', Component: G2Pie });
    this.config = [
      {
        property: 'field',
        name: 'angleField',
        title: 'angleField',
        required: true,
      },
      {
        property: 'field',
        name: 'colorField',
        title: 'colorField',
        required: true,
      },
    ];
  }

  init: ChartType['init'] = (fields, { measures, dimensions }) => {
    const { xField, yField } = this.infer(fields, { measures, dimensions });
    return {
      general: {
        colorField: xField?.value,
        angleField: yField?.value,
      },
    };
  };

  getProps({ data, general, advanced, fieldProps, ctx }: RenderProps) {
    const props = super.getProps({ data, general, advanced, fieldProps, ctx });
    return {
      ...props,
      tooltip: (d, index: number, data, column: any) => {
        const field = column.y0.field;
        const props = fieldProps[field];
        const name = props?.label || field;
        const transformer = props?.transformer;
        const value = column.y0.value[index];
        return { name, value: transformer ? transformer(value) : value };
      },
    };
  }
}

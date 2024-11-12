import { Bar as G2PlotBar } from '@ant-design/plots';

import { ChartType } from '../chart';
import { G2PlotChart } from './g2plot';

export class Bar extends G2PlotChart {
  constructor() {
    super({ name: 'bar', title: 'Bar Chart', Component: G2PlotBar, config: ['isGroup', 'isStack', 'isPercent'] });
  }

  init: ChartType['init'] = (fields, { measures, dimensions }) => {
    const { xField, yField, seriesField } = this.infer(fields, { measures, dimensions });
    return {
      general: {
        xField: yField?.value,
        yField: xField?.value,
        seriesField: seriesField?.value,
      },
    };
  };
}

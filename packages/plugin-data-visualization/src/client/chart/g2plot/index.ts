import { Area, Bar, Column, Line, Scatter } from '@ant-design/plots';

import { DualAxes } from './dualAxes';
import { G2PlotChart } from './g2plot';
import { Pie } from './pie';

export default [
  new G2PlotChart({
    name: 'line',
    title: 'Line Chart',
    Component: Line,
    config: ['smooth', 'isStack'],
  }),
  new G2PlotChart({
    name: 'area',
    title: 'Area Chart',
    Component: Area,
    config: [
      'smooth',
      {
        property: 'isStack',
        defaultValue: true,
      },
      'isPercent',
    ],
  }),
  new G2PlotChart({
    name: 'column',
    title: 'Column Chart',
    Component: Column,
    config: ['isGroup', 'isStack', 'isPercent'],
  }),
  new G2PlotChart({
    name: 'bar',
    title: 'Bar Chart',
    Component: Bar,
    config: ['isGroup', 'isStack', 'isPercent'],
  }),
  new Pie(),
  new DualAxes(),
  new G2PlotChart({ name: 'scatter', title: 'Scatter Chart', Component: Scatter }),
];

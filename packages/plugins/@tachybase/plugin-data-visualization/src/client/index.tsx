import { Plugin } from '@tachybase/client';

import {
  chartInitializers,
  chartInitializers_deprecated,
  ChartV2Block,
  ChartV2BlockDesigner,
  ChartV2BlockInitializer,
} from './block';
import antd from './chart/antd';
import g2plot from './chart/g2plot';
import { ChartGroup } from './chart/group';
import {
  chartFilterActionInitializers,
  chartFilterActionInitializers_deprecated,
  chartFilterItemInitializers,
  chartFilterItemInitializers_deprecated,
} from './filter';
import { lang } from './locale';

class DataVisualizationPlugin extends Plugin {
  public charts: ChartGroup = new ChartGroup();

  async load() {
    this.charts.setGroup('Built-in', [...g2plot, ...antd]);

    this.app.addComponents({
      ChartV2BlockInitializer,
      ChartV2BlockDesigner,
      ChartV2Block,
    });

    this.app.schemaInitializerManager.add(chartInitializers_deprecated);
    this.app.schemaInitializerManager.add(chartInitializers);
    this.app.schemaInitializerManager.add(chartFilterItemInitializers_deprecated);
    this.app.schemaInitializerManager.add(chartFilterItemInitializers);
    this.app.schemaInitializerManager.add(chartFilterActionInitializers_deprecated);
    this.app.schemaInitializerManager.add(chartFilterActionInitializers);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers?.add('dataBlocks.chartV2', {
      title: lang('Charts'),
      Component: 'ChartV2BlockInitializer',
    });
  }
}

export default DataVisualizationPlugin;
export { Chart } from './chart/chart';
export type { ChartProps, ChartType, RenderProps } from './chart/chart';
export { ChartConfigContext } from './configure';
export type { FieldOption } from './hooks';
export { useChartFilter } from './hooks';
export type { QueryProps } from './renderer';

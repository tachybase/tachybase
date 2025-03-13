import { Plugin } from '@tachybase/client';

import { chartInitializers, ChartV2Block, ChartV2BlockDesigner, ChartV2BlockInitializer } from './block';
import { GroupBlock } from './block-group/GroupBlock';
import { GroupBlockConfigure } from './block-group/GroupBlockConfigure';
import {
  GroupBlockInitializer,
  GroupBlockProvider,
  groupBlockSettings,
  GroupBlockToolbar,
} from './block-group/GroupBlockInitializer';
import antd from './chart/antd';
import g2plot from './chart/g2plot';
import { ChartGroup } from './chart/group';
import { chartFilterActionInitializers, chartFilterItemInitializers } from './filter';
import { lang } from './locale';

class DataVisualizationPlugin extends Plugin {
  public charts: ChartGroup = new ChartGroup();

  async load() {
    this.charts.setGroup('Built-in', [...g2plot, ...antd]);

    this.app.addComponents({
      ChartV2BlockInitializer,
      ChartV2BlockDesigner,
      ChartV2Block,
      GroupBlock,
      GroupBlockConfigure,
      GroupBlockInitializer,
      GroupBlockProvider,
      GroupBlockToolbar,
    });

    this.app.schemaInitializerManager.add(chartInitializers);
    this.app.schemaInitializerManager.add(chartFilterItemInitializers);
    this.app.schemaInitializerManager.add(chartFilterActionInitializers);
    this.schemaSettingsManager.add(groupBlockSettings);
    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers?.add('otherBlocks.chartV2', {
      title: lang('Charts'),
      Component: 'ChartV2BlockInitializer',
    });

    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.groupBlock', {
      title: lang('Group'),
      Component: 'GroupBlockInitializer',
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

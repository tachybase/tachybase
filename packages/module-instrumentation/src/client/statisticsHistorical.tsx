import { useEffect } from 'react';
import { ExtendCollectionsProvider, SchemaComponent, useAPIClient, useRequest } from '@tachybase/client';

import { ReloadOutlined } from '@ant-design/icons';
import { Chart } from '@antv/g2';
import { Button, Card } from 'antd';

import { historyConfigCollection } from './collections/historyConfig.collection';
import { tval, useTranslation } from './locale';
import { schemaHistoryConfigs } from './schemas/schemaHistoryConfigs';

type StatisticsData = {
  users: Record<string, number>;
  customData: Record<string, number>;
  customDataByTime: any;
};

export const statisticsHistoricalPane = () => {
  const { t } = useTranslation();
  const api = useAPIClient();
  const { data, refresh } = useRequest<StatisticsData>(() =>
    api
      .resource('instrumentation')
      .list()
      .then((res) => res.data?.data),
  );

  useEffect(() => {
    if (!data?.customDataByTime) return;

    const container = document.getElementById('statisticsByTime-line-wrapper');
    if (!container) return;

    container.innerHTML = '';

    const entries = Object.entries(data.customDataByTime);

    entries.forEach(([title, timeSeries], index) => {
      const chartId = `line-statistics-${index}`;
      const chartDiv = document.createElement('div');
      chartDiv.id = chartId;
      chartDiv.style.width = '100%';
      chartDiv.style.height = '300px';
      chartDiv.style.marginBottom = '24px';
      container.appendChild(chartDiv);

      const lineData = Object.entries(timeSeries)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const chart = new Chart({
        container: chartId,
        autoFit: true,
      });

      chart
        .line()
        .data(lineData)
        .encode('x', 'date')
        .encode('y', 'value')
        .encode('series', () => title)
        .label({
          text: 'value',
          style: {
            dx: -10,
            dy: -12,
          },
        })
        .style('strokeWidth', 2);

      chart.render();
    });

    return () => {
      container.innerHTML = ''; // 清理 DOM
    };
  }, [data?.customDataByTime]);

  const handleRefresh = () => {
    refresh();
  };

  return (
    <div>
      <div>
        <Card bordered={false}>
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />}>
              {t('Refresh')}
            </Button>
          </div>
          <div id="statisticsByTime-line-wrapper" style={{ width: '100%', height: 400 }} />
        </Card>
      </div>
      <div style={{ marginTop: 24 }}>
        <Card bordered={false}>
          <ExtendCollectionsProvider collections={[historyConfigCollection]}>
            <SchemaComponent schema={schemaHistoryConfigs} scope={{}} />
          </ExtendCollectionsProvider>
        </Card>
      </div>
    </div>
  );
};

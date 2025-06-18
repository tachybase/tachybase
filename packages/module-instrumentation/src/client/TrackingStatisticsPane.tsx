import { useEffect } from 'react';
import { ExtendCollectionsProvider, SchemaComponent, useAPIClient, useRequest } from '@tachybase/client';

import { ReloadOutlined } from '@ant-design/icons';
import { Chart } from '@antv/g2';
import { Button, Card } from 'antd';
import { chunk } from 'lodash';

import { statisticsConfigCollection } from './collections/statisticsConfig.collection';
import { tval, useTranslation } from './locale';
import { schemaStatisticsConfigs } from './schemas/schemaStatisticsConfigs';

type StatisticsData = {
  users: Record<string, number>;
  customData: Record<string, number>;
  customDataByTime: any;
};

export const TrackingStatisticsPane = () => {
  const { t } = useTranslation();
  const api = useAPIClient();
  const { data, refresh } = useRequest<StatisticsData>(() =>
    api
      .resource('instrumentation')
      .list()
      .then((res) => res.data?.data),
  );
  const customDataArray = Object.entries(data?.customData ?? {}).map(([title, count]) => ({
    title,
    count,
  }));

  useEffect(() => {
    // 用户数据饼图
    if (!data?.users) return;

    const { todayActiveUserCount, userCount } = data.users;
    const rest = Math.max(userCount - todayActiveUserCount, 0);

    const chart = new Chart({
      container: 'user-pie-chart',
      autoFit: true,
      height: 300,
    });

    chart.coordinate({ type: 'theta', outerRadius: 0.8, innerRadius: 0.5 });

    chart
      .interval()
      .data([
        { type: '今日活跃', value: todayActiveUserCount },
        { type: '其他用户', value: rest },
      ])
      .transform({ type: 'stackY' })
      .encode('y', 'value')
      .encode('color', 'type')
      .style('stroke', '#ffffff')
      .tooltip((data) => ({
        name: data.type,
        value: data.value,
      }));

    chart
      .text()
      .style('text', '总用户数')
      .style('x', '50%')
      .style('y', '50%')
      .style('dy', -20)
      .style('fontSize', 20)
      .style('fill', '#8c8c8c')
      .style('textAlign', 'center');

    chart
      .text()
      .style('text', `${userCount}`)
      .style('x', '50%')
      .style('y', '50%')
      .style('dy', 10)
      .style('fontSize', 25)
      .style('fill', '#000000')
      .style('textAlign', 'center');

    chart.render();

    return () => chart.destroy(); // 清理
  }, [data?.users]);

  useEffect(() => {
    if (!data?.users) {
      return;
    }

    const { average7, average30 } = data.users;

    if (!average7 && !average30) {
      return;
    }

    const chart = new Chart({
      container: 'users-dailyActive',
      autoFit: true,
    });

    chart
      .interval()
      .coordinate({ transform: [{ type: 'transpose' }] })
      .data([
        { title: '周日活', value: average7 },
        { title: '月日活', value: average30 },
      ])
      .encode('x', 'title')
      .encode('y', 'value')
      .style('widthRatio', 0.5);

    chart.render();

    return () => chart.destroy(); // 清理
  }, [data?.users]);

  useEffect(() => {
    const container = document.getElementById('statistics-wrapper');
    if (!container) return;

    container.innerHTML = '';

    const chunks = chunk(customDataArray, 10); // 每 10 条数据为一组

    chunks.forEach((group, index) => {
      const chartId = `statistics-${index}`;
      const chartDiv = document.createElement('div');
      chartDiv.id = chartId;
      chartDiv.style.width = '100%';
      chartDiv.style.height = '300px';
      chartDiv.style.marginBottom = '24px';
      container.appendChild(chartDiv);

      const paddedGroup = [...group];
      if (index === chunks.length - 1 && paddedGroup.length < 5) {
        while (paddedGroup.length < 5) {
          paddedGroup.push({ title: '', count: 0 });
        }
      }

      const chart = new Chart({
        container: chartId,
        autoFit: true,
      });

      chart
        .interval()
        .data(paddedGroup)
        .encode('x', 'title')
        .encode('y', 'count')
        .label({
          text: 'count',
          style: {
            dy: -15,
          },
        })
        .style('widthRatio', 0.5);

      chart.render();
    });

    return () => {
      container.innerHTML = ''; // 卸载时清理 DOM
    };
  }, [customDataArray]);

  const handleRefresh = () => {
    // 点击按钮后手动刷新数据
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            <div id="user-pie-chart" style={{ flex: 1, width: '100%', height: 300 }} />
            <div id="users-dailyActive" style={{ flex: 1, width: '100%', height: 300 }} />
          </div>
          <div id="statistics-wrapper" style={{ width: '100%', height: 400 }} />
        </Card>
      </div>
      <div style={{ marginTop: 24 }}>
        <Card bordered={false}>
          <ExtendCollectionsProvider collections={[statisticsConfigCollection]}>
            <SchemaComponent schema={schemaStatisticsConfigs} scope={{}} />
          </ExtendCollectionsProvider>
        </Card>
      </div>
    </div>
  );
};

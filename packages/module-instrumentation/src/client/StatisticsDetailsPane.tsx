import { useState } from 'react';
import { ExtendCollectionsProvider, SchemaComponent, useAPIClient } from '@tachybase/client';
import { CodeMirror as CodeMirrorComponent } from '@tachybase/components';
import { useForm } from '@tachybase/schema';

import { Card, Table } from 'antd';

import { trackingLogCollection } from './collections/trackingLog.collection';
import { InstrumentationFilter } from './components/InstrumentationFilter';
import { timeFilter } from './components/TimeFilter';
import { useTranslation } from './locale';
import { schemaStatisticsQuery } from './schemas/schemaStatisticsDetails';

export const statisticsDetailsPane = () => {
  const { t } = useTranslation();
  const { Column } = Table;
  const [tableData, setTableData] = useState<any[]>([]);

  const useFilterSubmitProps = () => {
    const form = useForm();
    const api = useAPIClient();
    return {
      async onClick() {
        const { data } = await api.resource('instrumentation').query({
          values: { ...form.values },
        });
        setTableData(data.data);
      },
    };
  };

  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[trackingLogCollection]}>
        <SchemaComponent
          schema={schemaStatisticsQuery}
          components={{ InstrumentationFilter, timeFilter }}
          scope={{ useFilterSubmitProps }}
        />
        <Table dataSource={tableData} style={{ marginTop: 24 }} pagination={{ pageSize: 20 }}>
          <Column title={t('ID')} dataIndex="id" key="id" />
          <Column title={t('Instrumentation key')} dataIndex="key" key="key" />
          <Column title={t('Instrumentation type')} dataIndex="type" key="type" />
          <Column
            title={t('Instrumentation values')}
            dataIndex="values"
            key="values"
            render={(values) => (
              <CodeMirrorComponent
                value={JSON.stringify(values, null, 2)}
                defaultLanguage="json"
                height="200px"
                readOnly={true}
              />
            )}
          />
        </Table>
      </ExtendCollectionsProvider>
    </Card>
  );
};

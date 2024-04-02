import { useFieldSchema } from '@nocobase/schema';
import {
  CollectionManagerProvider,
  DEFAULT_DATA_SOURCE_KEY,
  MaybeCollectionProvider,
  useAPIClient,
  useDataSourceManager,
  useRequest,
} from '@nocobase/client';
import React, { createContext, useContext } from 'react';
import { parseField, removeUnparsableFilter } from '../utils';
import { ChartDataContext } from '../block/ChartDataProvider';
import { ConfigProvider } from 'antd';
import { useChartFilter } from '../hooks';
import { ChartFilterContext } from '../filter/FilterProvider';

export type MeasureProps = {
  field: string | string[];
  aggregation?: string;
  alias?: string;
};

export type DimensionProps = {
  field: string | string[];
  alias?: string;
  format?: string;
};

export type TransformProps = {
  field: string;
  type: string;
  format: string;
  specific?: string;
};

export type QueryProps = Partial<{
  measures: MeasureProps[];
  dimensions: DimensionProps[];
  orders: {
    field: string;
    order: 'asc' | 'desc';
  }[];
  filter: any;
  limit: number;
  sql: {
    fields?: string;
    clauses?: string;
  };
}>;

export type ChartRendererProps = {
  collection: string;
  dataSource?: string;
  query?: QueryProps;
  config?: {
    chartType: string;
    general: any;
    advanced: any;
  };
  transform?: TransformProps[];
  mode?: 'builder' | 'sql';
};

export const ChartRendererContext = createContext<
  {
    service: any;
    data?: any[];
  } & ChartRendererProps
>({} as any);
ChartRendererContext.displayName = 'ChartRendererContext';

export const ChartRendererProvider: React.FC<ChartRendererProps> = (props) => {
  const { query, config, collection, transform, dataSource = DEFAULT_DATA_SOURCE_KEY } = props;
  const { addChart } = useContext(ChartDataContext);
  const { ready, form, enabled } = useContext(ChartFilterContext);
  const { getFilter, hasFilter, appendFilter } = useChartFilter();
  const schema = useFieldSchema();
  const api = useAPIClient();
  const service = useRequest(
    (dataSource, collection, query, manual) =>
      new Promise((resolve, reject) => {
        // Check if the chart is configured
        if (!(collection && query?.measures?.length)) return resolve(undefined);
        // If the filter block is enabled, the filter form is required to be rendered
        if (enabled && !form) return resolve(undefined);
        const filterValues = getFilter();
        const queryWithFilter =
          !manual && hasFilter({ dataSource, collection, query }, filterValues)
            ? appendFilter({ dataSource, collection, query }, filterValues)
            : query;
        api
          .request({
            url: 'charts:query',
            method: 'POST',
            data: {
              uid: schema?.['x-uid'],
              dataSource,
              collection,
              ...queryWithFilter,
              filter: removeUnparsableFilter(queryWithFilter.filter),
              dimensions: (query?.dimensions || []).map((item: DimensionProps) => {
                const dimension = { ...item };
                if (item.format && !item.alias) {
                  const { alias } = parseField(item.field);
                  dimension.alias = alias;
                }
                return dimension;
              }),
              measures: (query?.measures || []).map((item: MeasureProps) => {
                const measure = { ...item };
                if (item.aggregation && !item.alias) {
                  const { alias } = parseField(item.field);
                  measure.alias = alias;
                }
                return measure;
              }),
            },
          })
          .then((res) => {
            resolve(res?.data?.data);
          })
          .finally(() => {
            if (!manual && schema?.['x-uid']) {
              addChart(schema?.['x-uid'], { dataSource, collection, service, query });
            }
          })
          .catch(reject);
      }),
    {
      defaultParams: [dataSource, collection, query],
      // Wait until ChartFilterProvider is rendered and check the status of the filter form
      // since the filter parameters should be applied if the filter block is enabled
      ready: ready && (!enabled || !!form),
    },
  );

  return (
    <CollectionManagerProvider dataSource={dataSource}>
      <MaybeCollectionProvider collection={collection}>
        <ConfigProvider card={{ style: { boxShadow: 'none' } }}>
          <ChartRendererContext.Provider value={{ dataSource, collection, config, transform, service, query }}>
            {props.children}
          </ChartRendererContext.Provider>
        </ConfigProvider>
      </MaybeCollectionProvider>
    </CollectionManagerProvider>
  );
};

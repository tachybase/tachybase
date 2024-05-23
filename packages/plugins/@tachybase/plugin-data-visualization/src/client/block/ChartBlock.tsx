import React, { PropsWithChildren, useState } from 'react';
import { SchemaComponentOptions, SchemaInitializerContext, useSchemaInitializer } from '@tachybase/client';

import { ChartConfigProvider } from '../configure';
import { ChartFilterBlockDesigner, ChartFilterBlockProvider } from '../filter';
import { ChartFilterProvider } from '../filter/FilterProvider';
import { ChartRenderer, ChartRendererProvider } from '../renderer';
import { ChartDataProvider } from './ChartDataProvider';

export const ChartV2Block: React.FC<PropsWithChildren> = (props) => {
  const [initialVisible, setInitialVisible] = useState(false);
  const schemaInitializerContextData = useSchemaInitializer();
  return (
    <SchemaInitializerContext.Provider
      value={{ ...schemaInitializerContextData, visible: initialVisible, setVisible: setInitialVisible }}
    >
      <SchemaComponentOptions
        components={{ ChartRenderer, ChartRendererProvider, ChartFilterBlockProvider, ChartFilterBlockDesigner }}
      >
        <ChartDataProvider>
          <ChartFilterProvider>
            <ChartConfigProvider>{props.children}</ChartConfigProvider>
          </ChartFilterProvider>
        </ChartDataProvider>
      </SchemaComponentOptions>
    </SchemaInitializerContext.Provider>
  );
};

import React, { createContext, PropsWithChildren, useState } from 'react';
import { css, useDesignable } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { theme } from 'antd';

import { ChartRendererProvider } from '../renderer';
import { ChartConfigure } from './ChartConfigure';

export type ChartConfigCurrent = {
  schema: ISchema;
  field: any;
  collection: string;
  dataSource: string;
  service: any;
  initialValues?: any;
  data: any[];
};

export const ChartConfigContext = createContext<{
  visible: boolean;
  setVisible?: (visible: boolean) => void;
  current?: ChartConfigCurrent;
  setCurrent?: (current: ChartConfigCurrent) => void;
}>({
  visible: true,
});
ChartConfigContext.displayName = 'ChartConfigContext';

export const ChartConfigProvider: React.FC<PropsWithChildren> = (props) => {
  const { insertAdjacent } = useDesignable();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<ChartConfigCurrent>({} as any);
  const { token } = theme.useToken();
  return (
    <ChartConfigContext.Provider value={{ visible, setVisible, current, setCurrent }}>
      <div
        className={css`
          .ant-card {
            border: ${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary};
          }
        `}
      >
        {props.children}
      </div>
      <ChartRendererProvider {...current.field?.decoratorProps}>
        <ChartConfigure insert={(schema, options) => insertAdjacent('beforeEnd', schema, options)} />
      </ChartRendererProvider>
    </ChartConfigContext.Provider>
  );
};

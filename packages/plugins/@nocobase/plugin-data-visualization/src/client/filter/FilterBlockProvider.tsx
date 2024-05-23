import React, { useContext, useEffect } from 'react';
import { css, SchemaComponentOptions } from '@tachybase/client';
import { ArrayItems } from '@tachybase/components';

import { useChartsTranslation } from '../locale';
import { CollectionFieldInitializer } from './CollectionFieldInitializer';
import {
  ChartFilterActionDesigner,
  ChartFilterCollapseDesigner,
  useChartFilterActionProps,
  useChartFilterCollapseProps,
  useChartFilterResetProps,
} from './FilterActionInitializers';
import { ChartFilterGrid } from './FilterBlockInitializer';
import { ChartFilterCheckbox } from './FilterCheckbox';
import { ChartFilterForm } from './FilterForm';
import { ChartFilterItemDesigner } from './FilterItemDesigner';
import { ChartFilterFormItem } from './FilterItemInitializers';
import { ChartFilterContext } from './FilterProvider';

export const ChartFilterBlockProvider: React.FC = (props) => {
  const { t } = useChartsTranslation();
  const { setEnabled } = useContext(ChartFilterContext);
  useEffect(() => {
    setEnabled(true);
  }, [setEnabled]);
  return (
    <div
      className={css`
        .ant-card {
          box-shadow: none;
          border: none;
          margin-bottom: 6px;
        }
      `}
    >
      <SchemaComponentOptions
        components={{
          ChartFilterItemDesigner,
          ChartFilterForm,
          ChartFilterGrid,
          ChartFilterCheckbox,
          ChartFilterFormItem,
          ArrayItems,
          ChartFilterCollapseDesigner,
          ChartFilterActionDesigner,
          CollectionFieldInitializer,
        }}
        scope={{ t, useChartFilterActionProps, useChartFilterResetProps, useChartFilterCollapseProps }}
      >
        {props.children}
      </SchemaComponentOptions>
    </div>
  );
};

import React, { useContext } from 'react';
import {
  css,
  Grid,
  gridRowColWrap,
  SchemaInitializerSwitch,
  useCurrentSchema,
  useDesignable,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { merge, uid } from '@tachybase/schema';

import { FilterOutlined } from '@ant-design/icons';
import { theme } from 'antd';

import { ChartFilterContext } from './FilterProvider';

const createFilterSchema = () => {
  return {
    type: 'void',
    'x-action': 'filter',
    'x-decorator': 'ChartFilterBlockProvider',
    'x-component': 'CardItem',
    'x-component-props': {
      size: 'small',
    },
    'x-designer': 'ChartFilterBlockDesigner',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'ChartFilterForm',
        properties: {
          grid: {
            type: 'void',
            'x-component': 'ChartFilterGrid',
            'x-initializer': 'chartFilterForm:configureFields',
            properties: {},
          },
          actions: {
            type: 'void',
            'x-initializer': 'chartFilterForm:configureActions',
            'x-component': 'ActionBar',
            'x-component-props': {
              layout: 'one-column',
              style: {
                float: 'right',
                marginTop: 8,
              },
            },
            properties: {},
          },
        },
      },
    },
  };
};

export const ChartFilterGrid = (props) => {
  const {
    collapse: { collapsed },
  } = useContext(ChartFilterContext);
  const { token } = theme.useToken();
  return (
    <div
      className={css`
        .ant-tb-grid {
          overflow: hidden;
          height: ${collapsed ? `${token.controlHeight * 2}px` : 'auto'};
        }
      `}
    >
      <Grid {...props}>{props.children}</Grid>
    </div>
  );
};

export const FilterBlockInitializer: React.FC = () => {
  const { insertAdjacent } = useDesignable();
  const { setEnabled } = useContext(ChartFilterContext);
  const item = useSchemaInitializerItem();
  const { remove: _remove, disabled } = item;
  const type = 'x-action';
  const schema = createFilterSchema();
  const { exists, remove } = useCurrentSchema(
    schema?.[type] || item?.schema?.[type],
    type,
    item.find,
    _remove || item.remove,
  );

  return (
    <SchemaInitializerSwitch
      icon={<FilterOutlined />}
      checked={exists}
      disabled={disabled}
      title={item.title}
      onClick={() => {
        if (disabled) {
          return;
        }
        if (exists) {
          setEnabled(false);
          return remove();
        }
        const s = merge(schema || {}, item.schema || {});
        item?.schemaInitialize?.(s);
        insertAdjacent('afterBegin', gridRowColWrap(s));
        setEnabled(true);
      }}
    />
  );
};

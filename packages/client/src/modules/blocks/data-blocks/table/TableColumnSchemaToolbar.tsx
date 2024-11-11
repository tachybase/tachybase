import React from 'react';

import _ from 'lodash';

import { GridRowContext } from '../../../../schema-component';
import { SchemaToolbar } from '../../../../schema-settings';

export const TableColumnSchemaToolbar = (props) => {
  return (
    <GridRowContext.Provider value={null}>
      <SchemaToolbar
        initializer={props.initializer || false}
        showBorder={false}
        showBackground
        {..._.omit(props, 'initializer')}
      />
    </GridRowContext.Provider>
  );
};

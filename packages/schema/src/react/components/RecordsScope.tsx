import React from 'react';

import { IRecordsScopeProps, ReactFC } from '../types';
import { ExpressionScope } from './ExpressionScope';

export const RecordsScope: ReactFC<IRecordsScopeProps> = (props) => {
  return (
    <ExpressionScope
      value={{
        get $records() {
          return props.getRecords?.() ?? [];
        },
      }}
    >
      {props.children}
    </ExpressionScope>
  );
};

import React from 'react';

import { lazyMerge } from '../../shared';
import { useExpressionScope } from '../hooks';
import { IRecordScopeProps, ReactFC } from '../types';
import { ExpressionScope } from './ExpressionScope';

export const RecordScope: ReactFC<IRecordScopeProps> = (props) => {
  const scope = useExpressionScope();
  return (
    <ExpressionScope
      value={{
        get $lookup() {
          return scope?.$record;
        },
        get $record() {
          const record = props.getRecord?.();
          if (typeof record === 'object') {
            return lazyMerge(record, {
              get $lookup() {
                return scope?.$record;
              },
              get $index() {
                return props.getIndex?.();
              },
            });
          }
          return record;
        },
        get $index() {
          return props.getIndex?.();
        },
      }}
    >
      {props.children}
    </ExpressionScope>
  );
};

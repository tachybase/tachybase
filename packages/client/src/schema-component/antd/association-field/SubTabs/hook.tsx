import { useEffect, useState } from 'react';
import { reaction } from '@tachybase/schema';
import { flatten, getValuesByPath } from '@tachybase/utils/client';

import _ from 'lodash';

import { mergeFilter } from '../../../../filter-provider';
import { useParseDataScopeFilter } from '../../../../schema-settings';
import { DEBOUNCE_WAIT, isVariable } from '../../../../variables';
import { getPath } from '../../../../variables/utils/getPath';
import { getVariableName } from '../../../../variables/utils/getVariableName';

export const useFieldServiceFilter = (filter, originalFilter?) => {
  const [fieldServiceFilter, setFieldServiceFilter] = useState(null);
  const { parseFilter, findVariable } = useParseDataScopeFilter();

  useEffect(() => {
    const filterFromSchema = filter;

    const _run = async () => {
      const result = await parseFilter(mergeFilter([filterFromSchema || originalFilter]));
      setFieldServiceFilter(result);
    };
    const run = _.debounce(_run, DEBOUNCE_WAIT);

    _run();

    const dispose = reaction(() => {
      // 这一步主要是为了使 reaction 能够收集到依赖
      const flat = flatten(filterFromSchema, {
        breakOn({ key }) {
          return key.startsWith('$') && key !== '$and' && key !== '$or';
        },
        transformValue(value) {
          if (!isVariable(value)) {
            return value;
          }
          const variableName = getVariableName(value);
          const variable = findVariable(variableName);

          if (process.env.NODE_ENV !== 'production' && !variable) {
            throw new Error(`useServiceOptions: can not find variable ${variableName}`);
          }

          const result = getValuesByPath(
            {
              [variableName]: variable?.ctx || {},
            },
            getPath(value),
          );
          return result;
        },
      });
      return flat;
    }, run);

    return dispose;
  }, [filter, findVariable, originalFilter, parseFilter]);
  return [fieldServiceFilter, setFieldServiceFilter];
};

import { findFilterTargets, mergeFilter, useCollection, useFilterBlock } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';

export const useTabSearchCollapsibleInputItem = () => {
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const { getDataBlocks } = useFilterBlock();

  const onSelected = (
    value,
    filterKey,
    options = { canBeCalculatedField: false, customLabelKey: '', needSort: false },
  ) => {
    const { canBeCalculatedField, customLabelKey, needSort = true } = options;
    const { targets, uid } = findFilterTargets(fieldSchema);
    getDataBlocks().forEach((block) => {
      const target = targets.find((target) => target.uid === block.uid);
      if (!target) return;
      const key = `${uid}${fieldSchema.name}`;
      const param = block.service.params?.[0] || {};
      // 保留原有的 filter
      let storedFilter = block.service.params?.[1]?.filters || {};
      if (value.length) {
        storedFilter[key] = {
          [filterKey]: value,
        };

        if (canBeCalculatedField) {
          storedFilter[key] = {
            [filterKey]: Number(value?.[0] ?? 0),
          };
        }
      } else {
        if (block.dataLoadingMode === 'manual') {
          return block.clearData();
        }
        delete storedFilter[key];
      }
      const mergedFilter = mergeFilter([...Object.values(storedFilter), block.defaultFilter]);
      if (value.length === 1 && value[0] === 'all') {
        const currentKey = Object.keys(storedFilter[key]);
        if (mergedFilter['$and']) {
          currentKey.forEach((currentValue) => {
            mergedFilter['$and'].forEach((value, index) => {
              if (value[currentValue]) {
                mergedFilter['$and'].splice(index, 1);
              }
            });
          });
          mergedFilter['$and'] = mergedFilter['$and'].filter(Boolean);
        } else {
          delete mergedFilter[currentKey[0]];
        }
        storedFilter[key] = {};
      }
      storedFilter = _.omitBy(
        storedFilter,
        (value) => value === null || value === undefined || (_.isObject(value) && _.isEmpty(value)),
      );

      let params1 = {
        ...param,
        page: 1,
        filter: mergedFilter,
      };
      if (needSort) {
        params1 = {
          ...params1,
          ['sort[]']: `-${customLabelKey}`,
        };
      } else {
        params1 = _.omit(params1, ['sort[]']);
      }

      return block.doFilter(params1, { filters: storedFilter });
    });
  };

  return {
    onSelected,
  };
};

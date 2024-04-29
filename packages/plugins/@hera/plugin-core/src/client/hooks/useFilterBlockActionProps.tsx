import { useField, useFieldSchema, useForm } from '@tachybase/schema';
import { isEmpty } from '@tachybase/schema';
import {
  findFilterTargets,
  mergeFilter,
  transformToFilter,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useFilterBlock,
} from '@nocobase/client';
import flat from 'flat';
import { hasDuplicateKeys } from '../utils';

export const removeNullCondition = (filter, fieldSchema?) => {
  const filterSchema = fieldSchema ? fieldSchema['x-filter-rules'] : '';
  const filterSchemaItem = flat(filterSchema || '');
  const items = flat(filter || {});
  const values = {};
  const isCustomFilter = filterSchema?.$and?.length || filterSchema?.$or?.length;
  const isFilterCustom = isCustomFilter ? hasDuplicateKeys(items, filterSchemaItem) : false;
  if (!isFilterCustom) {
    if (isCustomFilter) {
      for (const filterKey in filterSchemaItem) {
        const match = filterSchemaItem[filterKey]?.slice(11, -2);
        const collection = match?.split('.')[0];
        const filterItems = Object.keys(items).filter((item) => item.includes(collection))[0];
        if (filterItems) {
          filterSchemaItem[filterKey] = items[filterItems];
        }
      }
      for (const item in items) {
        if (!item.includes('custom')) {
          values[item] = items[item];
        }
      }
      for (const item in filterSchemaItem) {
        if (filterSchemaItem[item].includes('$nFilter')) {
          delete filterSchemaItem[item];
        }
      }
      const flatValue = flat.unflatten(values);
      const flatFieldSchema = flat.unflatten(filterSchemaItem);
      flatValue['$and'] = flatValue['$and']?.filter(Boolean);
      flatFieldSchema['$and'] = flatFieldSchema['$and']?.filter(Boolean);
      return {
        $and: [flatValue, flatFieldSchema],
      };
    } else {
      for (const key in items) {
        const value = items[key];
        if (!key.includes('custom') && value != null && !isEmpty(value)) {
          values[key] = value;
        }
      }
      return flat.unflatten(values);
    }
  } else {
    return flat.unflatten(items);
  }
};

export const useFilterBlockActionProps = () => {
  const form = useForm();
  const actionField = useField();
  const fieldSchema = useFieldSchema();
  const { getDataBlocks } = useFilterBlock();
  const { name } = useCollection_deprecated();
  const { getCollectionJoinField } = useCollectionManager_deprecated();

  actionField.data = actionField.data || {};

  return {
    async onClick() {
      const { targets = [], uid } = findFilterTargets(fieldSchema);

      actionField.data.loading = true;
      try {
        // 收集 filter 的值
        await Promise.all(
          getDataBlocks().map(async (block) => {
            const target = targets.find((target) => target.uid === block.uid);
            if (!target) return;
            const param = block.service.params?.[0] || {};
            for (const key in form.values) {
              if (
                (typeof form.values[key] === 'object' &&
                  (JSON.stringify(form.values[key]) === '{}' || JSON.stringify(form.values[key]) === '[]')) ||
                !form.values[key]
              ) {
                delete form.values[key];
              }
            }
            // 保留原有的 filter
            const storedFilter = block.service.params?.[1]?.filters || {};
            storedFilter[uid] = removeNullCondition(
              transformToFilter(form.values, fieldSchema, getCollectionJoinField, name),
              fieldSchema,
            );
            if (block.defaultFilter) {
              getDataBlocks().forEach((getblock) => {
                if (getblock.uid !== block.uid && getblock.collection.name === block.collection.name) {
                  getblock['defaultFilter'] = block.defaultFilter;
                }
              });
            }
            const mergedFilter = mergeFilter([
              ...Object.values(storedFilter).map((filter) => removeNullCondition(filter, fieldSchema)),
              block.defaultFilter,
            ]);
            return block.doFilter(
              {
                ...param,
                page: 1,
                filter: mergedFilter,
              },
              { filters: storedFilter },
            );
          }),
        );
        actionField.data.loading = false;
      } catch (error) {
        console.error(error);
        actionField.data.loading = false;
      }
    },
  };
};

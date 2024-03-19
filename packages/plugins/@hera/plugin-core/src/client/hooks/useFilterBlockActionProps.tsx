import { useField, useFieldSchema, useForm } from '@formily/react';
import { isEmpty } from '@formily/shared';
import {
  findFilterTargets,
  mergeFilter,
  transformToFilter,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useFilterBlock,
} from '@nocobase/client';
import flat from 'flat';

export const removeNullCondition = (filter, fieldSchema?) => {
  const filterSchema = fieldSchema ? fieldSchema['x-filter-rules'] : '';
  const filterSchemaItem = flat(filterSchema || '');
  const filterItem = {};
  const items = flat(filter || {});
  const values = {};
  let isFilterCustom = false;
  if (filterSchema && (filterSchema.$and?.length || filterSchema.$or?.length)) {
    for (const key in items) {
      for (const filterItems in filterSchemaItem) {
        const match = filterSchemaItem[filterItems].slice(11, -2);
        if (key.includes(filterItems)) {
          isFilterCustom = true;
          break;
        }
      }
    }
  }
  if (!isFilterCustom) {
    if (Object.keys(items).filter((item) => item.includes('custom')).length) {
      if (filterSchema && (filterSchema.$and?.length || filterSchema.$or?.length)) {
        for (const filterKey in filterSchemaItem) {
          const match = filterSchemaItem[filterKey]?.slice(11, -2);
          const collection = match?.split('.')[0];
          if (Object.keys(items).filter((item) => item.includes(collection)).length) {
            for (const key in items) {
              if (key.includes(collection)) {
                if (key.includes(match)) {
                  filterSchemaItem[filterKey] = items[key];
                  filterItem[match] = items[key];
                }
                if (key.includes(collection)) delete items[key];
                else {
                  const value = items[key];
                  if (value != null && !isEmpty(value)) {
                    values[key] = value;
                  }
                }
              }
            }
          } else if (Object.keys(items).filter((item) => !item.includes('custom')).length) {
            const filterItem = Object.keys(items).filter((item) => !item.includes('custom'));
            filterItem.forEach((key) => {
              values[key] = items[key];
            });
          }
        }
        for (const item in filterSchemaItem) {
          for (const key in filterItem) {
            if (filterSchemaItem[item].includes(key)) {
              filterSchemaItem[item] = filterItem[key];
            }
          }
          if (filterSchemaItem[item].includes('$nFilter')) {
            delete filterSchemaItem[item];
          }
        }
        const flatValue = flat.unflatten(values);
        const flatFieldSchema = flat.unflatten(filterSchemaItem);
        return {
          $and: [flatValue, flatFieldSchema],
        };
      } else {
        for (const key in items) {
          if (!key.includes('custom')) {
            const value = items[key];
            if (value != null && !isEmpty(value)) {
              values[key] = value;
            }
          }
        }
        return flat.unflatten(values);
      }
    } else {
      for (const key in items) {
        const value = items[key];
        if (value != null && !isEmpty(value)) {
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

import { Field, useField, useFieldSchema } from '@tachybase/schema';

import flat from 'flat';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { useBlockRequestContext } from '../../../block-provider';
import { useCollection_deprecated, useCollectionManager_deprecated } from '../../../collection-manager';
import { mergeFilter } from '../../../filter-provider/utils';
import { useDataLoadingMode } from '../../../modules/blocks/data-blocks/details-multi/setDataLoadingModeSettingsItem';
import { hasDuplicateKeys } from './utils';

export const useGetFilterOptions = () => {
  const { getCollectionFields } = useCollectionManager_deprecated();
  const getFilterFieldOptions = useGetFilterFieldOptions();

  return (collectionName, dataSource?: string) => {
    const fields = getCollectionFields(collectionName, dataSource);
    const options = getFilterFieldOptions(fields);
    return options;
  };
};

export const useFilterOptions = (collectionName: string) => {
  const { getCollectionFields } = useCollectionManager_deprecated();
  const fields = getCollectionFields(collectionName);
  const options = useFilterFieldOptions(fields);
  return options;
};

export const useGetFilterFieldOptions = () => {
  const fieldSchema = useFieldSchema();
  const nonfilterable = fieldSchema?.['x-component-props']?.nonfilterable || [];
  const { getCollectionFields, getInterface } = useCollectionManager_deprecated();
  const field2option = (field, depth) => {
    if (nonfilterable.length && depth === 1 && nonfilterable.includes(field.name)) {
      return;
    }
    if (!field.interface) {
      return;
    }
    const fieldInterface = getInterface(field.interface);
    if (!fieldInterface?.filterable) {
      return;
    }
    const { nested, children, operators } = fieldInterface.filterable;
    const option = {
      name: field.name,
      type: field.type,
      target: field.target,
      title: field?.uiSchema?.title || field.name,
      schema: field?.uiSchema,
      interface: field.interface,
      operators:
        operators?.filter?.((operator) => {
          return !operator?.visible || operator.visible(field);
        }) || [],
    };
    if (field.target && depth > 2) {
      return;
    }
    if (depth > 2) {
      return option;
    }
    if (children?.length) {
      option['children'] = children;
    }
    if (nested) {
      const targetFields = getCollectionFields(field.target);
      const options = getOptions(targetFields, depth + 1).filter(Boolean);
      option['children'] = option['children'] || [];
      option['children'].push(...options);
    }
    return option;
  };
  const getOptions = (fields, depth) => {
    const options = [];
    fields.forEach((field) => {
      const option = field2option(field, depth);
      if (option) {
        options.push(option);
      }
    });
    return options;
  };
  return (fields) => getOptions(fields, 1);
};

export const useFilterFieldOptions = (fields) => {
  const fieldSchema = useFieldSchema();
  const nonfilterable = fieldSchema?.['x-component-props']?.nonfilterable || [];
  const { getCollectionFields, getInterface } = useCollectionManager_deprecated();
  const field2option = (field, depth) => {
    if (nonfilterable.length && depth === 1 && nonfilterable.includes(field.name)) {
      return;
    }
    if (!field.interface) {
      return;
    }
    const fieldInterface = getInterface(field.interface);
    if (!fieldInterface?.filterable) {
      return;
    }
    const { nested, children, operators } = fieldInterface.filterable;
    const option = {
      name: field.name,
      type: field.type,
      target: field.target,
      title: field?.uiSchema?.title || field.name,
      schema: field?.uiSchema,
      operators:
        operators?.filter?.((operator) => {
          return !operator?.visible || operator.visible(field);
        }) || [],
    };
    if (field.target && depth > 2) {
      return;
    }
    if (depth > 2) {
      return option;
    }
    if (children?.length) {
      option['children'] = children;
    }
    if (nested) {
      const targetFields = getCollectionFields(field.target);
      const options = getOptions(targetFields, depth + 1).filter(Boolean);
      option['children'] = option['children'] || [];
      option['children'].push(...options);
    }
    return option;
  };
  const getOptions = (fields, depth) => {
    const options = [];
    fields.forEach((field) => {
      const option = field2option(field, depth);
      if (option) {
        options.push(option);
      }
    });
    return options;
  };
  return getOptions(fields, 1);
};

const isEmpty = (obj) => {
  return (
    (Array.isArray(obj) && obj.length === 0) ||
    (obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype)
  );
};

export const getCustomCondition = (filter, fieldSchema, customFlat = flat) => {
  const filterSchema = fieldSchema ? fieldSchema['x-filter-rules'] : '';
  const filterSchemaItem = customFlat(filterSchema || '') as any;
  const items = customFlat(filter || {}) as any;
  const values = {};
  const isCustomFilter = filterSchema?.$and?.length || filterSchema?.$or?.length;
  const isFilterCustom = isCustomFilter ? hasDuplicateKeys(items, filterSchemaItem) : false;
  if (!isFilterCustom) {
    if (isCustomFilter) {
      for (const filterKey in filterSchemaItem) {
        const match = filterSchemaItem[filterKey]?.slice(11, -2);
        const collection = match?.split('.')[0];
        const filterItems = Object.keys(items).filter((item) => item.includes(collection));
        if (filterItems.length > 1) {
          filterSchemaItem[filterKey] = filterItems.map((key) => items[key]);
        } else {
          filterSchemaItem[filterKey] = items[filterItems[0]];
        }
      }
      for (const item in filterSchemaItem) {
        if (!filterSchemaItem[item] || filterSchemaItem[item].includes('$nFilter')) {
          delete filterSchemaItem[item];
        }
      }
      const flatFieldSchema = customFlat.unflatten(filterSchemaItem);
      flatFieldSchema['$and'] = flatFieldSchema?.['$and']?.filter(Boolean);
      flatFieldSchema['$or'] = flatFieldSchema?.['$or']?.filter(Boolean);

      return flatFieldSchema;
    } else {
      return customFlat.unflatten({});
    }
  } else {
    return customFlat.unflatten(items);
  }
};

export const removeNullCondition = (filter, customFlat = flat) => {
  const items = customFlat(filter || {}) as any;
  const values = {};
  for (const key in items) {
    const value = items[key];
    if (value != null && !isEmpty(value)) {
      values[key] = value;
    }
  }
  return customFlat.unflatten(values);
};

export const useFilterActionProps = () => {
  const { name } = useCollection_deprecated();
  const options = useFilterOptions(name);
  const { service, props } = useBlockRequestContext();
  return useFilterFieldProps({ options, service, params: props?.params });
};

export const useFilterFieldProps = ({ options, service, params }) => {
  const { t } = useTranslation();
  const field = useField<Field>();
  const dataLoadingMode = useDataLoadingMode();

  return {
    options,
    onSubmit(values) {
      // filter parameter for the block
      const defaultFilter = params.filter;
      // filter parameter for the filter action
      const filter = removeNullCondition(values?.filter) as any;

      if (dataLoadingMode === 'manual' && _.isEmpty(filter)) {
        return service.mutate(undefined);
      }

      const filters = service.params?.[1]?.filters || {};
      filters[`filterAction`] = filter;
      service.run(
        { ...service.params?.[0], page: 1, filter: mergeFilter([...Object.values(filters), defaultFilter]) },
        { filters },
      );
      const items = filter?.$and || filter?.$or;
      if (items?.length) {
        field.title = t('{{count}} filter items', { count: items?.length || 0 });
      } else {
        field.title = t('Filter');
      }
    },
    onReset() {
      const filter = params.filter;
      const filters = service.params?.[1]?.filters || {};
      delete filters[`filterAction`];

      const newParams = [
        {
          ...service.params?.[0],
          filter: mergeFilter([...Object.values(filters), filter]),
          page: 1,
        },
        { filters },
      ];

      field.title = t('Filter');

      if (dataLoadingMode === 'manual') {
        service.params = newParams;
        return service.mutate(undefined);
      }

      service.run(...newParams);
    },
  };
};

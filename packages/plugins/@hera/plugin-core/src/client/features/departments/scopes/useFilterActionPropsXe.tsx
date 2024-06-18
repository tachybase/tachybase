import { useContext } from 'react';
import {
  CollectionContext,
  mergeFilter,
  removeNullCondition,
  useFilterFieldOptions,
  useResourceActionContext,
} from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { useTranslation } from '../../../locale';
import { ContextR } from '../components/ContextR';

export const useFilterActionPropsXe = () => {
  const { setHasFilter, setExpandedKeys } = useContext(ContextR);
  const { t } = useTranslation();
  const collection = useContext(CollectionContext);
  const options = useFilterFieldOptions(collection.fields);
  const service = useResourceActionContext();
  const { run, defaultRequest } = service;
  const field = useField();
  const { params } = defaultRequest || {};
  return {
    options: options,
    onSubmit: async (args) => {
      const filter = params.filter;
      const defaultFilter = removeNullCondition(args?.filter) as any;
      run({ ...params, page: 1, pageSize: 10, filter: mergeFilter([defaultFilter, filter]) });
      const filters = defaultFilter?.$and || defaultFilter?.$or;
      if (filters?.length) {
        field.title = t('{{count}} filter items', { count: filters?.length || 0 });
        setHasFilter(true);
      } else {
        field.title = t('Filter');
        setHasFilter(false);
      }
    },
    onReset() {
      run({
        ...params,
        filter: { ...(params?.filter || {}), parentId: null },
        page: 1,
        pageSize: 10,
      });
      field.title = t('Filter');
      setHasFilter(false);
      setExpandedKeys([]);
    },
  };
};

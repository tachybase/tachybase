import { useContext } from 'react';
import {
  CollectionContext,
  useFilterFieldOptions,
  useFilterFieldProps,
  useResourceActionContext,
} from '@tachybase/client';

export const useFilterActionProps = () => {
  const collection = useContext(CollectionContext);
  const options = useFilterFieldOptions(collection.fields);
  const service = useResourceActionContext();
  return useFilterFieldProps({
    options,
    params: service.state?.params?.[0] || service.params,
    service,
  });
};

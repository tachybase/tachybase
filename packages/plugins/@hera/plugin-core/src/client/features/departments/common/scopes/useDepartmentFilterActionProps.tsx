import { useCollection, useFilterFieldOptions, useFilterFieldProps, useResourceActionContext } from '@tachybase/client';

export const useDepartmentFilterActionProps = () => {
  const collection = useCollection();
  const options = useFilterFieldOptions(collection.fields);
  const service = useResourceActionContext();

  const result = useFilterFieldProps({
    options,
    params: service.state?.params?.[0] || service.params,
    service,
  });

  return result;
};

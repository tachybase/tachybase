import { useContext } from 'react';
import { CollectionContext, useFilterFieldOptions, useFilterFieldProps, useTableBlockContext } from '@tachybase/client';

// export const useFilterActionProps = () => {
//   const collection = useContext(CollectionContext);
//   const options = useFilterFieldOptions(collection.fields);
//   const { service } = useTableBlockContext();
//   return useFilterFieldProps({
//     options,
//     params: service.state?.params?.[0] || service.params,
//     service,
//   });
// };

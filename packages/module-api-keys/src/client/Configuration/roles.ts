import { useCurrentRoles } from '@tachybase/client';

export const useCurrentRolesProps = () => {
  const options = useCurrentRoles();

  return {
    options,
  };
};

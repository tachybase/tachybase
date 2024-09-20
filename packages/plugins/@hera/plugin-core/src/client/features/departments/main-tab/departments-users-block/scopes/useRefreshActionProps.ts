import { useResourceActionContext } from '@tachybase/client';

export function useRefreshActionProps() {
  const service = useResourceActionContext();

  return {
    async onClick() {
      service?.refresh?.();
    },
  };
}

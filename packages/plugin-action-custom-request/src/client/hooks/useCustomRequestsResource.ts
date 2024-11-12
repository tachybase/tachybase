import { useAPIClient } from '@tachybase/client';

export type { IResource } from '@tachybase/sdk';

export const useCustomRequestsResource = () => {
  const apiClient = useAPIClient();
  return apiClient.resource('customRequests');
};

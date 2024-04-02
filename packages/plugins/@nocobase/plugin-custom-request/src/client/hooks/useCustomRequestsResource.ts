import { useAPIClient } from '@nocobase/client';
export type { IResource } from '@nocobase/sdk';

export const useCustomRequestsResource = () => {
  const apiClient = useAPIClient();
  return apiClient.resource('customRequests');
};

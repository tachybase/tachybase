import { createContext, ReactNode, useContext } from 'react';
import { APIClient, Application, useAPIClient, useApp } from '@tachybase/client';
import Database from '@tachybase/database';

export enum TrackingEventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  API_CALL = 'api_call',
  CUSTOM = 'custom',
}

export interface TrackingData {
  type: TrackingEventType;
  key: string;
  values?: Record<string, any>;
}

// export interface TrackingManagerContextProps {
//   trackingManager: TrackingManager;
// }

// export const TrackingManagerContext = createContext<TrackingManagerContextProps>({
//   trackingManager: {} as TrackingManager,
// });

// export const TrackingManagerProvider = ({ children }: { children: ReactNode }) => {
//   const app = useApp();
//   return (
//     <TrackingManagerContext.Provider value={{ trackingManager: app.trackingManager }}>
//       {children}
//     </TrackingManagerContext.Provider>
//   );
// };

// export const useTrackingManager = () => {
//   return useContext(TrackingManagerContext);
// };

export class TrackingManager {
  api: APIClient;
  constructor(private app: Application) {}

  async logEvent(type: TrackingEventType, key: string, values?: Record<string, any>) {
    const data: TrackingData = {
      type,
      key,
      values,
    };
    this.app.apiClient.resource('instrumentation').create({
      values: {
        ...data,
      },
    });
  }
}

import { Plugin } from '@tachybase/client';
import { autorun } from '@tachybase/schema';

import { OnlineUserProvider } from './OnlineUserProvider';

export class PluginOnlineUserClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.use(OnlineUserProvider);

    // listen to connected events.
    // autorun(() => {
    //   if (this.app.ws.connected) {
    //     const data = {
    //       type: 'plugin-online-user:client',
    //       payload: {
    //         token: this.app.apiClient.auth.getToken(),
    //       },
    //     };
    //     this.app.ws.send(JSON.stringify(data));
    //   }
    // });
  }
}

export default PluginOnlineUserClient;

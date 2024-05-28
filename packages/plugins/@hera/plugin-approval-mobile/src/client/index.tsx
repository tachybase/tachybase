import { Plugin } from '@tachybase/client';

import PluginApproval from './approval';

export class PluginApprovalMobileClient extends Plugin {
  async afterAdd() {
    this.pm.add(PluginApproval);
  }

  async beforeLoad() {}

  async load() {
    this.app.router.add('mobile.approval.page', {
      path: '/mobile/:name/approval/:id/page',
      Component: 'ViewActionInitiationsContent',
    });
    this.app.router.add('mobile.approval.userPage', {
      path: '/mobile/:name/:id/page',
      Component: 'ViewActionUserInitiationsContent',
    });
    this.app.router.add('mobile.approval.detailspage', {
      path: '/mobile/:name/:id/:category/detailspage',
      Component: 'ViewActionTodosContent',
    });
  }
}

export default PluginApprovalMobileClient;

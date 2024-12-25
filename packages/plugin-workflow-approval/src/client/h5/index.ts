import { Plugin } from '@tachybase/client';

import { ApprovalBlockInitializer } from './ApprovalBlockInitializer';
import { ApprovalSettings } from './ApprovalSettings';
import { ApprovalProcess } from './component/ApprovalProcess.view';
import { ViewActionInitiationsContent } from './initiations/component/ViewActionInitiationsContent';
import { ViewActionUserInitiationsContent } from './initiations/component/ViewActionUserInitiationsContent';
import { LauncherActionConfigInitializer } from './initiations/config/LauncherActionConfig';
import { InitiationsBlock } from './initiations/InitiationsBlock';
import { ViewActionTodosContent } from './todos/component/ViewActionTodosContent';
import { ViewTodosDetailsContent } from './todos/component/ViewTodosDetailsContent';
import { ViewTodosUserJobsContent } from './todos/component/ViewTodosUserJobsContent';
import { TodosBlock } from './todos/TodosBlock';

export class KitApprovalH5 extends Plugin {
  async load() {
    this.app.addComponents({
      ApprovalBlockInitializer,
      InitiationsBlock,
      TodosBlock,
      ViewTodosDetailsContent,
      ViewActionTodosContent,
      ViewActionUserInitiationsContent,
      ViewActionInitiationsContent,
      ViewTodosUserJobsContent,
      'ApprovalCommon.ViewComponent.MApprovalProcess': ApprovalProcess,
    });
    this.app.schemaSettingsManager.add(ApprovalSettings);
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'otherBlocks.approval', {
      title: 'Approval',
      name: 'approval',
      type: 'item',
      Component: 'ApprovalBlockInitializer',
    });
    this.app.schemaInitializerManager.add(LauncherActionConfigInitializer);

    this.addRoutes();
  }

  async addRoutes() {
    this.app.router.add('mobile.approval.page', {
      path: '/mobile/:name/approval/:id/page',
      Component: 'ViewActionInitiationsContent',
    });
    this.app.router.add('mobile.approval.userPage', {
      path: '/mobile/:name/:id/page',
      Component: 'ViewActionUserInitiationsContent',
    });
    this.app.router.add('mobile.approval.detailspage', {
      path: '/mobile/:name/:type/:id/:category/detailspage',
      Component: 'ViewTodosDetailsContent',
    });
  }
}

import { InjectedPlugin, Plugin } from '@tachybase/server';

import { ActionAPIService } from '../services/ActionAPIService';
import { ApplicationEventService } from '../services/ApplicationEventService';
import { BeforeAfterResourceService } from '../services/BeforeResourceService';
import { DatabaseEventService } from '../services/DatabaseEventService';
import { ResourceService } from '../services/ResourceService';
import { WebhookController } from './webhooks';

@InjectedPlugin({
  Services: [
    ResourceService,
    DatabaseEventService,
    ApplicationEventService,
    BeforeAfterResourceService,
    ActionAPIService,
  ],
})
export class PluginWebhook extends Plugin {
  async load() {
    this.app.resourcer.define({
      name: 'webhooks',
      actions: {
        trigger: new WebhookController().getLink,
        test: new WebhookController().test,
      },
    });
    this.app.acl.allow('webhooks', ['trigger', 'test'], 'loggedIn');
  }
}

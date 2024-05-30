import { Context, Next } from '@tachybase/actions';
import Application from '@tachybase/server';
import { ActionDef, App, Container, Inject, Service } from '@tachybase/utils';

@Service()
export class WebControllerService {
  @App()
  private app: Application;

  @Inject('actions')
  private actions: Map<Function, any>;

  allow(name, actionName) {
    this.app.acl.allow(name, actionName, 'loggedIn');
  }

  async load() {
    // register resources and actions
    const controllers = Container.getMany('controller');
    controllers.forEach((instance: Object) => {
      const items = this.actions.get(instance.constructor) as ActionDef[];
      const resourceItems = items.filter((item) => item.type === 'resource');
      if (resourceItems.length === 0) {
        return;
      }
      const resource = {
        name: resourceItems[0].resourceName,
        actions: {},
      };
      const actionItems = items.filter((item) => item.type === 'action');
      actionItems.forEach((item) => {
        resource.actions[item.actionName] = async (ctx: Context, next: Next) => await instance[item.method](ctx, next);
        this.allow(resource.name, item.actionName);
        console.info('[hera-core]: register [resource]:', resource.name, '[action]', item.actionName);
      });
      this.app.resource(resource);
    });
  }
}

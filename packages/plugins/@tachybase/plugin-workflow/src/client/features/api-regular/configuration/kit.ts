import { Plugin } from '@tachybase/client';

import PluginWorkflow from '../../..';
import { NAMESPACE_TRIGGER_API_REGULAR } from '../../../../common/constants';
import { APIRegularTrigger } from './APIRegular.trigger';

export class KitAPIRegularConfiguration extends Plugin {
  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerTrigger(NAMESPACE_TRIGGER_API_REGULAR, APIRegularTrigger);
  }
}

import { Plugin } from '@tachybase/client';

import { SequenceFieldInterface } from './sequence';
import { SequenceFieldProvider } from './SequenceFieldProvider';

export class SequenceFieldPlugin extends Plugin {
  async load() {
    this.app.use(SequenceFieldProvider);
    this.app.dataSourceManager.addFieldInterfaces([SequenceFieldInterface]);
  }
}

export default SequenceFieldPlugin;

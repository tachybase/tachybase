import { Plugin } from '@tachybase/server';

import { EncryptionField } from './encryption-field';
import { $encryptionEq } from './operators/eq';
import { $encryptionNe } from './operators/ne';

export class PluginFieldEncryptionServer extends Plugin {
  async beforeLoad() {
    // 注册字段类型: 加密字段
    this.db.registerFieldTypes({
      encryption: EncryptionField,
    });

    // 注册查询操作符: 加密字段全等、不全等
    this.db.registerOperators({
      $encryptionEq,
      $encryptionNe,
    });
  }
}

export default PluginFieldEncryptionServer;

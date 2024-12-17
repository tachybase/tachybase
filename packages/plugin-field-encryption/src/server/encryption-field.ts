import { BaseColumnFieldOptions, DataTypes, Field, FieldContext } from '@tachybase/database';

import { decryptSync, encryptSync } from './utils';

export interface EncryptionFieldOptions extends BaseColumnFieldOptions {
  type: 'encryption';
}

export class EncryptionField extends Field {
  get dataType() {
    return DataTypes.STRING;
  }

  constructor(options?: any, context?: FieldContext) {
    const { name, iv } = options;

    super(
      {
        get() {
          const value = this.getDataValue(name);
          if (!value) return null;

          return decryptSync(value, iv);
        },
        set(value) {
          if (!value?.length) {
            value = null;
          } else {
            value = encryptSync(value, iv);
          }
          this.setDataValue(name, value);
        },
        ...options,
      },
      context,
    );
  }
}

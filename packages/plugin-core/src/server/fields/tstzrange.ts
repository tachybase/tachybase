import { BaseColumnFieldOptions, DataTypes, Field, Model } from '@tachybase/database';

export interface TstzrangeFieldOptions extends BaseColumnFieldOptions {
  type: 'tstzrange';
}

export default class TstzrangeField extends Field {
  get dataType() {
    return DataTypes.RANGE(DataTypes.DATE);
  }
}

import { DataTypes } from 'sequelize';

import { BaseColumnFieldOptions, Field } from './field';

export class DateOnlyField extends Field {
  get dataType(): any {
    return DataTypes.DATEONLY;
  }
}

export interface DateOnlyFieldOptions extends BaseColumnFieldOptions {
  type: 'dateOnly';
}

import { DataTypes, Field } from '@tachybase/database';

export class DateOnlyField extends Field {
  get dataType() {
    return DataTypes.DATEONLY;
  }
}

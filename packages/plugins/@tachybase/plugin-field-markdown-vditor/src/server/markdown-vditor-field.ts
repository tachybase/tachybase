import { DataTypes, Field } from '@tachybase/database';

export class MarkdownVditorField extends Field {
  get dataType() {
    return DataTypes.TEXT;
  }
}

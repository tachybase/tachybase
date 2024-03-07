import { BaseColumnFieldOptions, DataTypes, Field, Model } from '@nocobase/database';

export interface CalcFieldOptions extends BaseColumnFieldOptions {
  type: 'calc';
}

export default class CalcField extends Field {
  get dataType() {
    return DataTypes.STRING;
  }

  constructor(options: CalcFieldOptions, context) {
    super(options, context);
  }

  setValue = (instance: Model) => {
    const { name } = this.options;
    instance.set(name, 'hello world');
  };

  bind(): void {
    super.bind();
    this.on('beforeCreate', this.setValue);
  }

  unbind(): void {
    super.unbind();
    this.off('beforeCreate', this.setValue);
  }
}

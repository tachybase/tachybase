import DropdownAlign from '../dropdown_align';
import DropdownItem from './dropdown_item';

export default class Valign extends DropdownItem {
  constructor(value) {
    super('valign', '', value);
  }

  dropdown() {
    const { value } = this;
    return new DropdownAlign(['top', 'middle', 'bottom'], value);
  }
}

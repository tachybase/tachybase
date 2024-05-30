import DropdownBorder from '../dropdown_border';
import DropdownItem from './dropdown_item';

export default class Border extends DropdownItem {
  constructor() {
    super('border');
  }

  dropdown() {
    return new DropdownBorder();
  }
}

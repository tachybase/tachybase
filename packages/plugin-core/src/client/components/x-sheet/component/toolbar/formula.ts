import DropdownFormula from '../dropdown_formula';
import DropdownItem from './dropdown_item';

export default class Format extends DropdownItem {
  constructor() {
    super('formula');
  }

  getValue(it) {
    return it.key;
  }

  dropdown() {
    return new DropdownFormula();
  }
}

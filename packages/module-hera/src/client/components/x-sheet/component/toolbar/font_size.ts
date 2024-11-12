import DropdownFontsize from '../dropdown_fontsize';
import DropdownItem from './dropdown_item';

export default class Format extends DropdownItem {
  constructor() {
    super('font-size');
  }

  getValue(it) {
    return it.pt;
  }

  dropdown() {
    return new DropdownFontsize();
  }
}

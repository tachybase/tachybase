import { cssPrefix } from '../../config';
import Dropdown from '../dropdown';
import { h } from '../element';
import Icon from '../icon';
import DropdownItem from './dropdown_item';

class DropdownMore extends Dropdown {
  constructor() {
    const icon = new Icon('ellipsis');
    const moreBtns = h('div', `${cssPrefix}-toolbar-more`);
    super(icon, 'auto', false, 'bottom-right', moreBtns);
    this.moreBtns = moreBtns;
    this.contentEl.css('max-width', '420px');
  }
}

export default class More extends DropdownItem {
  constructor() {
    super('more');
    this.el.hide();
  }

  dropdown() {
    return new DropdownMore();
  }

  show() {
    this.el.show();
  }

  hide() {
    this.el.hide();
  }
}

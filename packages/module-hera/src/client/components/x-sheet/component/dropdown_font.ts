import { cssPrefix } from '../config';
import { baseFonts } from '../core/font';
import Dropdown from './dropdown';
import { h } from './element';

export default class DropdownFont extends Dropdown {
  constructor() {
    const nfonts = baseFonts.map((it) =>
      h('div', `${cssPrefix}-item`)
        .on('click', () => {
          this.setTitle(it.title);
          this.change(it);
        })
        .child(it.title),
    );
    super(baseFonts[0].title, '160px', true, 'bottom-left', ...nfonts);
  }
}

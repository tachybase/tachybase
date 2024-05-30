import { cssPrefix } from '../config';
import { baseFormulas } from '../core/formula';
import Dropdown from './dropdown';
import { h } from './element';
import Icon from './icon';

export default class DropdownFormula extends Dropdown {
  constructor() {
    const nformulas = baseFormulas.map((it) =>
      h('div', `${cssPrefix}-item`)
        .on('click', () => {
          this.hide();
          this.change(it);
        })
        .child(it.key),
    );
    super(new Icon('formula'), '180px', true, 'bottom-left', ...nformulas);
  }
}

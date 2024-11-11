import { cssPrefix } from '../config';
import { t } from '../locale/locale';
import { HComponent } from './element';

export default class Button extends HComponent {
  // type: primary
  constructor(title, type = '') {
    super('div', `${cssPrefix}-button ${type}`);
    this.child(t(`button.${title}`));
  }
}

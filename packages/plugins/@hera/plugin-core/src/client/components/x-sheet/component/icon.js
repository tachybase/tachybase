import { cssPrefix } from '../config';
import { h, HComponent } from './element';

export default class Icon extends HComponent {
  constructor(name) {
    super('div', `${cssPrefix}-icon`);
    this.iconNameEl = h('div', `${cssPrefix}-icon-img ${name}`);
    this.child(this.iconNameEl);
  }

  setName(name) {
    this.iconNameEl.className(`${cssPrefix}-icon-img ${name}`);
  }
}

import { cssPrefix } from '../config';
import { h, HComponent } from './element';

export default class Scrollbar {
  private el: HComponent;
  private contentEl: HComponent;
  private _moveFn: (type: string, handler: (e: Event) => void) => void;
  constructor(private vertical: 'vertical' | 'horizontal') {
    this._moveFn = null;
    this.el = h('div', `${cssPrefix}-scrollbar ${vertical ? 'vertical' : 'horizontal'}`)
      .child((this.contentEl = h('div', '')))
      .on('mousemove.stop', () => {})
      .on('scroll.stop', (evt) => {
        const { scrollTop, scrollLeft } = evt.target;
        if (this._moveFn) {
          this._moveFn(this.vertical ? scrollTop : scrollLeft, evt);
        }
      });
  }

  set moveFn(fn: (type: string, handler: (e: Event) => void) => void) {
    this._moveFn = fn;
  }

  move(v) {
    this.el.scroll(v);
    return this;
  }

  scroll() {
    return this.el.scroll();
  }

  set(distance, contentDistance) {
    const d = distance - 1;
    if (contentDistance > d) {
      const cssKey = this.vertical ? 'height' : 'width';
      this.el.css(cssKey, `${d - 15}px`).show();
      this.contentEl.css(this.vertical ? 'width' : 'height', '1px').css(cssKey, `${contentDistance}px`);
    } else {
      this.el.hide();
    }
    return this;
  }
}

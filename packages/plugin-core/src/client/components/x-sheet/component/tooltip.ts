import { cssPrefix } from '../config';
import { h } from './element';
import { bind } from './event';

export default function tooltip(html: string, target) {
  if (target.classList.contains('active')) {
    return;
  }
  const { left, top, width, height } = target.getBoundingClientRect();
  const el = h('div', `${cssPrefix}-tooltip`).html(html).show();
  document.body.appendChild(el.el);
  const elBox = el.box();
  el.css('left', `${left + width / 2 - elBox.width / 2}px`).css('top', `${top + height + 2}px`);

  bind(target, 'mouseleave', () => {
    if (document.body.contains(el.el)) {
      document.body.removeChild(el.el);
    }
  });

  bind(target, 'click', () => {
    if (document.body.contains(el.el)) {
      document.body.removeChild(el.el);
    }
  });
}

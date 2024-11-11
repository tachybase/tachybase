import React from 'react';

// import { HComponent, h } from './element';
import { cssPrefix } from '../config';

// export default class Icon extends HComponent {
//   constructor(name) {
//     super('div', `${cssPrefix}-icon`);
//     this.iconNameEl = h('div', ``);
//     this.child(this.iconNameEl);
//   }

// FIXME setName Icon
//   setName(name) {
//     this.iconNameEl.className(`${cssPrefix}-icon-img ${name}`);
//   }
// }

export const Icon = ({ name, onClick }: { name: string; onClick: () => void }) => {
  return (
    <div className={`${cssPrefix}-icon`} onClick={onClick}>
      <div className={`${cssPrefix}-icon-img ${name}`} />
    </div>
  );
};

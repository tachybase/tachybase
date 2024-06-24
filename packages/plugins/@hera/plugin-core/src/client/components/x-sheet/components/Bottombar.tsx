import React, { useState } from 'react';
import { cssPrefix } from '../config';
import { tf } from '../locale/locale';
import { Icon } from './Icon';

// this.el = h('div', `${cssPrefix}-bottombar`).children(
//   this.contextMenu.el,
//   (this.menuEl = h('ul', `${cssPrefix}-menu`).child(
//     h('li', '').children(
//       new Icon('add').on('click', () => {
//         addFunc();
//       }),
//       h('span', '').child(this.moreEl),
//     ),
//   )),
// );

// this.el = h('div', `${cssPrefix}-contextmenu`)
//   .css('width', '160px')
//   .children(...buildMenu.call(this))
//   .hide();
// this.itemClick = () => {};

const menuItems = [
  { key: 'delete', title: tf('contextmenu.deleteSheet') },
  { key: 'rename', title: tf('contextmenu.renameSheet') },
];

// return h('div', `${cssPrefix}-item`)
//   .child(item.title())
//   .on('click', () => {
//     this.itemClick(item.key);
//     this.hide();
//   });

export const ContextMenu = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`${cssPrefix}-contextmenu`} style={{ width: '160px' }}>
      {visible ? menuItems.map((item) => <div key={item.key}>{item.title()}</div>) : null}
    </div>
  );
};

export const Bottombar = () => {
  const addSheet = () => {};

  return (
    <div className={`${cssPrefix}-bottombar`}>
      <ContextMenu />
      <ul className={`${cssPrefix}-menu`}>
        <li>
          <Icon name="add" onClick={addSheet} />
          <Icon name="ellipsis" onClick={() => {}} />
        </li>
        <li className="active">sheet1</li>
        <li>sheet2</li>
        <li>sheet3</li>
        <li>sheet4</li>
      </ul>
    </div>
  );
};

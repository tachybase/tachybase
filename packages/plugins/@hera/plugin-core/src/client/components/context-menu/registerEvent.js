import { uniqueId } from './helper';

const events = {};

let activeEvent = {};

const registerEvent = (id, showMenu, hideMenu) => {
  const _ = uniqueId();

  events[_] = {
    id,
    showMenu,
    hideMenu,
  };

  return id;
};

const callShowEvent = (opts) => {
  if (activeEvent.hideMenu) activeEvent.hideMenu();
  Object.keys(events).forEach((key) => {
    if (events[key].id && events[key].id === opts.id) {
      events[key].showMenu(opts);
      activeEvent = events[key];
    }
  });
};

const callHideEvent = (menuId) => {
  if (activeEvent.id === menuId || menuId === 'ID_NOT_REQUIRED') {
    if (activeEvent.hideMenu) activeEvent.hideMenu();
    activeEvent = {};
  }
};

export { registerEvent, callShowEvent, callHideEvent };

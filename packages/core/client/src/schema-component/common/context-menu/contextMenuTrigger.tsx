import React, { useCallback, useRef } from 'react';

import classnames from 'classnames';

import { callHideEvent, callShowEvent } from './registerEvent';

export function ContextMenuTrigger({
  children,
  id,
  disableWhileShiftPressed,
  attributes,
  disable,
  className,
  position,
  setPosition,
}) {
  const menuTrigger = useRef(null);

  const handleContextMenu = useCallback(
    (e) => {
      if (disable) return;
      if (disableWhileShiftPressed && e.nativeEvent.shiftKey) {
        callHideEvent(id);
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      const { clientX, clientY } = e.nativeEvent;
      const minPx = 50;
      if (
        clientX - position.x > minPx ||
        position.x - clientX > minPx ||
        clientY - position.y > minPx ||
        position.y - clientY > minPx
      ) {
        setPosition({
          x: clientX,
          y: clientY,
        });
      }
      const opts = {
        position: {
          clientY,
          clientX,
        },
        id,
      };

      callShowEvent(opts);
    },
    [children, id, disableWhileShiftPressed, attributes, disable, className],
  );

  return (
    <div
      className={classnames('menu-trigger', ...className.split(' '))}
      ref={menuTrigger}
      {...attributes}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      {children}
    </div>
  );
}

export default ContextMenuTrigger;
ContextMenuTrigger.defaultProps = {
  attributes: {},
  disable: false,
  renderTag: 'div',
  disableWhileShiftPressed: false,
  className: '',
};

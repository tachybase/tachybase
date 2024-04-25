import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
import { callHideEvent } from './registerEvent';

function ContextMenuItem({ children, onClick, disabled, preventClose, attributes, className }) {
  const contextMenuItem = useRef(null);

  const handleClickEvent = useCallback((e) => {
    if (disabled) return;
    onClick(e);

    if (!preventClose) callHideEvent('ID_NOT_REQUIRED');
  });

  return (
    <div
      className={classnames(
        'contextmenu__item',
        {
          'contextmenu__item--disabled': disabled,
        },
        ...className.split(' '),
      )}
      onClick={handleClickEvent}
      {...attributes}
      ref={contextMenuItem}
    >
      {children}
    </div>
  );
}

export default ContextMenuItem;

ContextMenuItem.defaultProps = {
  disabled: false,
  preventClose: false,
  attributes: {},
  className: '',
  onClick: () => null,
  onItemHover: () => null,
};

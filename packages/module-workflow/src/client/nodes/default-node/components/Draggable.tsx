import React from 'react';

import { useDraggable } from '@dnd-kit/core';

import { useContextDrag } from '../Drag.context';
import { useStyles } from './Draggable.style';

export const Draggable = (props) => {
  const { id, children } = props;
  const { isDraggable } = useContextDrag();
  console.log('%c Line:12 🌮 isDraggable', 'font-size:18px;color:#2eafb0;background:#7f2b82', isDraggable);
  const { styles, cx } = useStyles();
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id,
    disabled: !isDraggable,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={cx(styles.draggable, {
        showBackground: isDraggable,
      })}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

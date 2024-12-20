import React from 'react';

import { useDraggable } from '@dnd-kit/core';

export const Draggable = (props) => {
  const { id, children } = props;
  console.log('%c Line:7 🍢 id', 'font-size:18px;color:#2eafb0;background:#465975', id);
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
};

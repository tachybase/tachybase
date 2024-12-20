import React from 'react';

import { useDraggable } from '@dnd-kit/core';

export const Draggable = (props) => {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: 'draggable',
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
};

import React from 'react';

import { useDraggable } from '@dnd-kit/core';

export const Draggable = (props) => {
  const { id, children } = props;
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

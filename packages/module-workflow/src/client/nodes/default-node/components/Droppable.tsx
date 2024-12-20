import React from 'react';

import { useDroppable } from '@dnd-kit/core';

export const Droppable = (props) => {
  const { id, children } = props;
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? 'green' : 'red',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

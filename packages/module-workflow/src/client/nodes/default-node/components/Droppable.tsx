import React from 'react';

import { useDroppable } from '@dnd-kit/core';

export const Droppable = (props) => {
  const { id, children } = props;
  const { setNodeRef } = useDroppable({
    id,
  });

  return <div ref={setNodeRef}>{children}</div>;
};

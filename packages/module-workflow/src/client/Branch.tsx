import React, { useMemo, useState } from 'react';
import { cx } from '@tachybase/client';

import { CloseOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';

import { useGetAriaLabelOfAddButton } from './hooks/useGetAriaLabelOfAddButton';
import { AddButton, Node } from './nodes/default-node';
import { ProviderContextDrag } from './nodes/default-node/Drag.context';
import useStyles from './style';
import { rearrangeNodeList } from './tools';

export const Branch = ({
  from = null,
  entry = null,
  branchIndex = null,
  controller = null,
  className,
  end,
}: {
  from?: any;
  entry?: any;
  branchIndex?: number | null;
  controller?: React.ReactNode;
  className?: string;
  end?: boolean;
}) => {
  const { styles } = useStyles();
  const { getAriaLabel } = useGetAriaLabelOfAddButton(from, branchIndex);

  const initialList = useMemo(() => {
    const resultList = [];
    for (let node = entry; node; node = node.downstream) {
      resultList.push(node);
    }
    return resultList;
  }, []);

  const [isDraggable, setIsDraggable] = useState(false);

  const [list, setList] = useState(initialList);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active?.id && active.id !== over?.id) {
      const newList = rearrangeNodeList(list, active.id, over.id);
      setList(newList);
    }

    setIsDraggable(false);
  };

  return (
    <div className={cx('workflow-branch', styles.branchClass, className)}>
      <div className="workflow-branch-lines" />
      {controller}
      <AddButton aria-label={getAriaLabel()} upstream={from} branchIndex={branchIndex} />
      <DndContext onDragEnd={handleDragEnd}>
        <ProviderContextDrag value={{ isDraggable, setIsDraggable }}>
          <div className="workflow-node-list">
            {list.map((item) => (
              <Node data={item} key={item.id} />
            ))}
          </div>
        </ProviderContextDrag>
      </DndContext>
      {end ? (
        <div className="end-sign">
          <CloseOutlined />
        </div>
      ) : null}
    </div>
  );
};

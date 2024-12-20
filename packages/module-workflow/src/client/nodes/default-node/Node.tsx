import React from 'react';
import { cx, usePlugin } from '@tachybase/client';

import { CloseOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';

import WorkflowPlugin, { NodeDefaultView } from '../..';
import { useGetAriaLabelOfAddButton } from '../../hooks/useGetAriaLabelOfAddButton';
import { AddButton } from './components/AddButton';
import { Draggable } from './components/Draggable';
import { Droppable } from './components/Droppable';
import { ProviderContextNode } from './Node.context';
import { useStyles } from './Node.style';

export const Node = ({ data }) => {
  const { styles } = useStyles();
  const { getAriaLabel } = useGetAriaLabelOfAddButton(data);
  const workflowPlugin = usePlugin(WorkflowPlugin);
  const { Component = NodeDefaultView, end, group } = workflowPlugin.instructions.get(data.type);
  return (
    <ProviderContextNode value={{ ...data, group }}>
      <DndContext>
        <div className={cx(styles.nodeBlockClass)}>
          <Droppable></Droppable>
          <Draggable>
            <Component data={data} />
          </Draggable>
          {!end || (typeof end === 'function' && !end(data)) ? (
            <AddButton aria-label={getAriaLabel()} upstream={data} />
          ) : (
            <div className="end-sign">
              <CloseOutlined />
            </div>
          )}
        </div>
      </DndContext>
    </ProviderContextNode>
  );
};

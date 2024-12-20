import React from 'react';
import { cx, usePlugin } from '@tachybase/client';

import { CloseOutlined } from '@ant-design/icons';

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
      <div className={cx(styles.nodeBlockClass)}>
        <Droppable id={data.id}>
          <div
            style={{
              width: 200,
              height: 80,
              backgroundColor: '#f5f5f5',
              border: '1px dashed #ccc',
              borderRadius: 4,
              display: 'block',
              justifyContent: 'center',
            }}
          >
            drop here
          </div>
        </Droppable>
        <Draggable id={data.id}>
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
    </ProviderContextNode>
  );
};

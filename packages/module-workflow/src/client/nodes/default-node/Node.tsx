import React from 'react';
import { cx, usePlugin } from '@tachybase/client';

import { CloseOutlined } from '@ant-design/icons';

import WorkflowPlugin, { NodeDefaultView } from '../..';
import { useGetAriaLabelOfAddButton } from '../../hooks/useGetAriaLabelOfAddButton';
import { AddButton } from './components/AddButton';
import { ProviderContextNode } from './Node.context';
import { useStyles } from './Node.style';

export const Node = ({ data }) => {
  const { styles } = useStyles();
  const { getAriaLabel } = useGetAriaLabelOfAddButton(data);
  const workflowPlugin = usePlugin(WorkflowPlugin);
  const { Component = NodeDefaultView, end } = workflowPlugin.instructions.get(data.type);
  return (
    <ProviderContextNode value={data}>
      <div className={cx(styles.nodeBlockClass)}>
        <Component data={data} />
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

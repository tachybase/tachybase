import React from 'react';
import { useAPIClient } from '@tachybase/client';

import { HolderOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useFlowContext } from '../../../FlowContext';
import { useContextNode } from '../Node.context';

export const DragButton = () => {
  const api = useAPIClient();
  const { workflow, nodes, refresh } = useFlowContext() ?? {};
  const current = useContextNode();

  if (!workflow) {
    return null;
  }
  const resource = api.resource('flow_nodes');

  async function onMoveUp() {
    await resource.moveUp?.({
      filterByTk: current.id,
    });
    refresh();
  }

  return workflow.executed ? null : (
    <Button
      className="workflow-node-drag-button"
      type="text"
      shape="circle"
      icon={<HolderOutlined />}
      onClick={onMoveUp}
    />
  );
};

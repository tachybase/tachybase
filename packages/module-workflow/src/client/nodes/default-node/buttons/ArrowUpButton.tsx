import React from 'react';
import { Icon, useAPIClient } from '@tachybase/client';

import { Button } from 'antd';

import { useFlowContext } from '../../../FlowContext';
import { useContextNode } from '../Node.context';

export const ArrowUpButton = () => {
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
      type="text"
      shape="circle"
      icon={<Icon type="ArrowUpOutlined" />}
      onClick={onMoveUp}
      className="workflow-node-remove-button"
    />
  );
};

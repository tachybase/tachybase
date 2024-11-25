import React from 'react';
import { Icon, useAPIClient } from '@tachybase/client';

import { App, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { useFlowContext } from '../../../FlowContext';
import { useContextNode } from '../Node.context';

export const ArrowDownButton = () => {
  const { t } = useTranslation();
  const api = useAPIClient();
  const { workflow, nodes, refresh } = useFlowContext() ?? {};
  const current = useContextNode();
  const { modal } = App.useApp();

  if (!workflow) {
    return null;
  }
  const resource = api.resource('flow_nodes');

  async function onMoveDown() {
    await resource.moveDown?.({
      filterByTk: current.id,
    });
    refresh();
  }

  return workflow.executed ? null : (
    <Button
      className="workflow-node-down-button"
      type="text"
      shape="circle"
      icon={<Icon type="ArrowDownOutlined" />}
      onClick={onMoveDown}
    />
  );
};

import React from 'react';
import { useAPIClient } from '@tachybase/client';
import { parse } from '@tachybase/utils/client';

import { DeleteOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { useFlowContext } from '../../../FlowContext';
import { lang } from '../../../locale';
import { useContextNode } from '../Node.context';

export const RemoveButton = () => {
  const { t } = useTranslation();
  const api = useAPIClient();
  const { workflow, nodes, refresh } = useFlowContext() ?? {};
  const current = useContextNode();
  const { modal } = App.useApp();

  if (!workflow) {
    return null;
  }
  const resource = api.resource('flow_nodes');

  async function onRemove() {
    async function onOk() {
      await resource.destroy?.({
        filterByTk: current.id,
      });
      refresh();
    }

    const usingNodes = nodes.filter((node) => {
      if (node === current) {
        return false;
      }

      const template = parse(node.config);
      const refs = template.parameters.filter(
        ({ key }) => key.startsWith(`$jobsMapByNodeKey.${current.key}.`) || key === `$jobsMapByNodeKey.${current.key}`,
      );
      return refs.length;
    });

    if (usingNodes.length) {
      modal.error({
        title: lang('Can not delete'),
        content: lang(
          'The result of this node has been referenced by other nodes ({{nodes}}), please remove the usage before deleting.',
          { nodes: usingNodes.map((item) => `#${item.id}`).join(', ') },
        ),
      });
      return;
    }

    const hasBranches = !nodes.find((item) => item.upstream === current && item.branchIndex != null);
    const message = hasBranches
      ? t('Are you sure you want to delete it?')
      : lang('This node contains branches, deleting will also be preformed to them, are you sure?');

    modal.confirm({
      title: t('Delete'),
      content: message,
      onOk,
    });
  }

  return (
    <Button
      className="workflow-node-remove-button"
      type="text"
      shape="circle"
      icon={<DeleteOutlined />}
      onClick={onRemove}
    />
  );
};

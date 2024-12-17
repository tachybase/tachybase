import React, { useCallback, useState } from 'react';
import { cx, useAPIClient, useCompile, usePlugin } from '@tachybase/client';

import WorkflowPlugin from '../../..';
import { useFlowContext } from '../../../FlowContext';
import { NodeConfig } from './NodeConfig';
import useStyles from './NodeDefaultView.style';
import { NodePoint } from './NodePoint';

export const NodeDefaultView = (props) => {
  const { data, children } = props;
  const compile = useCompile();
  const api = useAPIClient();
  const { workflow, refresh } = useFlowContext() ?? {};
  const { styles } = useStyles();
  const workflowPlugin = usePlugin(WorkflowPlugin);
  const instruction = workflowPlugin.instructions.get(data.type);
  const detailText = workflow.executed ? '{{t("View")}}' : '{{t("Configure")}}';
  const typeTitle = compile(instruction.title);
  const { color, icon } = instruction;

  const [editingTitle, setEditingTitle] = useState<string>(data.title ?? typeTitle);
  const [editingConfig, setEditingConfig] = useState(false);

  const onChangeTitle = useCallback(
    async function (next) {
      const title = next || typeTitle;
      setEditingTitle(title);
      if (title === data.title) {
        return;
      }
      await api.resource('flow_nodes').update?.({
        filterByTk: data.id,
        values: {
          title,
        },
      });
      refresh();
    },
    [data],
  );

  const onOpenDrawer = useCallback(function (ev) {
    if (ev.target === ev.currentTarget) {
      setEditingConfig(true);
      return;
    }
    if (ev.target?.classList?.contains('workflow-node-edit')) {
      setEditingConfig(true);
    }
    const whiteSet = new Set(['workflow-node-meta', 'workflow-node-config-button', 'ant-input-disabled']);
    for (let el = ev.target; el && el !== ev.currentTarget && el !== document.documentElement; el = el.parentNode) {
      if ((Array.from(el.classList) as string[]).some((name: string) => whiteSet.has(name))) {
        setEditingConfig(true);
        ev.stopPropagation();
        return;
      }
    }
  }, []);

  return (
    <div className={cx(styles.nodeClass, `workflow-node-type-${data.type}`)}>
      <div
        className={cx(styles.nodeCardClass)}
        role="button"
        aria-label={`${typeTitle}-${editingTitle}`}
        onClick={onOpenDrawer}
      >
        <NodePoint
          color={color}
          icon={icon}
          workflow={workflow}
          editingTitle={editingTitle}
          configuring={editingConfig}
          setEditingTitle={setEditingTitle}
          onChangeTitle={onChangeTitle}
        />
        <NodeConfig
          instruction={instruction}
          data={data}
          detailText={detailText}
          workflow={workflow}
          editingConfig={editingConfig}
          setEditingConfig={setEditingConfig}
        />
      </div>
      {children}
    </div>
  );
};

import React, { useCallback, useMemo } from 'react';
import { css, Icon, useAPIClient, useCompile, usePlugin } from '@tachybase/client';

import { MenuProps } from 'antd';

import WorkflowPlugin from '../../..';
import { useFlowContext } from '../../../FlowContext';
import { lang } from '../../../locale';
import { Instruction } from '../interface';

export function useProps(props) {
  const { upstream, branchIndex = null } = props;
  const engine = usePlugin(WorkflowPlugin);
  const compile = useCompile();
  const api = useAPIClient();
  const { workflow, refresh } = useFlowContext() ?? {};
  const instructionList = Array.from(engine.instructions.getValues()) as Instruction[];

  const groups = useMemo(
    () => getGroups(instructionList, { engine, workflow, upstream, branchIndex, compile }),
    [branchIndex, engine, instructionList, upstream, workflow],
  );

  const onCreate = useCallback(
    async ({ keyPath }) => {
      const type = keyPath.pop();
      const config = {};
      const [optionKey] = keyPath;
      const instruction = engine.instructions.get(type);
      if (optionKey) {
        const { value } = instruction.options?.find((item) => item.key === optionKey) ?? {};
        Object.assign(config, typeof value === 'function' ? value() : value);
      }

      if (workflow) {
        await api.resource('workflows.nodes', workflow.id).create({
          values: {
            type,
            upstreamId: upstream?.id ?? null,
            branchIndex,
            title: compile(instruction.title),
            config,
          },
        });
        refresh();
      }
    },
    [api, branchIndex, engine.instructions, refresh, upstream?.id, workflow],
  );

  const menu = useMemo<MenuProps>(() => {
    return {
      onClick: onCreate,
      items: groups,
    };
  }, [groups, onCreate]);

  return {
    workflow,
    menu,
  };
}

/** 工作流配置列表 */
const NodeConfigList = [
  {
    key: 'control',
    label: lang('Control'),
  },
  {
    key: 'collection',
    label: lang('Collection operations'),
  },
  {
    key: 'manual',
    label: lang('Manual'),
  },
  {
    key: 'extended',
    label: lang('Extended types'),
  },
];

const HotConfig = {
  key: 'hot',
  label: lang('Hot tools'),
};

/** 构造 工作流菜单 menu groups */
function getGroups(instructionList, { engine, workflow, upstream, branchIndex, compile }) {
  const resultList = [];
  // 额外记录 hot 类的工具
  const hotConfigChildrenList = [];

  for (const nodeConfig of NodeConfigList) {
    // 筛选出每类节点数组
    const targetGroups = instructionList.filter(
      (item) =>
        item.group === nodeConfig.key && (item.isAvailable?.({ engine, workflow, upstream, branchIndex }) ?? true),
    );

    // 单个 group 内的子列表, 并选出 hot 类的热门工具
    let childrenList = [];
    for (const itemNode of targetGroups) {
      const { type, title, icon, color, options, isHot } = itemNode;

      const iconNode = renderNodeIcon(icon, color);
      const item = {
        role: 'button',
        'aria-label': type,
        key: type,
        label: compile(title),
        type: options ? 'subMenu' : null,
        icon: iconNode,
        children: options
          ? options.map((option) => ({
              role: 'button',
              'aria-label': option.key,
              key: option.key,
              label: compile(option.label),
            }))
          : null,
      };

      childrenList.push(item);

      //选出 hot 类的热门工具
      if (isHot) {
        hotConfigChildrenList.push(item);
      }
    }

    const targetItem = {
      ...nodeConfig,
      type: 'group',
      children: childrenList,
    };

    resultList.push(targetItem);
  }

  // 将 hot 类的工具, 放在最前面
  resultList.unshift({
    ...HotConfig,
    type: 'group',
    children: hotConfigChildrenList,
  });

  return resultList.filter((group) => group.children.length);
}

// 渲染 node menu 项的 icon
function renderNodeIcon(icon: string, color: string): JSX.Element {
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        margin-right: 10px;
        border-radius: 50%;
        background-color: ${color};
        color: white;

        svg {
          width: 100%;
          height: 100%;
        }
      `}
    >
      <Icon type={icon} />
    </div>
  );
}

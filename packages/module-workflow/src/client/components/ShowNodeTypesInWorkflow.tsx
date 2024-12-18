import React, { useMemo } from 'react';
import { createStyles, cx, useCompile, usePlugin } from '@tachybase/client';

import { GROUP_TAG_DEPRECATED } from '../../common/constants';
import { useFlowContext } from '../FlowContext';
import { useTranslation } from '../locale';
import { NodeConfigList } from '../nodes/default-node/components/AddButton.props';
import { PluginWorkflow } from '../Plugin';

// 收集当前工作流使用的节点信息情况
export const ShowNodeTypesInWorkflow = (props) => {
  const { className } = props;
  const { t } = useTranslation();
  const { styles } = useStyles();
  const compile = useCompile();
  const { instructions } = usePlugin(PluginWorkflow);
  const { nodes } = useFlowContext() ?? {};

  const currentUseNodes: Record<string, string>[] = useMemo(
    () =>
      nodes?.reduce((currList, node) => {
        const instruction = instructions.get(node.type);
        const { group, title } = instruction;

        const targetConfig = NodeConfigList.find((item) => item.key === group);

        const curr = {
          key: group,
          title,
          groupLabel: targetConfig?.label ? targetConfig?.label : t('Unkown group'),
          count: 1,
          isDeprecated: group === GROUP_TAG_DEPRECATED,
        };

        const targetIndex = currList.findIndex((item) => item.key === group);

        if (targetIndex > 0) {
          currList[targetIndex].count++;
        } else {
          currList.push(curr);
        }

        return currList;
      }, []),
    [nodes],
  );

  return (
    <div className={cx(styles.container, className)}>
      <dl>
        <dt>{t('Node list')}</dt>
        <dd>{t('group-title-count')}</dd>
      </dl>
      {currentUseNodes.map(({ key, title, groupLabel, count, isDeprecated }, index) => (
        <p
          key={key}
          className={isDeprecated ? styles.deprecated : ''}
        >{`${index + 1}: ${groupLabel}:${compile(title)}-${count} ${
          isDeprecated ? t('Deprecated, please do not use it') : ''
        }`}</p>
      ))}
    </div>
  );
};

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      margin-bottom: 1.5em;
      padding: 1em;
      background-color: ${token.colorFillAlter};

      > *:last-child {
        margin-bottom: 0;
      }

      dl {
        display: flex;
        align-items: baseline;

        dt {
          color: ${token.colorText};
          &:after {
            content: ':';
            margin-right: 0.5em;
          }
        }
      }

      p {
        color: ${token.colorTextDescription};
      }
    `,

    deprecated: css`
      background-color: yellow;
    `,
  };
});

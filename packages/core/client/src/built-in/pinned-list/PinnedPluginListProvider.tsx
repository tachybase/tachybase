import React, { useContext } from 'react';
import { SchemaOptionsContext } from '@tachybase/schema';

import { createStyles } from 'antd-style';
import { get } from 'lodash';

import { useACLRoleContext } from '../acl';
import { PinnedPluginListContext } from './context';

export const PinnedPluginListProvider = (props: { items: any; children: React.ReactNode }) => {
  const { children, items } = props;
  const ctx = useContext(PinnedPluginListContext);
  return (
    <PinnedPluginListContext.Provider value={{ items: { ...ctx.items, ...items } }}>
      {children}
    </PinnedPluginListContext.Provider>
  );
};

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      display: inline-block;
      .ant-btn {
        border: 0;
        height: 46px;
        width: 46px;
        border-radius: 0;
        background: none;
        color: rgba(255, 255, 255, 0.65);
        &:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
      }
    `,
  };
});

export const PinnedPluginList = () => {
  const { allowAll, snippets } = useACLRoleContext();
  const getSnippetsAllow = (aclKey) => {
    return allowAll || snippets?.includes(aclKey);
  };
  const { styles } = useStyles();
  const ctx = useContext(PinnedPluginListContext);
  const { components } = useContext(SchemaOptionsContext);
  return (
    <div className={styles.container}>
      {Object.keys(ctx.items)
        .sort((a, b) => ctx.items[a].order - ctx.items[b].order)
        .filter((key) => getSnippetsAllow(ctx.items[key].snippet))
        .map((key) => {
          const Action = get(components, ctx.items[key].component);
          return Action ? <Action key={key} /> : null;
        })}
    </div>
  );
};

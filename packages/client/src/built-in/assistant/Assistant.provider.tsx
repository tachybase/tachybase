import React, { useContext, useRef } from 'react';
import { SchemaOptionsContext } from '@tachybase/schema';

import { ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { createStyles } from 'antd-style';
import { get } from 'lodash';
import { useHotkeys } from 'react-hotkeys-hook';

import { Icon } from '../../icon';
import { useDesignable } from '../../schema-component';
import { useACLRoleContext } from '../acl';
import { AssistantListContext } from './context';

export const AssistantProvider = ({ children }) => {
  const { designable, setDesignable } = useDesignable();
  // 快捷键切换编辑状态
  useHotkeys('Ctrl+Shift+U', () => setDesignable(!designable), [designable]);

  return (
    <>
      {children}
      <FloatButton.Group trigger="hover" type="default" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
        <FloatButton
          icon={<Icon type="Design" />}
          type={designable ? 'primary' : 'default'}
          onClick={() => setDesignable(!designable)}
        />
        <AssistantList />
      </FloatButton.Group>
    </>
  );
};

export const AssistantListProvider = (props: { items: any; children: React.ReactNode }) => {
  const { children, items } = props;

  const ctx = useContext(AssistantListContext);
  return (
    <>
      <AssistantListContext.Provider value={{ items: { ...ctx.items, ...items } }}>
        {children}
      </AssistantListContext.Provider>
    </>
  );
};

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    `,
  };
});

export const AssistantList = () => {
  const { allowAll, snippets } = useACLRoleContext();
  const getSnippetsAllow = (aclKey, isPublic = false) => {
    return allowAll || isPublic || snippets?.includes(aclKey);
  };
  const { styles } = useStyles();
  const ctx = useContext(AssistantListContext);
  const { components } = useContext(SchemaOptionsContext);
  return (
    <div className={styles.container}>
      {Object.keys(ctx.items)
        .sort((a, b) => ctx.items[a].order - ctx.items[b].order)
        .filter((key) => getSnippetsAllow(ctx.items[key].snippet, ctx.items[key].isPublic))
        .map((key) => {
          const Action = get(components, ctx.items[key].component);
          return Action ? <Action key={key} /> : null;
        })}
    </div>
  );
};

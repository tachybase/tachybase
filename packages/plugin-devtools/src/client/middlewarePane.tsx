import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CodeMirror, css, useAPIClient, useRequest } from '@tachybase/client';

import { CodeOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { Card, Empty, theme, Tree, TreeDataNode } from 'antd';
import type { DataNode } from 'antd/lib/tree';

import { lang } from './locale';

type Log = string | LogDir;
type LogDir = {
  name: string;
  files: Log[];
};

type MiddlewareNode = {
  name: string;
  belongto: string;
  seq: number;
} & DataNode;

export const MiddlewareToolPane = React.memo((props) => {
  const { token } = theme.useToken();
  const t = useMemoizedFn(lang);
  const api = useAPIClient();
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>(['0']);
  const [searchValue, setSearchValue] = React.useState('');
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);
  const [checkedKeys, setCheckedKeys] = React.useState<string[]>([]);
  const [checkedName, setCheckedName] = React.useState<{ name?: string; belongto?: string; seq?: number }>({
    name: undefined,
    belongto: undefined,
    seq: undefined,
  });
  const [path, setPath] = useState('');
  const { data } = useRequest(() =>
    api
      .resource('middlewares')
      .get()
      .then((res) => res.data?.data),
  );
  useEffect(() => {
    if (checkedName) {
      const foundPath = findPathByName(data, checkedName);
      if (foundPath) {
        setPath(foundPath);
      } else {
      }
    }
  }, [checkedName]);

  const data2tree = useCallback((data, parent: string): DataNode[] => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((log, index: number) => {
      const key = `${parent}-${index}`;
      if (log.files && log.files.length > 0) {
        return {
          title: log.name,
          seq: log.seq,
          belongto: log.belongto,
          key,
          icon: <CodeOutlined />,
          children: data2tree(log.files, key),
        };
      }
      return {
        title: log.name,
        seq: log.seq,
        belongto: log.belongto,
        key,
        icon: <CodeOutlined />,
      };
    });
  }, []);
  const defaultTree: DataNode[] = useMemo(() => {
    const files = data || [];

    return [
      {
        title: t('All'),
        key: '0',
        children: data2tree(files as Log[], '0'),
      },
    ];
  }, [data, data2tree, t]);
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const tree = React.useMemo(() => {
    if (!searchValue) {
      return defaultTree;
    }
    const match = (data: DataNode[]): DataNode[] => {
      const matched = [];
      for (const node of data) {
        const nodeTitle = node.title as string;
        const index = nodeTitle.indexOf(searchValue);
        const beforeStr = nodeTitle.substring(0, index);
        const afterStr = nodeTitle.substring(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: token.colorPrimary }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{nodeTitle}</span>
          );

        if (index > -1) {
          matched.push({ ...node, title });
        } else if (node.children) {
          const children = match(node.children);
          if (children.length) {
            matched.push({ ...node, title, children });
          }
        }
      }
      return matched;
    };
    return match(defaultTree);
  }, [searchValue, defaultTree, token.colorPrimary]);

  return (
    <Card style={{ minHeight: '700px' }}>
      <div
        className={css`
          display: flex;
        `}
      >
        <div
          style={{
            maxHeight: '400px',
            width: '450px',
            overflow: 'auto',
            border: '1px solid',
            marginTop: '6px',
            marginBottom: '10px',
            borderColor: token.colorBorder,
          }}
        >
          {tree.length ? (
            <Tree
              checkable
              showIcon
              showLine
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onExpand={onExpand}
              onCheck={(keys: any) => setCheckedKeys(keys)}
              treeData={tree as MiddlewareNode[]}
              selectable={true}
              onSelect={(selectedKeys, e) => {
                const middlewareName = e.node.title;
                const middleware = {
                  name: String(e.node.title),
                  belongto: e.node.belongto,
                  seq: e.node.seq,
                };

                if (middlewareName) {
                  setCheckedName(middleware);
                } else {
                  setCheckedName(undefined);
                }
              }}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
        <div
          style={{
            maxHeight: '400px',
            overflow: 'auto',
            border: '1px solid',
            marginTop: '6px',
            marginBottom: '10px',
            borderColor: token.colorBorder,
            width: '1005px',
            marginLeft: '10px',
          }}
        >
          {checkedName ? <CodeMirror value={path} width="1000px" height="398px" defaultLanguage="text" /> : null}
        </div>
      </div>
    </Card>
  );
});
MiddlewareToolPane.displayName = 'MiddlewareToolPane';

const getTreeNodeName = (tree, currSelectedKeys, currKey, path) => {
  const selectedKeys = currSelectedKeys.split('-');
  const key = selectedKeys[currKey];
  let currPath = path;
  if (currKey > 0) {
    currPath += `/${tree[key].title}`;
  }
  if (currKey === selectedKeys.length - 1) {
    return currPath;
  }
  if (!tree[key].children) return;
  return getTreeNodeName(tree[key].children, currSelectedKeys, currKey + 1, currPath);
};

function findPathByName(data, checkedName) {
  if (!checkedName || !checkedName.name || !checkedName.belongto || checkedName.seq === undefined) {
    return undefined;
  }
  for (let item of data) {
    if (item.name === checkedName.name && item.belongto === checkedName.belongto && item.seq === checkedName.seq) {
      return item.path;
    }

    if (item.files && item.files.length > 0) {
      const path = findPathByName(item.files, checkedName);
      if (path) return path;
    }
  }

  return null;
}

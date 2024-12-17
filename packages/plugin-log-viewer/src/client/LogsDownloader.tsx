import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CodeMirror, css, useAPIClient, useRequest } from '@tachybase/client';

import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { Alert, Button, Card, Empty, Input, theme, Tree, Typography } from 'antd';
import type { DataNode } from 'antd/lib/tree';

import { useLoggerTranslation } from './locale';

const { Paragraph, Text } = Typography;

type Log = string | LogDir;
type LogDir = {
  name: string;
  files: Log[];
};

const Tips = React.memo(() => {
  const { t } = useLoggerTranslation();
  return (
    <Typography>
      <Paragraph>
        <Text code>[app]/request_*.log</Text> - {t('API request and response logs')}
      </Paragraph>
      <Paragraph>
        <Text code>[app]/system_*.log</Text> -{' '}
        {t('Application, database, plugins and other system logs, the error level logs will be sent to')}{' '}
        <Text code>[app]/system_error_*.log</Text>
      </Paragraph>
      <Paragraph>
        <Text code>[app]/sql_*.log</Text> -{' '}
        {t('SQL execution logs, printed by Sequelize when the db logging is enabled')}
      </Paragraph>
    </Typography>
  );
});
Tips.displayName = 'Tips';

export const LogsDownloader = React.memo((props) => {
  const { token } = theme.useToken();
  const { t: lang } = useLoggerTranslation();
  const t = useMemoizedFn(lang);
  const api = useAPIClient();
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>(['0']);
  const [searchValue, setSearchValue] = React.useState('');
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);
  const [checkedKeys, setCheckedKeys] = React.useState<string[]>([]);
  const [checkedName, setCheckedName] = useState();
  const { data } = useRequest(() =>
    api
      .resource('logger')
      .list()
      .then((res) => res.data?.data),
  );
  const { data: previewData, run } = useRequest(
    {
      url: 'logger:preview',
      method: 'post',
      data: { file: checkedName },
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (checkedName) {
      run();
    }
  }, [checkedName]);
  const data2tree = useCallback(
    (data: Log[], parent: string): DataNode[] =>
      data.map((log: Log, index: number) => {
        const key = `${parent}-${index}`;
        if (typeof log === 'string') {
          return {
            title: log,
            key,
            icon: <FileOutlined />,
          };
        }
        return {
          title: log.name,
          key,
          icon: <FolderOutlined />,
          children: data2tree(log.files, key),
        };
      }),
    [],
  );
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
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const search = (data: DataNode[]) => {
      return data.reduce((acc: DataNode[], node: DataNode) => {
        if ((node.title as string)?.includes(value)) {
          acc.push(node);
        }
        if (node.children) {
          return [...acc, ...search(node.children)];
        }
        return acc;
      }, []);
    };
    const newExpandedKeys = search(defaultTree).map((node: DataNode) => node.key);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
    setCheckedKeys([]);
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

  const Download = () => {
    const getValues = (data: DataNode[], parent: string) => {
      return data.reduce((acc: string[], node: DataNode) => {
        let title = node.title as string;
        title = node.key === '0' ? title : `${parent}/${title}`;
        if (node.children) {
          return [...acc, ...getValues(node.children, node.key === '0' ? '' : title)];
        } else if (checkedKeys.includes(node.key as string) && node.key !== '0') {
          acc.push(title);
        }
        return acc;
      }, []);
    };
    const files = getValues(defaultTree, '');
    if (!files.length) {
      return;
    }
    api
      .request({
        url: 'logger:download',
        method: 'post',
        responseType: 'blob',
        data: {
          files,
        },
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/gzip' }));
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'logs.tar.gz');
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card style={{ minHeight: '700px' }}>
      <Alert message={''} description={<Tips />} type="info" showIcon />
      <Input.Search style={{ marginTop: 16, width: '450px' }} placeholder={t('Search')} onChange={onSearch} />
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
              treeData={tree}
              selectable={true}
              onSelect={(selectedKeys, e: { selected: boolean; selectedNodes; node; event }) => {
                if (!e.node.children) {
                  const name = getTreeNodeName(tree, selectedKeys[0], 0, '');
                  if (name) {
                    setCheckedName(name);
                  } else {
                    setCheckedName(undefined);
                  }
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
          {checkedName ? <CodeMirror value={previewData?.data} width="1000px" height="398px" /> : null}
        </div>
      </div>
      <Button type="primary" onClick={Download}>
        {t('Download')} (.tar.gz)
      </Button>
    </Card>
  );
});
LogsDownloader.displayName = 'LogsDownloader';

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

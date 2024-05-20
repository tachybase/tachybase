export * from './PluginManagerLink';
import type { TableProps } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { useDebounce } from 'ahooks';
import { Button, Card, Col, Divider, Input, List, Result, Row, Space, Spin, Tabs, Table, Tag } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { css } from '@emotion/css';
import { useACLRoleContext } from '../acl/ACLProvider';
import { useRequest } from '../api-client';
import { useToken } from '../style';
import { PluginCard, SwitchAction } from './PluginCard';
import { useStyles } from './style';
import { IPluginData } from './types';
import { fuzzysearch } from '@tachybase/utils/client';

export interface TData {
  data: IPluginData[];
  meta: IMetaData;
}

export interface IMetaData {
  count: number;
  page: number;
  pageSize: number;
  totalPage: number;
  allowedActions: AllowedActions;
}

export interface AllowedActions {
  view: number[];
  update: number[];
  destroy: number[];
}

const columns: TableProps<IPluginData>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Keywords',
    dataIndex: 'keywords',
    key: 'keywords',
    render: (keywords) => keywords?.map((keyword) => <Tag key={keyword}>{keyword}</Tag>),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <SwitchAction {...record} />
      </Space>
    ),
  },
];

const LocalPlugins = () => {
  const { t } = useTranslation();
  const { theme } = useStyles();
  const { data, loading, refresh } = useRequest<TData>({
    url: 'pm:list',
  });

  const [searchValue, setSearchValue] = useState('');
  const filteredList = (data?.data || []).filter(
    (data) => fuzzysearch(searchValue, data.name) || fuzzysearch(searchValue, data.description ?? ''),
  );
  const filterList = useMemo(() => {
    let list = data?.data || [];
    list = list.reverse();
    return [
      {
        type: 'All',
        list: list,
      },
      {
        type: 'Built-in',
        list: _.filter(list, (item) => item.builtIn),
      },
      {
        type: 'Enabled',
        list: _.filter(list, (item) => item.enabled),
      },
      {
        type: 'Not enabled',
        list: _.filter(list, (item) => !item.enabled),
      },
      {
        type: 'Problematic',
        list: _.filter(list, (item) => !item.isCompatible),
      },
    ];
  }, [data?.data]);

  const [filterIndex, setFilterIndex] = useState(0);
  const [keyword, setKeyword] = useState(null);
  const debouncedSearchValue = useDebounce(searchValue, { wait: 100 });

  const keyWordlists = [
    'Data model tools',
    'Data sources',
    'Collections',
    'Collection fields',
    'Blocks',
    'Actions',
    'Workflow',
    'Users & permissions',
    'Authentication',
    'System management',
    'Logging and monitoring',
    'Others',
  ];

  const keyWordsfilterList = useMemo(() => {
    const list = keyWordlists.map((i) => {
      if (i === 'Others') {
        const result = data?.data.filter((v) => !v.keywords || !v.keywords.every((k) => keyWordlists.includes(k)));
        return {
          key: i,
          list: result,
        };
      }
      const result = data?.data.filter((v) => v.keywords?.includes(i));
      return {
        key: i,
        list: result,
      };
    });
    return list;
  }, [keyWordlists]);

  const pluginList = useMemo(() => {
    let list = filterList[filterIndex]?.list || [];
    if (!filterIndex && keyword) {
      list = keyWordsfilterList.find((v) => v.key === keyword).list;
    } else if (filterIndex && keyword) {
      const keyList = keyWordsfilterList.find((v) => v.key === keyword).list;
      list = keyList.filter((value) => list.find((k) => k.name === value.name));
    }
    const searchLowerCaseValue = debouncedSearchValue.toLocaleLowerCase().trim();
    if (searchLowerCaseValue) {
      list = _.filter(
        list,
        (item) =>
          String(item.displayName || '')
            .toLocaleLowerCase()
            .includes(searchLowerCaseValue) ||
          String(item.description || '')
            .toLocaleLowerCase()
            .includes(searchLowerCaseValue),
      );
    }
    return list.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [filterIndex, filterList, debouncedSearchValue, keyword]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  if (loading) {
    return <Spin />;
  }
  return (
    <>
      {/* <div style={{ width: '100%' }}>
        <div
          style={{ marginBottom: theme.marginLG }}
          className={css`
            justify-content: space-between;
            display: flex;
            align-items: center;
          `}
        >
          <div style={{ marginLeft: 200 }}>
            <Space size={theme.marginXXS} split={<Divider type="vertical" />}>
              {filterList.map((item, index) => (
                <a
                  role="button"
                  aria-label={item.type}
                  onClick={() => setFilterIndex(index)}
                  key={item.type}
                  style={{ fontWeight: filterIndex === index ? 'bold' : 'normal' }}
                >
                  {t(item.type)}
                  {filterIndex === index ? `(${pluginList?.length})` : null}
                </a>
              ))}
              <Input
                allowClear
                placeholder={t('Search plugin')}
                onChange={(e) => handleSearch(e.currentTarget.value)}
              />
            </Space>
          </div>
        </div>
        <Row style={{ width: '100%' }} wrap={false}>
          <Col flex="200px">
            <List
              size="small"
              dataSource={keyWordsfilterList}
              split={false}
              renderItem={(item) => {
                return (
                  <List.Item
                    style={{ padding: '3px 0' }}
                    onClick={() => (item.key !== keyword ? setKeyword(item.key) : setKeyword(null))}
                  >
                    <a style={{ fontWeight: keyword === item.key ? 'bold' : 'normal' }}>{t(item.key)}</a>
                  </List.Item>
                );
              }}
            />
          </Col>
          <Col flex="auto">
            <div
              className={css`
                --grid-gutter: ${theme.margin}px;
                --extensions-card-width: calc(25% - var(--grid-gutter) + var(--grid-gutter) / 4);
                display: grid;
                grid-column-gap: var(--grid-gutter);
                grid-row-gap: var(--grid-gutter);
                grid-template-columns: repeat(auto-fill, var(--extensions-card-width));
                justify-content: left;
                margin: auto;
              `}
            >
              {pluginList.map((item) => (
                <PluginCard key={item.name} data={item} />
              ))}
            </div>
          </Col>
        </Row> */}
      <Card
        style={{ marginTop: '8px' }}
        extra={
          <Input
            value={searchValue}
            placeholder="Search by name or descriptions"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        }
      >
        <Table columns={columns} dataSource={filteredList} rowKey="id" />
      </Card>
      {/* </div> */}
    </>
  );
};

const MarketplacePlugins = () => {
  const { token } = useToken();
  const { t } = useTranslation();
  return <div style={{ fontSize: token.fontSizeXL, color: token.colorText }}>{t('Coming soon...')}</div>;
};

export const PluginManager = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { tabName = 'local' } = params;
  const { t } = useTranslation();
  const { snippets = [] } = useACLRoleContext();
  const { styles } = useStyles();

  useEffect(() => {
    const { tabName } = params;
    if (!tabName) {
      navigate(`/admin/pm/list/local/`, { replace: true });
    }
  }, []);

  return snippets.includes('pm') ? (
    <div>
      <PageHeader className={styles.pageHeader} ghost={false} title={t('Plugin manager')}></PageHeader>
      <LocalPlugins />
    </div>
  ) : (
    <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
  );
};

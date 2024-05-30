import React, { useCallback, useEffect, useState } from 'react';
import { ArrayField, RecursionField, Schema, useField, useFieldSchema } from '@tachybase/schema';

import { List as AntdList, Col, PaginationProps } from 'antd';
import { createStyles } from 'antd-style';
import cx from 'classnames';

import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { SortableItem } from '../../common';
import { InfiniteScroll } from '../../common/infinite-scroll/infinite-scroll';
import { SchemaComponentOptions } from '../../core';
import { useDesigner, useProps } from '../../hooks';
import { GridCardBlockProvider, useGridCardBlockContext, useGridCardItemProps } from './GridCard.Decorator';
import { GridCardDesigner } from './GridCard.Designer';
import { GridCardItem } from './GridCard.Item';
import { useGridCardActionBarProps } from './hooks';
import { defaultColumnCount, pageSizeOptions } from './options';

const rowGutter = {
  md: 12,
  sm: 5,
  xs: 5,
};

const useStyles = createStyles(({ css }) => {
  return {
    designer: css`
      width: 100%;
      &:hover {
        > .general-schema-designer {
          display: block;
        }
      }

      > .general-schema-designer {
        position: absolute;
        z-index: 999;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: none;
        background: var(--colorBgSettingsHover);
        border: 0;
        pointer-events: none;
        > .general-schema-designer-icons {
          position: absolute;
          right: 2px;
          top: 2px;
          line-height: 16px;
          pointer-events: all;
          .ant-space-item {
            background-color: var(--colorSettings);
            color: #fff;
            line-height: 16px;
            width: 16px;
            padding-left: 1px;
            align-self: stretch;
          }
        }
      }
    `,
  };
});

const InternalGridCard = (props) => {
  // 新版 UISchema（1.0 之后）中已经废弃了 useProps，这里之所以继续保留是为了兼容旧版的 UISchema
  const { columnCount: columnCountProp, pagination } = useProps(props);
  const { styles } = useStyles();
  const { service, columnCount: _columnCount = defaultColumnCount, needInfiniteScroll } = useGridCardBlockContext();
  const columnCount = columnCountProp || _columnCount;
  const { run, params } = service;
  const meta = service?.data?.meta;
  const fieldSchema = useFieldSchema();

  const field = useField<ArrayField>();
  const Designer = useDesigner();
  const [schemaMap] = useState(new Map());

  const getSchema = useCallback(
    (key) => {
      if (!schemaMap.has(key)) {
        schemaMap.set(
          key,
          new Schema({
            type: 'object',
            properties: {
              [key]: {
                ...fieldSchema.properties['item'],
              },
            },
          }),
        );
      }
      return schemaMap.get(key);
    },
    [fieldSchema.properties, schemaMap],
  );

  const onPaginationChange: PaginationProps['onChange'] = useCallback(
    (page, pageSize) => {
      run({
        ...params?.[0],
        page: page,
        pageSize: pageSize,
      });
    },
    [run, params],
  );

  /* 以下为无限滚动逻辑 */
  // XXX: 需要仔细梳理这里的逻辑, 目前的实现有点效果问题, 刷新不顺滑;
  // 似乎和 tachybase 本身的渲染机制有关, 渲染单个列表项的时候, 总是去取对应的 fieldSchema, 然后赋值上field.value. 这个机制导致了总是会刷新整个区块, 而不是期望的只更新增量部分.
  // HACK: 这里其实是借用原本的翻页刷新机制, 模拟了无限滚动的机制. 没有时间成本去更改上游, 这样处理还算是个比较好的实现
  const [hasMore, setHasMore] = useState(true);
  const [fetchCount, setFetchCount] = useState(1);

  const loadMore = useCallback(async () => {
    const { pageSize = 5 } = meta || {};
    await onPaginationChange(1, fetchCount * pageSize);
    setFetchCount((prevFetchCount) => prevFetchCount + 1);
    setHasMore(false);
  }, [meta, onPaginationChange, setHasMore]);

  useEffect(() => {
    const { count, pageSize = 10, page = 1 } = meta || {};
    const hasMore = count > page * pageSize;
    setHasMore(hasMore);
  }, [meta?.pageSize]);
  /* 以上为无限滚动逻辑 */

  return (
    <SchemaComponentOptions
      scope={{
        useGridCardItemProps,
        useGridCardActionBarProps,
      }}
    >
      <SortableItem className={cx('nb-card-list', styles.designer)}>
        <AntdList
          pagination={
            !meta || meta.count <= meta.pageSize || needInfiniteScroll
              ? false
              : {
                  ...pagination,
                  onChange: onPaginationChange,
                  total: meta?.count || 0,
                  pageSize: meta?.pageSize || 10,
                  current: meta?.page || 1,
                  pageSizeOptions,
                }
          }
          dataSource={field.value}
          grid={{
            ...columnCount,
            sm: columnCount.xs,
            xl: columnCount.lg,
            gutter: [rowGutter, rowGutter],
          }}
          renderItem={(item, index) => {
            const schema = getSchema(index);
            return (
              <Col style={{ height: '100%' }}>
                <RecursionField
                  key={index}
                  basePath={field.address}
                  name={index}
                  onlyRenderProperties
                  schema={schema}
                />
              </Col>
            );
          }}
          loading={service?.loading}
        />
        {needInfiniteScroll && <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />}
        <Designer />
      </SortableItem>
    </SchemaComponentOptions>
  );
};

export const GridCard = withDynamicSchemaProps(InternalGridCard) as typeof InternalGridCard & {
  Item: typeof GridCardItem;
  Designer: typeof GridCardDesigner;
  Decorator: typeof GridCardBlockProvider;
};

GridCard.Item = GridCardItem;
GridCard.Designer = GridCardDesigner;
GridCard.Decorator = GridCardBlockProvider;

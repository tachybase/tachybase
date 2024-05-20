import { css, cx } from '@emotion/css';
import { ArrayField } from '@tachybase/schema';
import { RecursionField, Schema, useField, useFieldSchema } from '@tachybase/schema';
import { List as AntdList, Col, PaginationProps } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { SortableItem } from '../../common';
import { SchemaComponentOptions } from '../../core';
import { useDesigner, useProps } from '../../hooks';
import { GridCardBlockProvider, useGridCardBlockContext, useGridCardItemProps } from './GridCard.Decorator';
import { GridCardDesigner } from './GridCard.Designer';
import { GridCardItem } from './GridCard.Item';
import { useGridCardActionBarProps } from './hooks';
import { defaultColumnCount, pageSizeOptions } from './options';
import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { InfiniteScroll } from '../../common/infinite-scroll/infinite-scroll';

const rowGutter = {
  md: 12,
  sm: 5,
  xs: 5,
};

const designerCss = css`
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
`;

const InternalGridCard = (props) => {
  // 新版 UISchema（1.0 之后）中已经废弃了 useProps，这里之所以继续保留是为了兼容旧版的 UISchema
  const { columnCount: columnCountProp, pagination } = useProps(props);
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
  // XXX: 需要仔细梳理这里的逻辑, 目前的实现有点效果问题
  const [data, setData] = useState(field.value || []);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const { count, pageSize = 10, page = 1 } = meta || {};
    await onPaginationChange(page + 1, pageSize);
    setHasMore(false);
  };

  useEffect(() => {
    const { count, pageSize = 10, page = 1 } = meta || {};
    const hasMore = count > page * pageSize;

    setData((val = []) => {
      const currentVal = field.value || [];
      return [...val, ...currentVal];
    });

    setHasMore(hasMore);
  }, [meta?.page]);

  /* 以上为无限滚动逻辑 */

  return (
    <SchemaComponentOptions
      scope={{
        useGridCardItemProps,
        useGridCardActionBarProps,
      }}
    >
      <SortableItem className={cx('nb-card-list', designerCss)}>
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
          dataSource={needInfiniteScroll ? data : field.value}
          grid={{
            ...columnCount,
            sm: columnCount.xs,
            xl: columnCount.lg,
            gutter: [rowGutter, rowGutter],
          }}
          renderItem={(item, index) => {
            return (
              <Col style={{ height: '100%' }}>
                <RecursionField
                  key={index}
                  basePath={field.address}
                  name={index}
                  onlyRenderProperties
                  schema={getSchema(index)}
                ></RecursionField>
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

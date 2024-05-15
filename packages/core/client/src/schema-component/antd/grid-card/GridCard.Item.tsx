import { css } from '@emotion/css';
import { ObjectField } from '@tachybase/schema';
import { useField, useFieldSchema } from '@tachybase/schema';
import { Card } from 'antd';
import React from 'react';
import { useCollectionParentRecordData } from '../../../data-source/collection-record/CollectionRecordProvider';
import { RecordProvider } from '../../../record-provider';
import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { useNavigate } from 'react-router-dom';

const itemCss = css`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
`;

export const GridCardItem = withDynamicSchemaProps((props) => {
  const field = useField<ObjectField>();
  const fieldSchema = useFieldSchema();
  const parentRecordData = useCollectionParentRecordData();
  const navigate = useNavigate();
  // XXX: 实现的有些丑陋, 需要想想有没有更好的办法
  const handleClick = () => {
    // 1. 依赖schema的层级,不合适
    const parentSchema = fieldSchema?.parent?.parent;
    const isLinkable = parentSchema?.['x-decorator-props']?.isLinkable;
    if (isLinkable) {
      // 2. 固定的链接格式写法,不合适; 需要想个能配置的办法
      navigate('/mobile/:name/:collection/:id');
    }
  };
  return (
    <Card
      role="button"
      aria-label="grid-card-item"
      className={css`
        /* background-color: re/d; */
        height: 100%;
        > .ant-card-body {
          padding: 24px 24px 0px;
          height: 100%;
        }
        .nb-action-bar {
          padding: 5px 0;
        }
      `}
      onClick={handleClick}
    >
      <div className={itemCss}>
        {/* @ts-ignore */}
        <RecordProvider record={field.value} parent={parentRecordData}>
          {props.children}
        </RecordProvider>
      </div>
    </Card>
  );
});

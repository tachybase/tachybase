import React from 'react';
import { useCollection } from '@tachybase/client';
import { ObjectField, useField, useFieldSchema } from '@tachybase/schema';

import { Card } from 'antd';
import { createStyles } from 'antd-style';
import { useNavigate } from 'react-router-dom';

import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { useCollectionParentRecordData } from '../../../data-source/collection-record/CollectionRecordProvider';
import { RecordProvider } from '../../../record-provider';
import { useGridCardDetailUrl } from './hooks';

const useStyles = createStyles(({ css }) => {
  return {
    itemCss: css`
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
    `,
    card: css`
      /* background-color: re/d; */
      height: 100%;
      > .ant-card-body {
        padding: 24px 24px 0px;
        height: 100%;
      }
      .nb-action-bar {
        padding: 5px 0;
      }
    `,
  };
});

export const GridCardItem = withDynamicSchemaProps((props) => {
  const collection = useCollection();
  const field = useField<ObjectField>();
  const fieldSchema = useFieldSchema();
  const parentRecordData = useCollectionParentRecordData();
  const navigate = useNavigate();
  const { styles } = useStyles();
  const detailUrl = useGridCardDetailUrl({ collection, field, fieldSchema });
  // XXX: 实现的有些丑陋, 需要想想有没有更好的办法
  const handleClick = () => {
    // 1. 依赖schema的层级,不合适
    const parentSchema = fieldSchema?.parent?.parent;
    const isLinkable = parentSchema?.['x-decorator-props']?.isLinkable;
    if (isLinkable) {
      // 2. 固定的链接格式写法,不合适; 需要想个能配置的办法
      navigate(detailUrl);
    }
  };
  return (
    <Card role="button" aria-label="grid-card-item" className={styles.card} onClick={handleClick}>
      <div className={styles.itemCss}>
        {/* @ts-ignore */}
        <RecordProvider record={field.value} parent={parentRecordData}>
          {props.children}
        </RecordProvider>
      </div>
    </Card>
  );
});

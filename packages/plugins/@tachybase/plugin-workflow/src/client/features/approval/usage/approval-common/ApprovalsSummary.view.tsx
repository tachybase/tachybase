import React from 'react';
import { useCollectionManager, useCollectionRecordData, useCompile } from '@tachybase/client';

import useStyles from './style';

export const ApprovalsSummary = (props) => {
  const { value = '' } = props;
  const record = useCollectionRecordData();
  const cm = useCollectionManager();
  const compile = useCompile();
  const { styles } = useStyles();

  const { collectionName } = record;
  const results = Object.entries(value).map(([key, objValue]) => {
    const field = cm.getCollectionField(`${collectionName}.${key}`);
    return {
      label: compile(field?.uiSchema?.title || key),
      value: Object.prototype.toString.call(objValue) === '[object Object]' ? objValue?.['name'] : objValue,
    };
  });

  // 展示结果要展示一个数组对象, 是 label 和 value 的形式
  // label 放中文, value 放值
  return (
    <div className={styles.ApprovalsSummaryStyle}>
      {results.map((item) => (
        <div className={`${styles.ApprovalsSummaryStyle}-item`} key={item.label}>
          <div className={`${styles.ApprovalsSummaryStyle}-item-label`}>{`${item.label}:`}&nbsp;&nbsp;&nbsp;</div>
          <div className={`${styles.ApprovalsSummaryStyle}-item-value`}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

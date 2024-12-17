import React from 'react';
import { createStyles, cx } from '@tachybase/client';

import { Button, Tag } from 'antd';

const useStyles = createStyles(({ css }) => ({
  statusButtonClass: css`
    border: none;
    .ant-tag {
      display: inline-grid;
      place-items: center;
      width: 100%;
      height: 100%;
      padding: 0;
      margin-right: 0;
      border-radius: 50%;
      text-align: center;
    }
  `,
  noStatusButtonClass: css`
    border-width: 2px;
  `,
}));

export function StatusButton(props) {
  const { styles } = useStyles();
  let tag = null;
  if (typeof props.status !== 'undefined' && props.statusMap?.[props.status]) {
    const { icon, color } = props.statusMap[props.status];
    tag = <Tag color={color}>{icon}</Tag>;
  }

  return (
    <Button
      {...props}
      shape="circle"
      size="small"
      className={cx(tag ? styles.statusButtonClass : styles.noStatusButtonClass, props.className)}
    >
      {tag}
    </Button>
  );
}

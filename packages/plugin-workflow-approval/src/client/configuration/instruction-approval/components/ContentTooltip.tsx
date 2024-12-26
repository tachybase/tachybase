import React from 'react';
import { useCompile } from '@tachybase/client';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import { useStyles } from './ContentTooltip.style';

export const ContentTooltip = ({ content, tooltip }) => {
  const compile = useCompile();
  const { styles } = useStyles();

  return (
    <>
      <span className={styles.span}>{compile(content)}</span>
      {tooltip && <Tooltip title={compile(tooltip)}>{<QuestionCircleOutlined style={{ color: '#666' }} />}</Tooltip>}
    </>
  );
};

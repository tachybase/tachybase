import React from 'react';
import { createStyles, useCompile } from '@tachybase/client';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const useStyles = createStyles(({ css }) => {
  return {
    span: css`
      & + .anticon {
        margin-left: 0.25em;
      }
    `,
  };
});

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

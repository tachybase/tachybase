import { QuestionCircleOutlined } from '@ant-design/icons';
import { css, useCompile } from '@tachybase/client';
import { Tooltip } from 'antd';
import React from 'react';

export const ContentTooltip = ({ content, tooltip }) => {
  const compile = useCompile();
  return (
    <>
      <span
        className={css`
          & + .anticon {
            margin-left: 0.25em;
          }
        `}
      >
        {compile(content)}
      </span>
      {tooltip && <Tooltip title={compile(tooltip)}>{<QuestionCircleOutlined style={{ color: '#666' }} />}</Tooltip>}
    </>
  );
};

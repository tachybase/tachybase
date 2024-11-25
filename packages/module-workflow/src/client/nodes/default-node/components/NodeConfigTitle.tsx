import React from 'react';
import { css } from '@tachybase/client';

import { Tag, Tooltip } from 'antd';

import { lang } from '../../../locale';

const NodeConfigTitle = (props) => {
  const { data } = props;
  return (
    <div
      className={css`
        display: flex;
        justify-content: space-between;

        strong {
          font-weight: bold;
        }

        .ant-tag {
          margin-inline-end: 0;
        }

        code {
          font-weight: normal;
        }
      `}
    >
      <strong>{data.title}</strong>
      <Tooltip title={lang('Variable key of node')}>
        <Tag>
          <code>{data.key}</code>
        </Tag>
      </Tooltip>
    </div>
  );
};

export function renderNodeConfigTitle(data) {
  return <NodeConfigTitle data={data} />;
}

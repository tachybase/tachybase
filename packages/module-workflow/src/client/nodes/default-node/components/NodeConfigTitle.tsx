import React from 'react';
import { css } from '@tachybase/client';

import { Tag, Tooltip } from 'antd';

import { GROUP_TAG_DEPRECATED } from '../../../../common/constants';
import { lang } from '../../../locale';

const NodeConfigTitle = (props) => {
  const { data, instruction } = props;
  const isDeprecated = instruction?.group === GROUP_TAG_DEPRECATED;

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
      <strong>
        {isDeprecated ? `(${lang('Deprecated')}) ` : ''}
        {data.title}
      </strong>
      <Tooltip title={lang('Variable key of node')}>
        <Tag>
          <code>{data.key}</code>
        </Tag>
      </Tooltip>
    </div>
  );
};

export function renderNodeConfigTitle(data, instruction) {
  return <NodeConfigTitle data={data} instruction={instruction} />;
}

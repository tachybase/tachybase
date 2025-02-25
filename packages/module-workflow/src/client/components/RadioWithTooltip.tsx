import React from 'react';
import { css, useCompile } from '@tachybase/client';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Radio, Space, Tooltip } from 'antd';

export interface RadioWithTooltipOption {
  value: any;
  label: string;
  tooltip?: string;
}

export function RadioWithTooltip(props) {
  const { options = [], direction, ...other } = props;
  const compile = useCompile();

  return (
    <Radio.Group {...other}>
      <Space direction={direction}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value}>
            <span
              className={css`
                & + .anticon {
                  margin-left: 0.25em;
                }
              `}
            >
              {compile(option.label)}
            </span>
            {option.tooltip && (
              <Tooltip title={compile(option.tooltip)}>
                <QuestionCircleOutlined style={{ color: '#666' }} />
              </Tooltip>
            )}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
}

import React from 'react';
import { css, EllipsisWithTooltip, Input, Variable } from '@tachybase/client';

import { useVariableOptions } from '../../scopes/useVariableOptions';

export const getSchemaFieldPath = (params) => {
  const { t, path, setFormValue, scCtx } = params;

  return {
    name: 'path',
    title: 'URL',
    required: true,
    default: path,
    'x-decorator': 'FormItem',
    'x-decorator-props': {
      feedbackLayout: 'popover',
      addonBefore: (
        <EllipsisWithTooltip ellipsis>
          <Input.ReadPretty value={scCtx?.dataSourceData?.data?.options?.baseUrl} />
        </EllipsisWithTooltip>
      ),
      validator: {
        required: true,
        message: t('Path is required'),
      },
      className: css`
        .ant-formily-item-addon-before {
          border-width: 1px;
          border-style: solid;
          border-color: #d9d9d9;
          padding: 0px 5px;
          margin-right: 0px;
          background: rgba(0, 0, 0, 0.02);
          border-right: 0px;
          margin-inline-end: 0px !important;
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
          .ant-description-input {
            white-space: nowrap;
            max-width: 230px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `,
      style: { width: '100%' },
    },

    'x-component': Variable.RawTextArea,
    'x-component-props': {
      defaultValue: path,
      autoSize: true,
      onChange: (val) => {
        setFormValue(val.target.value, 'path');
      },
      scope: useVariableOptions,
      fieldNames: {
        value: 'name',
        label: 'title',
      },
      style: {
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0',
      },
    },
  };
};

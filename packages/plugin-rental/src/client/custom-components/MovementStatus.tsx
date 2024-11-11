import React from 'react';
import { css, useCollectionManager } from '@tachybase/client';
import { observer, useField, useForm } from '@tachybase/schema';

import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';

import { useCompany } from '../hooks';

export const MovementStatus = observer(
  (props: any) => {
    const form = useForm();
    const field = useField();
    const contarct = form.getValuesIn(field.path.slice(0, 2).entire);
    const { name: appendLeft } = sliceCompany(props.value === '-1' ? props.left : props.right);
    const { name: appendRight } = sliceCompany(props.value === '-1' ? props.right : props.left);
    const { data: company } = useCompany([appendLeft, appendRight], contarct?.contract?.id);
    const cm = useCollectionManager();
    const titleField = cm.getCollection('company').titleField;
    const left = company?.data[0] ? company?.data[0][appendLeft]?.[titleField] : '-';
    const right = company?.data[0] ? company?.data[0][appendRight]?.[titleField] : '-';
    return (
      <span
        className={css`
          display: inline-flex;
          width: 100%;
          justify-content: center;
        `}
        onClick={() => props.onChange(props.value === '-1' ? '1' : '-1')}
      >
        <Tag>{left}</Tag>
        <ArrowRightOutlined
          className={css`
            margin-left: 6px;
            margin-right: 8px;
          `}
        />
        <Tag>{right}</Tag>
      </span>
    );
  },
  { displayName: 'MovementStatus' },
);

const sliceCompany = (props) => {
  const company = { name: '' };
  if (props) {
    const match = props.match(/{{[^.]*\.(.*)}}/)[1];
    company.name = match;
  }
  return company;
};

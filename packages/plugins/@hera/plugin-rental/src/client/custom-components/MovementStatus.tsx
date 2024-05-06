import { ArrowRightOutlined } from '@ant-design/icons';
import { observer, useField, useForm } from '@tachybase/schema';
import { Col, Row, Tag } from 'antd';
import React from 'react';
import { useCompany } from '../hooks';
import { useCollectionManager } from '@nocobase/client';

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
      <Row justify="space-between">
        <Col flex={2}>
          <Tag>{left}</Tag>
        </Col>
        <Col flex={1}>
          <ArrowRightOutlined onClick={() => props.onChange(props.value === '-1' ? '1' : '-1')} />
        </Col>
        <Col flex={2}>
          <Tag>{right}</Tag>
        </Col>
      </Row>
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

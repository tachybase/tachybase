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
    const left = sliceCompany(props.value === '-1' ? props.left : props.right, contarct.contract);
    const right = sliceCompany(props.value === '-1' ? props.right : props.left, contarct.contract);
    const cm = useCollectionManager();
    const titleField = cm.getCollection('company').titleField;
    const { data: company } = useCompany(left['id'], right['id']);
    return (
      <Row justify="space-between">
        <Col flex={2}>
          <Tag>{company?.data?.find((value) => value.id === left['id'])?.[titleField]}</Tag>
        </Col>
        <Col flex={1}>
          <ArrowRightOutlined onClick={() => props.onChange(props.value === '-1' ? '1' : '-1')} />
        </Col>
        <Col flex={2}>
          <Tag>{company?.data?.find((value) => value.id === right['id'])?.[titleField]}</Tag>
        </Col>
      </Row>
    );
  },
  { displayName: 'MovementStatus' },
);

const sliceCompany = (props, contarct) => {
  const company = {};
  if (props && contarct) {
    const match = props.match(/{{[^.]*\.(.*)}}/)[1];
    const key = Object.keys(contarct).find((value) => value.includes(match));
    company['id'] = contarct[key];
  }
  return company;
};

import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { Col, Row } from 'antd';

import { useDepartmentFilterActionProps } from '../scopes/useDepartmentFilterActionProps';
import { DepartmentsBlock } from './DepartmentsBlock';
import { DepartmentSelect } from './DepartmentSelect';
import { DepartmentsResourceProvider } from './DepartmentsResourceProvider';
import { DepartmentsUsersBlock } from './DepartmentsUsersBlock';
import { SuperiorDepartmentSelect } from './SuperiorDepartmentSelect';
import { UserResourceProvider } from './UserResourceProvider';

export const DepartmentManagement = () => {
  return (
    <SchemaComponentOptions
      components={{ SuperiorDepartmentSelect, DepartmentSelect }}
      scope={{ useFilterActionProps: useDepartmentFilterActionProps }}
    >
      <Row gutter={48} style={{ flexWrap: 'nowrap' }}>
        <Col span={6} style={{ borderRight: '1px solid #eee', minWidth: '300px' }}>
          <DepartmentsResourceProvider>
            <DepartmentsBlock />
          </DepartmentsResourceProvider>
        </Col>
        <Col flex="auto" style={{ overflow: 'hidden' }}>
          <UserResourceProvider>
            <DepartmentsUsersBlock />
          </UserResourceProvider>
        </Col>
      </Row>
    </SchemaComponentOptions>
  );
};

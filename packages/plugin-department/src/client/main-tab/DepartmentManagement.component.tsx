import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { Col, Row } from 'antd';

import { useDepartmentFilterActionProps } from '../common/scopes/useDepartmentFilterActionProps';
import { DepartmentSelect } from './components/DepartmentSelect';
import { SuperiorDepartmentSelect } from './components/SuperiorDepartmentSelect';
import { DepartmentsBlock } from './departments-block/DepartmentsBlock';
import { ViewDepartmentsUsersBlock } from './departments-users-block/DepartmentsUsersBlock';
import { ProviderDepartmentsResource } from './providers/DepartmentsResource.provider';
import { ProviderUserResource } from './providers/UserResource.provider';

export const DepartmentManagement = () => (
  <SchemaComponentOptions
    components={{
      SuperiorDepartmentSelect,
      DepartmentSelect,
    }}
    scope={{
      useFilterActionProps: useDepartmentFilterActionProps,
    }}
  >
    <Row
      gutter={48}
      style={{
        flexWrap: 'nowrap',
      }}
    >
      <Col
        span={6}
        style={{
          borderRight: '1px solid #eee',
          minWidth: '300px',
        }}
      >
        <ProviderDepartmentsResource>
          <DepartmentsBlock />
        </ProviderDepartmentsResource>
      </Col>
      <Col
        flex="auto"
        style={{
          overflow: 'hidden',
        }}
      >
        <ProviderUserResource>
          <ViewDepartmentsUsersBlock />
        </ProviderUserResource>
      </Col>
    </Row>
  </SchemaComponentOptions>
);

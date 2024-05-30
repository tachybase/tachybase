// import { jsx, jsxs } from 'react/jsx-runtime';
import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { Col, Row } from 'antd';

import { useFilterActionPropsZ } from '../scopes/useFilterActionPropsZ';
import { CeComponent } from './CeComponent';
import { BeComponent } from './ComponentBe';
import { ComponentEEE } from './ComponentEEE';
import { ComponentIit } from './ComponentIit';
import { DepartmentSelect } from './DepartmentSelect';
import { SuperiorDepartmentSelect } from './SuperiorDepartmentSelect';

export const DepartmentManagement = () => {
  return (
    <SchemaComponentOptions
      components={{ SuperiorDepartmentSelect, DepartmentSelect }}
      scope={{ useFilterActionProps: useFilterActionPropsZ }}
    >
      <Row gutter={48} style={{ flexWrap: 'nowrap' }}>
        <Col span={6} style={{ borderRight: '1px solid #eee', minWidth: '300px' }}>
          <CeComponent>
            <ComponentEEE />
          </CeComponent>
        </Col>
        <Col flex="auto" style={{ overflow: 'hidden' }}>
          <BeComponent>
            <ComponentIit />
          </BeComponent>
        </Col>
      </Row>
    </SchemaComponentOptions>
  );
  // return jsx(SchemaComponentOptions, {
  //   components: {
  //     SuperiorDepartmentSelect: SuperiorDepartmentSelect,
  //     DepartmentSelect: DepartmentSelect,
  //   },
  //   scope: {
  //     useFilterActionProps: useFilterActionPropsZ,
  //   },

  //   children: jsxs(Row, {
  //     gutter: 48,
  //     style: { flexWrap: 'nowrap' },
  //     children: [
  //       jsx(Col, {
  //         span: 6,
  //         style: { borderRight: '1px solid #eee', minWidth: '300px' },
  //         children: jsx(CeComponent, { children: jsx(ComponentEEE, {}) }),
  //       }),
  //       jsx(Col, {
  //         flex: 'auto',
  //         style: { overflow: 'hidden' },
  //         children: jsx(BeComponent, { children: jsx(ComponentIit, {}) }),
  //       }),
  //     ],
  //   }),
  // });
};

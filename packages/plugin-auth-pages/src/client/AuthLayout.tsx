import React from 'react';
import { css, PoweredBy, useAPIClient, useRequest, useSystemSettings } from '@tachybase/client';
import { AuthenticatorsContext } from '@tachybase/module-auth/client';

import { Col, Row } from 'antd';
import { Outlet } from 'react-router-dom';

import authImg from './image.png';

export function CustomAuthLayout() {
  const { data } = useSystemSettings();
  const api = useAPIClient();
  const { data: authenticators = [], error } = useRequest(() =>
    api
      .resource('authenticators')
      .publicList()
      .then((res) => {
        return res?.data?.data || [];
      }),
  );

  return (
    <Row style={{ height: '100%' }}>
      <Col xs={{ span: 0 }} md={{ span: 12 }}>
        <img
          src={authImg}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            display: 'block',
            verticalAlign: 'middle',
          }}
        />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <div
          style={{
            maxWidth: 320,
            margin: '0 auto',
            paddingTop: '20vh',
          }}
        >
          <h1>{data?.data?.title}</h1>
          <AuthenticatorsContext.Provider value={authenticators as any}>
            <Outlet />
          </AuthenticatorsContext.Provider>
          <div
            className={css`
              position: absolute;
              bottom: 24px;
              width: 100%;
              left: 0;
              text-align: center;
            `}
          >
            <PoweredBy />
          </div>
        </div>
      </Col>
    </Row>
  );
}

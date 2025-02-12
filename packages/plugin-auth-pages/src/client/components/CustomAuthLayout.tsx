import { css, PoweredBy } from '@tachybase/client';
import { AuthenticatorsContext } from '@tachybase/module-auth/client';

import { Col, Row } from 'antd';
import { Outlet } from 'react-router-dom';

import accountBg from '../assets/account-bg.webp';
import { useProps } from './CustomAuthLayout.props';
import { useStyles } from './CustomAuthLayout.style';

export const CustomAuthLayout = () => {
  const { title, authenticators } = useProps();
  const { styles } = useStyles();
  return (
    <Row className={styles.customAuthLayout}>
      <Col xs={{ span: 0 }} md={{ span: 12 }}>
        <div className="account-bg"></div>
        {/* <img
          src={accountBg}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            display: 'block',
            verticalAlign: 'middle',
          }}
        /> */}
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <div
          style={{
            maxWidth: 320,
            margin: '0 auto',
            paddingTop: '20vh',
          }}
        >
          <h1>{title}</h1>
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
};

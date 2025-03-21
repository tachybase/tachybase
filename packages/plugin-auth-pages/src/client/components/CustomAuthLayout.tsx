import { PoweredBy } from '@tachybase/client';
import { AuthenticatorsContext } from '@tachybase/module-auth/client';

import { Col, Row } from 'antd';
import { Outlet } from 'react-router-dom';

import { useProps } from './CustomAuthLayout.props';
import { useStyles } from './CustomAuthLayout.style';
import { LanguageSwitcher } from './LanguageSwitcher';

export const CustomAuthLayout = () => {
  const { title, authenticators } = useProps();
  const { styles } = useStyles();
  return (
    <Row className={styles.customAuthLayout}>
      <Col xs={{ span: 0 }} md={{ span: 14 }}>
        <a className="account-logo" href="https://www.tachybase.com" target="_self">
          <img
            className="logo-img"
            src="https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/ff3d4d2bc63ed3b26ec1852fcc173db4.png"
            alt=""
          />
        </a>
        <div className="account-bg"></div>
      </Col>
      <Col className="account-wrapper" xs={{ span: 24 }} md={{ span: 10 }}>
        <div className="account-languagetoggle">
          <LanguageSwitcher />
        </div>
        <div className="account-container">
          <h1>{title}</h1>
          <AuthenticatorsContext.Provider value={authenticators as any}>
            <Outlet />
          </AuthenticatorsContext.Provider>
        </div>
        <div className={'account-poweredby'}>
          <PoweredBy />
        </div>
      </Col>
    </Row>
  );
};

import { PoweredBy, useTranslation } from '@tachybase/client';
import { AuthenticatorsContext } from '@tachybase/module-auth/client';

import { Col, Row } from 'antd';
import { Outlet } from 'react-router-dom';

import logoZH from '../assets/tachybase-light-blue-zh.png';
import logoEN from '../assets/tachybase-light-blue.png';
import styles from './CustomAuthLayout.module.css';
import { useProps } from './CustomAuthLayout.props';
import { LanguageSwitcher } from './LanguageSwitcher';

export const CustomAuthLayout = () => {
  const { title, authenticators } = useProps();
  const { i18n } = useTranslation();
  const logoUrl = i18n.language === 'zh-CN' ? logoZH : logoEN;
  return (
    <Row className={styles['custom-authLayout']}>
      <Col xs={{ span: 0 }} md={{ span: 14 }}>
        <a className={styles['account-logo']} href="https://www.tachybase.com" target="_self">
          <img className={styles['logo-img']} src={logoUrl} alt="" />
        </a>
        <div className={styles['account-bg']}></div>
      </Col>
      <Col className={styles['account-wrapper']} xs={{ span: 24 }} md={{ span: 10 }}>
        <div className={styles['account-languagetoggle']}>
          <LanguageSwitcher />
        </div>
        <div className={styles['account-container']}>
          <h1>{title}</h1>
          <AuthenticatorsContext.Provider value={authenticators as any}>
            <Outlet />
          </AuthenticatorsContext.Provider>
        </div>
        <div className={styles['account-poweredby']}>
          <PoweredBy />
        </div>
      </Col>
    </Row>
  );
};

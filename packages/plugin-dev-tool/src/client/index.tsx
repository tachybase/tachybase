import React, { lazy } from 'react';
import { createStyles, Plugin } from '@tachybase/client';

import { RightOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { NAMESPACE } from '../locale';
import { MiddlewareToolPane } from './middlewarePane';

const DOCUMENTATION_PATH = '/api-documentation';
const Documentation = lazy(() => import('./Document'));

export const useStyles = createStyles(({ css, token }) => {
  return css`
    position: relative;
    background: ${token.colorBgContainer};
    padding: ${token.paddingMD}px;
    .open-tab {
      position: absolute;
      right: 0;
      top: 0;
    }
  `;
});

const SCDocumentation = () => {
  const { styles } = useStyles();
  return (
    <div className={styles}>
      <div className="open-tab">
        <Tooltip title="Preview">
          <a href={DOCUMENTATION_PATH} target="_blank" rel="noreferrer">
            <Button size="small" icon={<RightOutlined />} />
          </a>
        </Tooltip>
      </div>
      <Documentation />
    </div>
  );
};

export class PluginDevToolClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.systemSettingsManager.add('devTool', {
      title: `{{t("Dev tool")}}`,
      icon: 'ToolOutlined',
    });
    this.app.systemSettingsManager.add('devTool.middleware', {
      title: `{{t('Middleware')}}`,
      icon: 'CodeOutlined',
      Component: MiddlewareToolPane,
    });
    this.app.systemSettingsManager.add('devTool.apidoc', {
      title: `{{t('API documentation', { ns: "${NAMESPACE}" })}}`,
      icon: 'BookOutlined',
      Component: SCDocumentation,
      aclSnippet: 'pm.api-doc.documentation',
    });
    this.app.router.add('api-documentation', {
      path: DOCUMENTATION_PATH,
      Component: Documentation,
    });
  }
}

export default PluginDevToolClient;

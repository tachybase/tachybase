import React, { useEffect, useState } from 'react';
import { SchemaComponent, useAPIClient, useGlobalTheme } from '@tachybase/client';
import { Authenticator } from '@tachybase/plugin-auth/client';
import { ISchema } from '@tachybase/schema';

import { useLocation } from 'react-router-dom';

import { useTranslation } from '../locale';
import WeChatQrComponent from './wechat-qr-component';

const qrForm: ISchema = {
  type: 'object',
  name: 'qrForm',
  'x-component': 'Form',
  properties: {
    qrCode: {
      type: 'string',
      'x-component': 'WeChatQrComponent',
      'x-component-props': {
        style: { width: '100%' },
        value: { config: '{{ wcQrCfg }}' },
      },
      'x-decorator': 'FormItem',
    },
    tip: {
      type: 'void',
      'x-component': 'div',
      'x-content': '{{t("User will be registered automatically if not exists.")}}',
      'x-component-props': { style: { color: '#ccc' } },
      'x-visible': '{{ autoSignUp }}',
    },
  },
};

export const SignInForm = (props: { authenticator: Authenticator }) => {
  const authenticator = props.authenticator;
  const { name, options } = authenticator;
  const autoSignUp = !!options?.autoSignUp;
  const { t } = useTranslation();
  const api = useAPIClient();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const redirect = urlSearchParams.get('redirect');
  const { theme } = useGlobalTheme();
  const isDark = theme.name.toLowerCase().includes('dark');
  const wcQrStyle = isDark ? 'white' : 'black';

  const [wcQrCfg, setWcQrCfg] = useState(null);

  useEffect(() => {
    const fetchAuthConfig = async () => {
      try {
        const result = await api.request({
          method: 'post',
          url: 'wechatAuth:getAuthCfg',
          headers: { 'X-Authenticator': authenticator.name },
          data: { redirect },
        });
        const cfg = result?.data?.data;

        const wcQrCfg = {
          self_redirect: false,
          id: 'wechat_qr_container',
          appid: cfg.appId,
          scope: cfg.scope,
          redirect_uri: cfg.redirectUrl,
          state: cfg.state,
          style: wcQrStyle,
          stylelite: 1,
          fast_login: 1,
          href: '',
        };

        setWcQrCfg(wcQrCfg);

        const script = document.createElement('script');
        script.async = true;
        script.innerHTML = `
          (function() {
            var wxScript = document.createElement('script');
            wxScript.src = '//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
            wxScript.async = true;
            wxScript.onload = function() {
              new WxLogin(${JSON.stringify(wcQrCfg)});
            };
            document.body.appendChild(wxScript);
          })();
        `;
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error('Error fetching auth config:', error);
      }
    };

    fetchAuthConfig();
  }, [api, authenticator.name, redirect, wcQrStyle]);

  if (!wcQrCfg) {
    return <div>Loading...</div>;
  }
  return <SchemaComponent schema={qrForm} scope={{ wcQrCfg, autoSignUp }} components={{ WeChatQrComponent }} />;
};

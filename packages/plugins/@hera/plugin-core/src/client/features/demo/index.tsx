import React, { useContext, useEffect } from 'react';
import {
  CollectionProvider,
  css,
  Grid,
  i18n,
  Plugin,
  SchemaComponent,
  SchemaComponentContext,
  useAPIClient,
  useRequest,
  useTranslation,
  useViewport,
} from '@tachybase/client';
import { FormItem, FormLayout } from '@tachybase/components';
import { formSchema } from '@tachybase/plugin-multi-app-manager/client';
import { createForm, useField, useForm } from '@tachybase/schema';

import { Alert } from 'antd';

const ft = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js';
const sceneId = 'jruas0rs';
const prefix = '1bze12';
const changeLang = (locale = 'zh-CN') => {
  const e = { language: 'cn', region: 'cn' };
  return { 'zh-CN': e, 'en-US': { language: 'en', region: 'sgp' } }[locale] || e;
};
const Captcha = (t) => {
  const { request, onSuccess, onError, language = 'zh-CN' } = t;
  const getInstance = () => {};
  const captchaVerifyCallback = async (param) => {
    try {
      return await request({ captchaVerifyParam: param, sceneId }), { captchaResult: true };
    } catch (s) {
      return onError == null || onError(s), { captchaResult: false };
    }
  };
  const onBizResultCallback = () => {
    onSuccess == null || onSuccess();
  };

  useEffect(() => {
    const dynamicScript = document.createElement('script');
    dynamicScript.type = 'text/javascript';
    dynamicScript.src = ft;
    dynamicScript.onload = () => {
      // @ts-ignore
      window.initAliyunCaptcha({
        SceneId: sceneId,
        prefix: prefix,
        mode: 'embed',
        element: '#captcha-element',
        button: '#deploy',
        captchaVerifyCallback: captchaVerifyCallback,
        onBizResultCallback: onBizResultCallback,
        getInstance: getInstance,
        slideStyle: { width: 360, height: 40 },
        ...changeLang(language),
      });
    };
    document.head.appendChild(dynamicScript);
  });
  return (
    <div
      id="captcha-element"
      className={css`
        margin-top: 24px;
        #aliyunCaptcha-window-embed {
          z-index: 0;
        }
        #aliyunCaptcha-sliding-body {
          width: 100% !important;
        }
      `}
    />
  );
};
i18n.addResources('zh-CN', 'demo', {
  'Deploy a demo site': '开通 tachybase 体验站点',
  Email: '电子邮箱',
  Yes: '是',
  No: '否',
  'Application template': '应用模板',
  'Are you a developer': '你是一名开发者吗',
  'Deploy Now': '立即开通',
  Industry: '所在行业',
  'Please fill in the necessary information and the demo site will be automatically created within one minute.':
    '请填写必要的信息，体验站将在一分钟内自动创建成功。',
  'Demo site deployed successfully!': '体验站点开通成功！',
  'What you want to do with tachybase': '你希望用 tachybase 来做什么',
  'Used to receive demo site information, please be sure to fill in correctly': '用于接收体验站点信息，请务必正确填写',
  'Please briefly describe the purpose': '请简要描述用途，方便我们后续针对性的开发',
  'Please briefly describe your industry': '请简要描述你所在的行业，方便我们后续针对性的开发',
});
const DemoProvider = React.createContext(null);
function useApplicationAction() {
  const api = useAPIClient();
  const form = useForm();
  const field = useField();
  const [, setSuccess] = useContext(DemoProvider);
  return {
    async run() {
      await form.submit();
      field.data = field.data || {};
      field.data.loading = true;
      try {
        await api.request({ url: 'applicationForms:create', method: 'post', data: form.values });
        field.data.loading = false;
        setSuccess(true);
      } catch (a) {
        field.data.loading = false;
      }
    },
  };
}
export function DemoApplyForm() {
  useViewport();
  const schemaComponentContext = React.useContext(SchemaComponentContext);
  const [isSuccess, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const api = useAPIClient();
  // @ts-ignore
  const { t, i18n } = useTranslation('demo');
  const form = createForm();
  const { data, loading: isLoading } = useRequest({ url: 'applicationForms:getTemplateNameUiSchema' });
  const onRequest = async (requestData) => {
    await form.validate();
    await api.request({ url: 'applicationForms:create', method: 'post', data: { ...form.values, ...requestData } });
  };
  return isLoading ? null : (
    <div style={{ margin: '0 auto', paddingTop: '15vh', paddingBottom: 50, maxWidth: 350 }}>
      <title>{[t('Deploy a demo site'), ' - tachybase']}</title>
      {isSuccess ? (
        <Alert
          message={t('Demo site deployed successfully!')}
          description={
            i18n.language === 'zh-CN' ? (
              <div>
                你将在几秒钟内收到邮件，其中包含体验站点的地址、账号和 密码。
                <br />
                该站点仅用于预览，你在体验站点所作的操作、所存储的数据 可能会丢失。
                <br />
                该站点将会在 48 小时后失效，之后你可以重新申请体验站点。
              </div>
            ) : (
              <div>
                You will receive an email in a few seconds with the URL, username and password of the demo site.
                <br />
                The site is for preview purposes only, your actions and data stored on the site may be lost.
                <br />
                The site will expire after 48 hours, after which you can reapply for the site.
              </div>
            )
          }
          type="success"
        />
      ) : (
        <div style={{ marginTop: 16 }}>
          <DemoProvider.Provider value={[isSuccess, setSuccess]}>
            <CollectionProvider name={(data as any)?.data?.collection}>
              <SchemaComponentContext.Provider value={{ ...schemaComponentContext, designable: false }}>
                <SchemaComponent
                  components={{
                    FormLayout,
                    FormItem,
                    Grid,
                    Captcha,
                  }}
                  scope={{ useApplicationAction }}
                  schema={{
                    name: 'appform',
                    type: 'object',
                    'x-component': 'FormV2',
                    'x-use-component-props': () => ({ form: form }),
                    properties: {
                      layout: {
                        type: 'void',
                        'x-component': 'FormLayout',
                        'x-component-props': { layout: 'vertical' },
                        properties: { div: (data as any)?.data?.schema },
                      },
                      captcha: {
                        type: 'void',
                        'x-component': 'Captcha',
                        'x-component-props': {
                          request: onRequest,
                          language: i18n.language,
                          onSuccess: () => {
                            setSuccess(true), setLoading(false);
                          },
                          onError: () => {
                            setLoading(false);
                          },
                        },
                      },
                      actions: {
                        type: 'void',
                        'x-component': 'div',
                        'x-component-props': { id: 'deploy' },
                        properties: {
                          submit: {
                            type: 'void',
                            title: t('Deploy Now'),
                            'x-component': 'Action',
                            'x-component-props': {
                              block: true,
                              loading: loading,
                              type: 'primary',
                              style: { width: '100%' },
                            },
                          },
                        },
                      },
                    },
                  }}
                />
              </SchemaComponentContext.Provider>
            </CollectionProvider>
          </DemoProvider.Provider>
        </div>
      )}
    </div>
  );
}
export class PluginDemo extends Plugin {
  async load() {
    formSchema.properties['options.isTemplate'] = {
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-content': 'As an application template',
    };
    formSchema.properties['options.persistent'] = {
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-content': 'Persistent',
    };
    this.router.add('new', { path: '/new', Component: DemoApplyForm });
  }
}

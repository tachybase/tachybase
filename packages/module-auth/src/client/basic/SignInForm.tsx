import React, { useCallback } from 'react';
import { SchemaComponent, useAPIClient, useApp, useCurrentUserContext } from '@tachybase/client';
import { ISchema, useForm } from '@tachybase/schema';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { TrackingEventType } from '../../../../module-instrumentation/src/client/CustomInstrumentation';
import { Authenticator } from '../authenticator';
import { useAuthTranslation } from '../locale';
import { useSignUpForms } from '../pages';

export function useRedirect(next = '/admin') {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  return useCallback(() => {
    navigate(searchParams.get('redirect') || '/admin', { replace: true });
  }, [navigate, searchParams]);
}

export const useSignIn = (authenticator: string) => {
  const form = useForm();
  const api = useAPIClient();
  const redirect = useRedirect();
  const app = useApp();
  const { refreshAsync } = useCurrentUserContext();
  const getDeviceInfo = () => {
    if (typeof navigator !== 'undefined') {
      return {
        userAgent: navigator.userAgent || 'Unknown',
        platform: navigator.platform || 'Unknown',
        language: navigator.language || 'Unknown',
      };
    }
    return {
      userAgent: 'Unknown',
      platform: 'Unknown',
      language: 'Unknown',
    };
  };
  return {
    async run() {
      try {
        await form.submit();
        await api.auth.signIn(form.values, authenticator);
        await app.trackingManager.logEvent(TrackingEventType.CLICK, 'sign-in', {
          account: form.values.account,
          signup_method: 'account',
          deviceInfo: getDeviceInfo(),
        });
        await refreshAsync();
        redirect();
      } catch (err) {
        await app.trackingManager.logEvent(TrackingEventType.CLICK, 'sign-in-err', {
          account: form.values.account,
          signup_method: 'account',
          deviceInfo: getDeviceInfo(),
          error_status: err.status,
          error_message: err.response.data,
        });
      }
    },
  };
};

const passwordForm: ISchema = {
  type: 'object',
  name: 'passwordForm',
  'x-component': 'FormV2',
  properties: {
    account: {
      type: 'string',
      'x-component': 'Input',
      'x-validator': `{{(value) => {
        if (!value) {
          return t("Please enter your username or email");
        }
        if (value.includes('@')) {
          if (!/^[\\w-]+(\\.[\\w-]+)*@[\\w-]+(\\.[\\w-]+)+$/.test(value)) {
            return t("Please enter a valid email");
          }
        } else {
          return /^[^@.<>"'/]{2,16}$/.test(value) || t("Please enter a valid username");
        }
      }}}`,
      'x-decorator': 'FormItem',
      'x-component-props': { placeholder: '{{t("Username/Email")}}', style: {} },
    },
    password: {
      type: 'string',
      'x-component': 'Password',
      required: true,
      'x-decorator': 'FormItem',
      'x-component-props': { placeholder: '{{t("Password")}}', style: {} },
    },
    actions: {
      type: 'void',
      'x-component': 'div',
      properties: {
        submit: {
          title: '{{t("Sign in")}}',
          type: 'void',
          'x-component': 'Action',
          'x-component-props': {
            htmlType: 'submit',
            block: true,
            type: 'primary',
            useAction: `{{ useBasicSignIn }}`,
            style: { width: '100%' },
          },
        },
      },
    },
    signUp: {
      type: 'void',
      'x-component': 'Link',
      'x-component-props': {
        to: '{{ signUpLink }}',
      },
      'x-content': '{{t("Create an account")}}',
      'x-visible': '{{ allowSignUp }}',
    },
  },
};
export const SignInForm = (props: { authenticator: Authenticator }) => {
  const { t } = useAuthTranslation();
  const authenticator = props.authenticator;
  const { authType, name, options } = authenticator;
  const signUpPages = useSignUpForms();
  const allowSignUp = !!signUpPages[authType] && options?.allowSignUp;
  const signUpLink = `/signup?name=${name}`;

  const useBasicSignIn = () => {
    return useSignIn(name);
  };
  return (
    <SchemaComponent
      schema={passwordForm}
      scope={{
        useBasicSignIn,
        allowSignUp,
        signUpLink,
        t,
      }}
    />
  );
};

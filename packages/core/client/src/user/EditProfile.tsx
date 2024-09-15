import React, { useContext, useMemo, useState } from 'react';
import { ISchema, uid, useForm } from '@tachybase/schema';

import { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import {
  ActionContextProvider,
  DropdownVisibleContext,
  SchemaComponent,
  useActionContext,
  useCurrentUserContext,
  useRequest,
} from '../';
import { useAPIClient } from '../api-client';

const useCloseAction = () => {
  const { setVisible } = useActionContext();
  const form = useForm();
  return {
    async run() {
      setVisible(false);
      form.submit((values) => {
        console.warn(values);
      });
    },
  };
};

const useCurrentUserValues = (options) => {
  const ctx = useCurrentUserContext();
  return useRequest(() => Promise.resolve(ctx.data), options);
};

const useSaveCurrentUserValues = () => {
  const ctx = useCurrentUserContext();
  const { setVisible } = useActionContext();
  const form = useForm();
  const api = useAPIClient();
  return {
    async run() {
      const values = await form.submit<any>();
      setVisible(false);
      await api.resource('users').updateProfile({
        values,
      });
      ctx.mutate({
        data: {
          ...ctx?.data?.data,
          ...values,
        },
      });
    },
  };
};

const schema: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues: '{{ useCurrentUserValues }}',
      },
      'x-component': 'Action.Drawer',
      type: 'void',
      title: '{{t("Edit profile")}}',
      properties: {
        nickname: {
          type: 'string',
          title: "{{t('Nickname')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        username: {
          type: 'string',
          title: '{{t("Username")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': { username: true },
          required: true,
        },
        email: {
          type: 'string',
          title: '{{t("Email")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': 'email',
        },
        phone: {
          type: 'string',
          title: '{{t("Phone")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': 'phone',
        },
        footer: {
          'x-component': 'Action.Drawer.Footer',
          type: 'void',
          properties: {
            cancel: {
              title: 'Cancel',
              'x-component': 'Action',
              'x-component-props': {
                useAction: '{{ useCloseAction }}',
              },
            },
            submit: {
              title: 'Submit',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction: '{{ useSaveCurrentUserValues }}',
              },
            },
          },
        },
      },
    },
  },
};

export const useEditProfile = () => {
  const ctx = useContext(DropdownVisibleContext);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMemo<MenuProps['items'][0]>(() => {
    return {
      key: 'profile',
      eventKey: 'EditProfile',
      onClick: () => {
        navigate('/admin/profilers/user-profile');
      },
      label: <div>{t('Edit profile')}</div>,
    };
  }, [visible]);
};

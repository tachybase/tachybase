import { NoticeType } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { NAMESPACE } from '../locale';

export const notificationCollection = {
  name: 'notificationConfigs',
  fields: [
    {
      name: 'id',
      interface: 'id',
      type: 'bigInt',
      autoIncrement: true,
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: `{{t("Notification title", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input',
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'detail',
      uiSchema: {
        type: 'string',
        title: `{{t("Detail", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input.TextArea',
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'number',
      name: 'duration',
      uiSchema: {
        type: 'number',
        title: `{{t("Notification duration", { ns: "${NAMESPACE}" })}}`,
        description: `{{t('Set to manual close when this item is empty', { ns: "${NAMESPACE}" })}}`,
        'x-component': 'InputNumber',
        'x-read-pretty': true,
        'x-component-props': {
          min: 0,
          max: 99999,
          suffix: 's',
        },
      } as ISchema,
    },
    {
      interface: 'select',
      type: 'string',
      name: 'notifyType',
      uiSchema: {
        type: 'string',
        title: `{{t("Notification type", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Select',
        enum: [
          {
            value: NoticeType.MODAL,
            label: NoticeType.MODAL,
          },
          {
            value: NoticeType.NOTIFICATION,
            label: NoticeType.NOTIFICATION,
          },
          {
            value: NoticeType.STATUS,
            label: NoticeType.STATUS,
          },
          {
            value: NoticeType.TOAST,
            label: NoticeType.TOAST,
          },
        ],
      } as ISchema,
    },
    {
      interface: 'select',
      type: 'string',
      name: 'level',
      uiSchema: {
        type: 'string',
        title: `{{t("Notification level", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Select',
        enum: [
          {
            value: 'info',
            label: 'info',
          },
          {
            value: 'success',
            label: 'success',
          },
          {
            value: 'error',
            label: 'error',
          },
          {
            value: 'warning',
            label: 'warning',
          },
          {
            value: 'open',
            label: 'open',
          },
        ],
      } as ISchema,
    },
  ],
};

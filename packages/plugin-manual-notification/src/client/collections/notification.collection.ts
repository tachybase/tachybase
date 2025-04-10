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
            label: `{{t("modal", { ns: "${NAMESPACE}" })}}`,
            description: `{{t("modal_description", { ns: "${NAMESPACE}" })}}`,
          },
          {
            value: NoticeType.NOTIFICATION,
            label: `{{t("notification", { ns: "${NAMESPACE}" })}}`,
            description: `{{t("notification_description", { ns: "${NAMESPACE}" })}}`,
          },
          {
            value: NoticeType.STATUS,
            label: `{{t("status", { ns: "${NAMESPACE}" })}}`,
            description: `{{t("status_description", { ns: "${NAMESPACE}" })}}`,
          },
          {
            value: NoticeType.TOAST,
            label: `{{t("toast", { ns: "${NAMESPACE}" })}}`,
            description: `{{t("toast_description", { ns: "${NAMESPACE}" })}}`,
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
            label: `{{t("info", { ns: "${NAMESPACE}" })}}`,
            color: 'blue',
          },
          {
            value: 'success',
            label: `{{t("success", { ns: "${NAMESPACE}" })}}`,
            color: 'green',
          },
          {
            value: 'error',
            label: `{{t("error", { ns: "${NAMESPACE}" })}}`,
            color: 'red',
          },
          {
            value: 'warning',
            label: `{{t("warning", { ns: "${NAMESPACE}" })}}`,
            color: 'yellow',
          },
        ],
      } as ISchema,
    },
    {
      name: 'endTime',
      type: 'date',
      interface: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: `{{t("End time", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
          // 默认比当前时间大
          disabledDate: (current) => {
            return current && current < new Date();
          },
        },
      },
    },
  ],
};

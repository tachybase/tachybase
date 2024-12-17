import { CollectionOptions } from '@tachybase/database';

import { DATABASE_CRON_JOBS, DATABASE_CRON_JOBS_EXECUTIONS, NAMESPACE, SCHEDULE_MODE } from '../constants';

export default {
  dumpRules: {
    group: 'required',
  },
  name: DATABASE_CRON_JOBS,
  shared: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  model: 'CronJobModel',
  fields: [
    {
      type: 'bigInt',
      name: 'id',
      primaryKey: true,
      autoIncrement: true,
    },
    {
      type: 'string',
      name: 'name',
      required: true,
      uiSchema: {
        title: '{{ t("Name") }}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'string',
      name: 'description',
      uiSchema: {
        title: '{{ t("Description") }}',
        type: 'string',
        'x-component': 'Input.TextArea',
      },
    },
    {
      type: 'date',
      name: 'startsOn',
      required: true,
      uiSchema: {
        title: `{{t("Starts on", { ns: "${NAMESPACE}" })}}`,
        type: 'datetime',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
        required: true,
      },
    },
    {
      type: 'integer',
      name: 'mode',
      required: true,
      defaultValue: SCHEDULE_MODE.STATIC,
    },
    {
      type: 'date',
      name: 'endsOn',
      uiSchema: {
        title: `{{t("Ends on", { ns: "${NAMESPACE}" })}}`,
        type: 'datetime',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
    },
    {
      type: 'virtual',
      name: 'nextTime',
      uiSchema: {
        title: `{{t("Next time", { ns: "${NAMESPACE}" })}}`,
        type: 'datetime',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
    },
    {
      type: 'string',
      name: 'repeat',
      required: true,
      uiSchema: {
        title: `{{t("Repeat mode", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'RepeatField',
      },
    },
    {
      type: 'integer',
      name: 'limit',
      uiSchema: {
        title: `{{t("Current limit", { ns: "${NAMESPACE}" })}}`,
        type: 'number',
        'x-component': 'InputNumber',
      },
    },
    // 总执行次数,不可清空
    {
      type: 'integer',
      name: 'allExecuted',
      uiSchema: {
        title: `{{t("Executed", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
      },
      defaultValue: 0,
    },
    // 总执行成功次数,不可清空
    {
      type: 'integer',
      name: 'successExecuted',
      defaultValue: 0,
      uiSchema: {
        title: `{{t("Success executed", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'InputNumber',
      },
    },
    // 总执行次数,可清空, 用于限制执行循环次数
    {
      type: 'integer',
      name: 'limitExecuted',
      defaultValue: 0,
      uiSchema: {
        title: `{{t("Current times", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'boolean',
      name: 'enabled',
      uiSchema: {
        title: '{{ t("Enabled") }}',
        type: 'boolean',
        'x-component': 'Radio.Group',
        enum: [
          { label: '{{ t("On") }}', value: true, color: '#52c41a' },
          { label: '{{ t("Off") }}', value: false },
        ],
      },
    },
    {
      name: 'workflowKey',
      type: 'string',
      interface: 'select',
      uiSchema: {
        title: '{{ t("Workflow") }}',
        type: 'string',
        'x-component': 'WorkflowSelect',
        'x-component-props': {
          buttonAction: 'customize:triggerWorkflows',
          noCollection: true,
          label: 'title',
          value: 'key',
        },
      },
    },
  ],
} as CollectionOptions;

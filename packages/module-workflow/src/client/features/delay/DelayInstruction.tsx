import React from 'react';
import { useCompile } from '@tachybase/client';

import { InputNumber, Select } from 'antd';

import { JOB_STATUS } from '../..';
import { NAMESPACE } from '../../locale';
import { Instruction } from '../../nodes/default-node/interface';

const UnitOptions = [
  { value: 1_000, label: `{{t('Seconds', { ns: "workflow" })}}` },
  { value: 60_000, label: `{{t('Minutes', { ns: "workflow" })}}` },
  { value: 3600_000, label: `{{t('Hours', { ns: "workflow" })}}` },
  { value: 86400_000, label: `{{t('Days', { ns: "workflow" })}}` },
  { value: 604800_000, label: `{{t('Weeks', { ns: "workflow" })}}` },
];

function getNumberOption(v) {
  return UnitOptions.slice()
    .reverse()
    .find((item) => !(v % item.value));
}

function Duration({ value = 60000, onChange }) {
  const compile = useCompile();
  const option = getNumberOption(value);
  const quantity = Math.round(value / option.value);

  return (
    <fieldset
      style={{
        display: 'flex',
        gap: '0.5em',
      }}
    >
      <InputNumber
        min={1}
        value={quantity}
        onChange={(v) => onChange(Math.round(v * option.value))}
        className="auto-width"
      />
      <Select
        // @ts-ignore
        role="button"
        data-testid="select-time-unit"
        popupMatchSelectWidth={false}
        value={option.value}
        onChange={(unit) => onChange(Math.round(quantity * unit))}
        className="auto-width"
        options={UnitOptions.map((item) => ({
          value: item.value,
          label: compile(item.label),
        }))}
      />
    </fieldset>
  );
}
/** 节点: */
export default class extends Instruction {
  title = `{{t("Delay", { ns: "${NAMESPACE}" })}}`;
  type = 'delay';
  group = 'control';
  icon = 'ClockCircleOutlined';
  color = '#cf9247';
  description = `{{t("Delay a period of time and then continue or exit the process. Can be used to set wait or timeout times in parallel branches.", { ns: "${NAMESPACE}" })}}`;
  fieldset = {
    duration: {
      type: 'number',
      title: `{{t("Duration", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Duration',
      default: 60000,
      required: true,
    },
    endStatus: {
      type: 'number',
      title: `{{t("End status", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: `{{t("Succeed and continue", { ns: "${NAMESPACE}" })}}`, value: JOB_STATUS.RESOLVED },
        { label: `{{t("Fail and exit", { ns: "${NAMESPACE}" })}}`, value: JOB_STATUS.FAILED },
      ],
      required: true,
      default: JOB_STATUS.RESOLVED,
    },
  };
  components = {
    Duration,
  };
  isAvailable({ engine, workflow, upstream, branchIndex }) {
    return !engine.isWorkflowSync(workflow);
  }
}

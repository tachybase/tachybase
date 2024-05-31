import React from 'react';
import { css } from '@tachybase/client';

import { Trans } from 'react-i18next';

import { defaultFieldNames, WorkflowVariableRawTextArea } from '../..';
import { NAMESPACE } from '../../locale';
import { Instruction } from '../../nodes';

export default class extends Instruction {
  title = `{{t("SQL action", { ns: "${NAMESPACE}" })}}`;
  type = 'sql';
  group = 'collection';
  description = `{{t("Execute a SQL statement in database.", { ns: "${NAMESPACE}" })}}`;
  fieldset = {
    dataSource: {
      type: 'string',
      required: true,
      title: `{{t("Data source")}}`,
      description: `{{t("Select a data source to execute SQL.", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceSelect',
      'x-component-props': {
        className: 'auto-width',
        filter(item) {
          return item.options.isDBInstance;
        },
      },
      default: 'main',
    },
    sql: {
      type: 'string',
      required: true,
      title: 'SQL',
      description: '{{sqlDescription()}}',
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableRawTextArea',
      'x-component-props': {
        rows: 20,
        className: css`
          font-size: 80%;
          font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        `,
      },
    },
  };
  scope = {
    sqlDescription() {
      return (
        <Trans ns={NAMESPACE}>
          {'SQL query result could be used through '}
          <a href="https://docs-cn.tachybase.com/handbook/workflow-json-query" target="_blank" rel="noreferrer">
            {'JSON query node'}
          </a>
          {' (Commercial plugin).'}
        </Trans>
      );
    },
  };
  components = {
    WorkflowVariableRawTextArea,
  };
  useVariables({ key, title }, { types, fieldNames = defaultFieldNames }) {
    return {
      [fieldNames.value]: key,
      [fieldNames.label]: title,
    };
  }
}

import { ISchema } from '@tachybase/schema';

import { NAMESPACE } from '../locale';

export const schemaStatisticsQuery: ISchema = {
  type: 'void',
  properties: {
    statisticsQuery: {
      type: 'void',
      'x-component': 'FormV2',
      properties: {
        key: {
          type: 'string',
          title: `{{t("Instrumentation key", { ns: "${NAMESPACE}" })}}`,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        filterValues: {
          type: 'object',
          title: `{{t("Instrumentation filter", { ns: "${NAMESPACE}" })}}`,
          'x-decorator': 'FormItem',
          'x-component': 'InstrumentationFilter',
        },
        timeFilter: {
          type: 'object',
          title: `{{t("Time filter", { ns: "${NAMESPACE}" })}}`,
          'x-decorator': 'FormItem',
          'x-component': 'timeFilter',
        },
        actionBar: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {
              marginBottom: 24,
            },
          },
          properties: {
            reset: {
              title: '{{ t("Reset") }}',
              'x-component': 'Action',
              'x-use-component-props': 'useResetBlockActionProps',
            },
            submit: {
              title: '{{ t("Submit") }}',
              'x-component': 'Action',
              'x-use-component-props': 'useFilterSubmitProps',
              'x-component-props': {
                type: 'primary',
              },
            },
          },
        },
      },
    },
  },
};

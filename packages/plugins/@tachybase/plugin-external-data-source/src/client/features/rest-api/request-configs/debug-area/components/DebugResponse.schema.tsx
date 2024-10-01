import { useRequest } from '@tachybase/client';
import { uid } from '@tachybase/schema';

export const getSchemaDebugResponse = (data) => ({
  type: 'object',
  'x-decorator': 'Form',
  'x-decorator-props': {
    useValues(params) {
      const result = useRequest(
        () =>
          Promise.resolve({
            data: {},
          }),
        params,
      );
      return result;
    },
  },
  properties: {
    [uid()]: {
      type: 'string',
      default: data,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'Input.JSON',
      'x-component-props': {
        style: {
          maxHeight: '350px',
        },
      },
    },
  },
});

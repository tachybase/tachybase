import { ISchema } from '@tachybase/schema';

export const fieldsetNotification: Record<string, ISchema> = {
  notifyType: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  title: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  detail: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  duration: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },

  level: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
};

import { ISchema } from '@tachybase/schema';

export const NotificationFieldset: Record<string, ISchema> = {
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

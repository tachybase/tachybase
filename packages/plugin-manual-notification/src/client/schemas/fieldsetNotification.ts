import { ISchema } from '@tachybase/schema';

import { OptionRender } from './render';

export const fieldsetNotification: Record<string, ISchema> = {
  notifyType: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-component-props': {
      optionRender: OptionRender,
      popupMatchSelectWidth: true,
      listHeight: 300,
    },
  },
  level: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-component-props': {
      optionRender: OptionRender,
      popupMatchSelectWidth: true,
      listHeight: 300,
    },
    'x-visible': '{{ $self.query(".notifyType").value() !== "status"}}',
  },
  title: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-visible':
      '{{$self.query(".notifyType").value() !== "status" && $self.query(".notifyType").value() !== "toast"}}',
  },
  detail: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    required: true,
  },
  duration: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-visible': '{{$self.query(".notifyType").value() !== "status"}}',
  },
  endTime: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
};

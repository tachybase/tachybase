import { tval } from '../../locale';
import { styleShowMessage } from './ShowMessage.style';

export const schemaShowMessage = {
  name: 'drawer',
  type: 'void',
  title: tval('The interface of show message detail'),
  'x-component': 'Action.Drawer',
  'x-component-props': {
    className: styleShowMessage.actionStyle,
  },
  properties: {
    showMessageDetail: {
      type: 'string',
      'x-component': 'ViewMessageDetail',
    },
  },
};

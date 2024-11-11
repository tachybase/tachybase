import { CollectionFieldInterface, defaultProps } from '@tachybase/client';

import { tval } from '../locale';

export class SignaturePadFieldInterface extends CollectionFieldInterface {
  name = 'signatureSchema';
  type = 'object';
  group = 'advanced';
  order = 2; // 可以调整字段的顺序
  title = tval('Signature input');
  sortable = true;
  default = {
    interface: 'signature', // 添加手写签名的接口标识
    type: 'json',
    uiSchema: {
      type: 'signature', // 添加手写签名的 UI 类型
      'x-component': 'SignatureInput',
    },
  };
  availableTypes = ['json'];
  hasDefaultValue = false; // 手写签名通常不需要默认值

  properties = {
    ...defaultProps,
  };
}

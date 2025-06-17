import { useRef } from 'react';
import { useToken } from '@tachybase/client';
import { observer, useField, type Field } from '@tachybase/schema';

import { Typography } from 'antd';

export const TextCopyButton = observer(
  () => {
    const field = useField<Field>();
    const { token } = useToken();
    const buttonRef = useRef<HTMLDivElement | null>(null);

    const hidden = field.readPretty && !field.value;

    return (
      <Typography.Text
        ref={buttonRef}
        copyable={{
          text: field.value,
        }}
        style={{
          marginLeft: field.readPretty ? token.marginXXS : 0,
          opacity: hidden ? 0 : 1,
        }}
      />
    );
  },
  {
    displayName: 'TextCopyButton',
  },
);

export const TextCopyButtonNode = <TextCopyButton />;

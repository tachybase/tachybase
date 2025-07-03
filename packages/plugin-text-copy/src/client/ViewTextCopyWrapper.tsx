import { SchemaComponent, useToken } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { TextCopyButton } from './TextCopyButton';

interface ViewTextCopyWrapperProps {
  textCopyChildren?: string;
  [key: string]: any;
}

export const ViewTextCopyWrapper = observer((props: ViewTextCopyWrapperProps) => {
  const { textCopyChildren, ...otherProps } = props;
  const { token } = useToken();

  // 如果没有指定子组件，返回 null
  if (!textCopyChildren) {
    console.warn('ViewTextCopyWrapper: textCopyChildren is required');
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: token.marginXXS,
      }}
    >
      <div style={{ flex: 1 }}>
        <SchemaComponent
          schema={{
            type: 'object',
            'x-component': textCopyChildren,
            'x-component-props': {
              ...otherProps,
            },
          }}
        />
      </div>
      <TextCopyButton />
    </div>
  );
});

export const renderViewTextCopyWrapper = (schema) => {
  if (schema['x-component-props']?.enableCopier) {
    return <ViewTextCopyWrapper />;
  }
  return null;
};

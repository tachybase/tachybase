import { SchemaComponent } from '@tachybase/client';

import { TextCopyButton } from './TextCopyButton';

export const ViewTextCopyWrapper = (props) => {
  const { textCopyChildren, ...otherProps } = props;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <SchemaComponent
        schema={{
          type: 'object',
          'x-component': textCopyChildren,
          'x-component-props': {
            ...otherProps,
          },
        }}
      />
      <TextCopyButton />
    </div>
  );
};

export const renderViewTextCopyWrapper = (schema) => {
  if (schema['x-component-props']?.enableCopier) {
    return <ViewTextCopyWrapper />;
  }
  return null;
};

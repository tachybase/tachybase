import { AssistantListProvider, Icon, SchemaComponentOptions, useDesignable, useHotkeys } from '@tachybase/client';

import { FloatButton } from 'antd';

const DesignableButton = () => {
  const { designable, setDesignable } = useDesignable();
  // 快捷键切换编辑状态
  useHotkeys('Ctrl+Shift+U', () => setDesignable(!designable), [designable]);

  return (
    <FloatButton
      icon={<Icon type="Design" />}
      type={designable ? 'primary' : 'default'}
      onClick={() => setDesignable(!designable)}
    />
  );
};

export const DesignableButtonProvider = (props) => {
  return (
    <AssistantListProvider
      items={{
        db: { order: 60, component: 'DesignableButton', pin: true, snippet: 'ui.*' },
      }}
    >
      <SchemaComponentOptions
        components={{
          DesignableButton,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </AssistantListProvider>
  );
};

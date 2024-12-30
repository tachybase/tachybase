import { AssistantListProvider, SchemaComponentOptions, useDesignable } from '@tachybase/client';

import { FloatButton } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';

import { Icon } from '../../../icon';

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
        db: { order: 300, component: 'DesignableButton', pin: true, isPublic: true },
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

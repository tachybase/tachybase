import { AssistantListProvider, SchemaComponentOptions, useHotkeys } from '@tachybase/client';

import { SearchOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import { useSearchAndJump } from './SearchAndJumpModelProvider';

const SearchAndJumpButton = () => {
  const { setOpen } = useSearchAndJump();
  useHotkeys('Ctrl+K', () => setOpen((open) => !open), []);
  useHotkeys('Cmd+K', () => setOpen((open) => !open), []);

  return <FloatButton icon={<SearchOutlined />} onClick={() => setOpen(true)} />;
};

export const SearchAndJumpProvider = (props) => {
  return (
    <AssistantListProvider
      items={{
        saj: { order: 30, component: 'SearchAndJumpButton', pin: true, snippet: 'pm.*' },
      }}
    >
      <SchemaComponentOptions
        components={{
          SearchAndJumpButton,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </AssistantListProvider>
  );
};

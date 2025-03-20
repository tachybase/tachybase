import { observer } from '@tachybase/schema';

export const InputPreview = observer(
  (props) => {
    console.log('🚀 ~ InputPreview ~ props:', props);
    return <>111</>;
  },
  { displayName: 'Input.Preview' },
);

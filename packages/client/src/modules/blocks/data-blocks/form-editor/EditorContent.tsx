import { observer, Schema } from '@tachybase/schema';

import { Layout } from 'antd';
import _ from 'lodash';

import { usePageRefresh } from '../../../../built-in/dynamic-page/PageRefreshContext';
import { SchemaComponent } from '../../../../schema-component';
import { EditableGrid } from './EditableGrid';

interface EditorContentProps {
  schema: Schema;
}

export const EditorContent = observer<EditorContentProps>(({ schema }) => {
  const { Content } = Layout;
  const { refreshKey } = usePageRefresh();
  return (
    <Content key={refreshKey} style={{ padding: '5px', overflow: 'auto' }}>
      <SchemaComponent schema={schema} components={{ EditableGrid }} />
    </Content>
  );
});

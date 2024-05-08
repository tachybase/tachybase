import { connect, mapReadPretty } from '@tachybase/schema';
import { withDynamicSchemaProps } from '@tachybase/client';
import { Display } from './Display';
import { Edit } from './Edit';

export const MarkdownVditor = withDynamicSchemaProps(connect(Edit, mapReadPretty(Display)));

export default MarkdownVditor;

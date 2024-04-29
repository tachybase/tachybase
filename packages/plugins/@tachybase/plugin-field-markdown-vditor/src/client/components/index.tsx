import { connect, mapReadPretty } from '@tachybase/schema';
import { withDynamicSchemaProps } from '@nocobase/client';
import { Display } from './Display';
import { Edit } from './Edit';

export const MarkdownVditor = withDynamicSchemaProps(connect(Edit, mapReadPretty(Display)));

export default MarkdownVditor;

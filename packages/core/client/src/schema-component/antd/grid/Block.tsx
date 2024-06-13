import React from 'react';
import { observer, useFieldSchema } from '@tachybase/schema';

import { DragHandler } from '../../';

export const Block = observer(
  (props) => {
    const fieldSchema = useFieldSchema();
    return (
      <div style={{ marginBottom: 20, padding: '0 20px', height: 50, lineHeight: '50px', background: '#f1f1f1' }}>
        Block {fieldSchema.title}
        <DragHandler />
      </div>
    );
  },
  { displayName: 'Block' },
);

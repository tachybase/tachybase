import React from 'react';
import { css } from '@tachybase/client';
import { connect } from '@tachybase/schema';

import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { Editor } from '@bytemd/react';

import 'bytemd/dist/index.css';
import 'highlight.js/styles/vs.min.css';
import 'github-markdown-css';

/**
 * Markdown 编辑器
 */
function MDEditor({ value, ...props }) {
  return (
    <div
      className={css`
        height: calc(100vh - 126px);
        border-bottom: 10px solid red;
        .bytemd {
          height: calc(100vh - 126px);
        }
      `}
    >
      <Editor value={value || ''} {...props} plugins={[gfm(), gemoji(), highlight()]} />
    </div>
  );
}

export default connect(MDEditor);

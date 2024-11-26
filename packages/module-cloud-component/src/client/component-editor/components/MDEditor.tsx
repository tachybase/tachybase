import React, { forwardRef, useImperativeHandle, useState } from 'react';

import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { Editor, Viewer } from '@bytemd/react';

import 'bytemd/dist/index.css';
import 'highlight.js/styles/vs.min.css';
import 'github-markdown-css';
import './index.less';

import { connect } from '@tachybase/schema';

/**
 * Markdown 编辑器
 */
function MDEditor(props: any, ref: any) {
  const [code, setCode] = useState<string>(localStorage.getItem('md-code') || '');

  // useImperativeHandle(ref, () => {
  //   return {
  //     getCode() {
  //       return code;
  //     },
  //   };
  // });

  return (
    <div className="code-editor">
      <Editor {...props} plugins={[gfm(), gemoji(), highlight()]} />
    </div>
  );
}

export default connect(MDEditor);

import React from 'react';
import { connect } from '@tachybase/schema';

import Editor, { loader } from '@monaco-editor/react';

loader.config({ paths: { vs: 'https://assets.tachybase.com/monaco-editor@0.52.0/min/vs' } });

export const CodeMirror = connect(({ value, onChange, ...otherProps }) => {
  return (
    <Editor
      theme="vs-dark"
      value={value}
      height="300px"
      defaultLanguage="javascript"
      onChange={onChange}
      {...otherProps}
    />
  );
});

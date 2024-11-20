import React, { useEffect } from 'react';
import { connect } from '@tachybase/schema';

import Editor, { loader, useMonaco } from '@monaco-editor/react';

loader.config({ paths: { vs: 'https://assets.tachybase.com/monaco-editor@0.52.0/min/vs' } });

export const CodeMirror = connect(({ value, onChange, ...otherProps }) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: 4,
      });
    }
  }, [monaco]);
  return <Editor value={value} height="300px" defaultLanguage="javascript" onChange={onChange} {...otherProps} />;
});

export const CodeEditor = CodeMirror;

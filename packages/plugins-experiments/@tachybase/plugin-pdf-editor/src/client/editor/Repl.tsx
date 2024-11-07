import React, { useCallback, useState } from 'react';
import { CodeEditor } from '@tachybase/components';

import { Splitter } from 'antd';
import debounce from 'lodash.debounce';
import { useMount } from 'react-use';

import transpile from '../utils/transpile';
import PDFViewer from './PDFViewer';

const debounceTranspile = debounce(transpile, 250);

const Repl = ({ value, onChange, onUrlChange }) => {
  const [error, setError] = useState(null);

  const [element, setElement] = useState(null);

  const handleChange = useCallback(
    (code) => {
      if (code.length === 0) {
        setError(null);
        setElement(null);
      }

      const callback = (value) => {
        onChange?.(code);
        setElement(value);
      };

      debounceTranspile(code, callback, setError);
    },
    [onChange],
  );

  useMount(() => {
    if (value) debounceTranspile(value, setElement, setError);
  });

  return (
    <Splitter style={{ height: '80vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Splitter.Panel defaultSize="60%" min="20%" max="70%">
        <CodeEditor
          value={value}
          onChange={handleChange}
          language="typescript"
          height="100%"
          options={{
            lineNumbers: 'on',
            minimap: {
              enabled: false,
            },
          }}
        />
      </Splitter.Panel>
      <Splitter.Panel>
        <PDFViewer value={element} onUrlChange={onUrlChange} onRenderError={setError} />
      </Splitter.Panel>
    </Splitter>
  );
};

export default Repl;

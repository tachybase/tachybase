import React, { useCallback, useEffect, useState } from 'react';
import { ActionAreaProvider, ActionAreaStub } from '@tachybase/client';

import { Splitter } from 'antd';
import _ from 'lodash';

import { CanvasContent } from './CanvasContent';
import { useFlowContext } from './FlowContext';

export const CanvasContentWrapper = ({ entry }) => {
  const workflow = useFlowContext();
  const sizeValue = localStorage.getItem('workflow-' + workflow.workflow.key + '-splitter');
  const [size, setSize] = useState(sizeValue && Number(sizeValue) > 0 ? Number(sizeValue) : 600);

  const update = _.debounce((v) => {
    localStorage.setItem('workflow-' + workflow.workflow.key + '-splitter', v);
  });
  useEffect(() => {
    // TODO @tachybase/clien api
    const sizeValue = localStorage.getItem('workflow-' + workflow.workflow.key + '-splitter');
    if (sizeValue && Number(sizeValue) > 0) {
      setSize(Number(sizeValue));
    }
  }, [workflow.workflow.key]);
  return (
    <ActionAreaProvider>
      <Splitter
        onResize={(sizes) => {
          setSize(sizes[1]);
          update(String(sizes[1]));
        }}
      >
        <Splitter.Panel collapsible>
          <CanvasContent entry={entry} />
        </Splitter.Panel>
        <Splitter.Panel size={size} min="240" collapsible className="workflow-operator-area">
          <ActionAreaStub />
        </Splitter.Panel>
      </Splitter>
    </ActionAreaProvider>
  );
};

import { usePDFViewerRef } from '@hera/plugin-core/client';
import { Action, ActionInitializer, useAPIClient, useRecord } from '@nocobase/client';
import React, { createContext, useContext, useState } from 'react';

const PrintCounterContext = createContext(null);

export const PrintCounterProvider = (props) => {
  const record = useRecord();
  const [count, setCount] = useState(record.print_count || 1);
  return <PrintCounterContext.Provider value={[count, setCount]}>{props.children}</PrintCounterContext.Provider>;
};

const usePrintCounter = () => {
  const result = useContext(PrintCounterContext);
  if (!result) {
    return [0, () => {}];
  }
  return result;
};

export const PrintCounterAction = (props) => {
  const [count] = usePrintCounter();
  return <Action {...props} title={`打印（第${count}次）`} />;
};

export const usePDFViewerCountablePrintActionProps = () => {
  const ref = usePDFViewerRef();
  const api = useAPIClient();
  const record = useRecord();
  const [count, setCount] = usePrintCounter();
  return {
    onClick: async () => {
      if (record.record_category !== undefined) {
        await api.resource('records').update({
          filterByTk: record.id,
          values: { print_count: (record.print_count || 1) + 1 },
        });
        setCount(count + 1);
      }
      (ref.current as any).print();
    },
  };
};

export const PDFViewerCountablePrintActionInitializer = (props) => {
  const schema = {
    title: '{{ t("Print(countable)") }}',
    'x-action': 'print&count',
    'x-decorator': 'PrintCounterProvider',
    'x-component': 'PrintCounterAction',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      useProps: '{{ usePDFViewerCountablePrintActionProps }}',
      icon: 'PrinterOutlined',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};

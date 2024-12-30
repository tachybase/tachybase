// import React, { createContext, useContext, useState } from 'react';

// import { createPortal } from 'react-dom';

// import { CalculatorWrapper } from './Calculator';
// import { Draggable } from './Draggable';
// import { useStyles } from './style';
import { AssistantListProvider, SchemaComponentOptions } from '@tachybase/client';

import { CalculatorOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import { useCalculator } from './CalculatorModelProvider';

// export const useCalculator = () => {
//   return useContext(CalculatorContext);
// };

const CalculatorButton = () => {
  // const { setVisible } = useCalculator();
  const { visible, setVisible } = useCalculator();

  return (
    <FloatButton
      type={visible ? 'primary' : 'default'}
      icon={<CalculatorOutlined />}
      onClick={() => {
        setVisible((visible) => !visible);
      }}
    />
  );
};

export const CalculatorProvider = (props) => {
  return (
    <AssistantListProvider
      items={{
        ca: { order: 300, component: 'CalculatorButton', pin: true, isPublic: true },
      }}
    >
      <SchemaComponentOptions
        components={{
          CalculatorButton,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </AssistantListProvider>
  );
};

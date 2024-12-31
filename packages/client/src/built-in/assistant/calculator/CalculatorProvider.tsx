// import { AssistantListProvider, SchemaComponentOptions } from '@tachybase/client';

import { CalculatorOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import { SchemaComponentOptions } from '../../../schema-component';
import { AssistantListProvider } from '../Assistant.provider';
import { useCalculator } from './CalculatorModalProvider';

const CalculatorButton = () => {
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

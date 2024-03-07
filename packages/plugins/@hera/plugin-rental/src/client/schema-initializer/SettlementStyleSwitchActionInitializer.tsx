import React, { createContext, useContext, useState } from 'react';
import { Action, ActionInitializer } from '@nocobase/client';

export const SettlementStyleContext = createContext({
  style: 'category',
  setStyle: null,
});

export const SettlementStyleProvider = (props) => {
  const [style, setStyle] = useState('category');
  return (
    <SettlementStyleContext.Provider value={{ style, setStyle }}>{props.children}</SettlementStyleContext.Provider>
  );
};

export const useSettlementStyleSwitchActionProps = () => {
  const { setStyle } = useContext(SettlementStyleContext);
  return {
    onClick: () => {
      setStyle((style) => (style === 'category' ? 'product' : 'category'));
    },
  };
};

export const SettlementStyleSwitchAction = (props) => {
  const { style } = useContext(SettlementStyleContext);
  return <Action {...props} title={style === 'category' ? '显示产品' : '显示分类'} />;
};

export const SettlementStyleSwitchActionInitializer = (props) => {
  const schema = {
    title: '{{ t("column switch") }}',
    'x-action': 'settlementStyleSwitch',
    'x-component': 'SettlementStyleSwitchAction',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      useProps: '{{ useSettlementStyleSwitchActionProps }}',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};

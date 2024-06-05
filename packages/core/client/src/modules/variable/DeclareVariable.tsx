import React, { createContext } from 'react';

import { Collection } from '../../data-source';

interface DeclareVariableProps {
  /* 变量名称 */
  name: string;
  /** 变量值 */
  value: any;
  /** 显示给用户的名字 */
  title?: string;
  /** 变量对应的数据表信息 */
  collection?: Collection;
  children?: React.ReactNode;
}

export const DeclareVariableContext = createContext<DeclareVariableProps>(null);

/**
 * 在当前上下文中声明一个变量
 */
export const DeclareVariable = (props: DeclareVariableProps) => {
  const { name, value, title, collection } = props;
  return (
    <DeclareVariableContext.Provider value={{ name, value, title, collection }}>
      {props.children}
    </DeclareVariableContext.Provider>
  );
};

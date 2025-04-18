import { createContext, useContext } from 'react';

export const todosContext = createContext({});

export const useTodosContext = () => {
  return useContext(todosContext);
};

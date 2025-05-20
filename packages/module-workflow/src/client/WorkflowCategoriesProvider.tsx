import { createContext, useContext } from 'react';

export const WorkflowCategoryContext = createContext<{
  refresh: () => void;
  activeKey: string;
  setActiveKey: (key: string) => void;
}>({
  refresh: () => {},
  activeKey: '',
  setActiveKey: () => {},
});

export const useWorkflowCategory = () => useContext(WorkflowCategoryContext);

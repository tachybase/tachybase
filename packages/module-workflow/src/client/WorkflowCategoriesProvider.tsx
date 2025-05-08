import { createContext, useContext } from 'react';

export const WorkflowCategoryContext = createContext<() => void>(() => {});

export const useWorkflowCategory = () => useContext(WorkflowCategoryContext);

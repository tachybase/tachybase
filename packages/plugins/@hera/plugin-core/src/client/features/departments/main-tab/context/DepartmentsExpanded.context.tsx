import React, { useContext } from 'react';

interface DepartmentsExpandedProps {
  initData: (C: any) => void;
  treeData: any[];
  setTreeData: React.Dispatch<React.SetStateAction<any[]>>;
  nodeMap: {};
  updateTreeData: (C: any, v: any) => any;
  constructTreeData: (C: any, v: any) => any;
  getChildrenIds: (node: any) => any[];
  loadedKeys: any[];
  setLoadedKeys: React.Dispatch<React.SetStateAction<any[]>>;
  expandedKeys: any[];
  setExpandedKeys: React.Dispatch<React.SetStateAction<any[]>>;
}

const ContextDepartmentsExpanded = React.createContext<Partial<DepartmentsExpandedProps>>({});

export const ProviderContextDepartmentsExpanded = ContextDepartmentsExpanded.Provider;

export function useContextDepartmentsExpanded() {
  return useContext(ContextDepartmentsExpanded);
}

import React, { createContext, useContext, useState } from 'react';
import { ISchema } from '@tachybase/schema';

interface EditableFieldInfo {
  field: any | null;
  fieldSchema: ISchema | null;
  setEditableField: (info: { field: any; fieldSchema: ISchema } | null) => void;
}

const EditableSelectedFieldContext = createContext<EditableFieldInfo | null>(null);

export const EditableSelectedFieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fieldInfo, setFieldInfo] = useState<{ field: any; fieldSchema: ISchema } | null>(null);

  return (
    <EditableSelectedFieldContext.Provider
      value={{
        field: fieldInfo?.field ?? null,
        fieldSchema: fieldInfo?.fieldSchema ?? null,
        setEditableField: setFieldInfo,
      }}
    >
      {children}
    </EditableSelectedFieldContext.Provider>
  );
};

export const useEditableSelectedField = () => {
  const ctx = useContext(EditableSelectedFieldContext);
  if (!ctx) {
    throw new Error('useEditableSelectedField must be used within a EditableSelectedFieldProvider');
  }
  return ctx;
};

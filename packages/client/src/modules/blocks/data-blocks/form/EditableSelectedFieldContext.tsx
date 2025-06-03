import React, { createContext, useContext, useState } from 'react';

const EditableSelectedFieldContext = createContext<{
  schemaUID: string | null;
  setSchemaUID: (uid: string | null) => void;
} | null>(null);

export const EditableSelectedFieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schemaUID, setSchemaUID] = useState<string | null>(null);

  return (
    <EditableSelectedFieldContext.Provider value={{ schemaUID, setSchemaUID }}>
      {children}
    </EditableSelectedFieldContext.Provider>
  );
};

export const useEditableSelectedField = () => {
  const ctx = useContext(EditableSelectedFieldContext);
  if (!ctx) {
    throw new Error('useSelectedField must be used within a SelectedFieldProvider');
  }
  return ctx;
};

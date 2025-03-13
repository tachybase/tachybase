import React from 'react';

interface xlsxFormValueProps {
  value?: any;
  setFormValue?: any;
}

export const xlsxFormValueContext = React.createContext<xlsxFormValueProps>({});
export const useFormValueContext = () => React.useContext(xlsxFormValueContext);

import React, { useContext, useState } from 'react';

interface ResubmitProps {
  isResubmit?: boolean;
  setResubmit?: any;
}

const ResubmitContext = React.createContext<ResubmitProps>({});

export const ResubmitProvider = ({ children }) => {
  const [isResubmit, setResubmit] = useState(false);
  return <ResubmitContext.Provider value={{ isResubmit, setResubmit }}>{children}</ResubmitContext.Provider>;
};

export const useResubmit = () => {
  return useContext(ResubmitContext);
};

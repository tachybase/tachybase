import { useContext } from 'react';

import { MobileContext } from '../MobileProvider';

export const useIsMobile = () => {
  const ctx = useContext(MobileContext);
  return ctx?.isMobile;
};

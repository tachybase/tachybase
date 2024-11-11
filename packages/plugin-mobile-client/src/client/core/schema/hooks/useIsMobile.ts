import { useContext } from 'react';

import { MobileContext } from '../provider/MobileProvider';

export const useIsMobile = () => {
  const ctx = useContext(MobileContext);
  return ctx?.isMobile;
};

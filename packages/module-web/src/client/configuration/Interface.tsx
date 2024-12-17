import React from 'react';

import { MobileDevice } from '../devices';
import { InterfaceRouter } from '../router';

export const InterfaceConfiguration = () => {
  return (
    <MobileDevice>
      <InterfaceRouter></InterfaceRouter>
    </MobileDevice>
  );
};

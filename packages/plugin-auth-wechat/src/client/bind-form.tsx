import React from 'react';

import { SignInForm } from './sign-in-form';

export const BindForm = ({authenticator}) => {
  return <SignInForm authenticator={authenticator} bind={ true } />;
};

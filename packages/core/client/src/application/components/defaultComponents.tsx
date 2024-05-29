import React, { FC } from 'react';

import { MainComponent } from './MainComponent';

const Loading = () => <div>Loading...</div>;
const AppError = ({ error }: { error: Error }) => (
  <div>
    <div>Load Plugin Error</div>
    {error?.message}
  </div>
);

const AppNotFound = () => <div></div>;

export const defaultAppComponents = {
  AppMain: MainComponent,
  AppSpin: Loading,
  AppError: AppError,
  AppNotFound: AppNotFound,
};

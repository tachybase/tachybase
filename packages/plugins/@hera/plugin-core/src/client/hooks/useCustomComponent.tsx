import { useApp } from '@nocobase/client';
import _ from 'lodash';
import { CustomComponentType, CustomFunctionComponent } from '..';

export const useCustomComponent = (type: CustomComponentType) => {
  const app = useApp();
  return _.filter(app.components, (component: CustomFunctionComponent) => component.__componentType === type).map(
    (component: CustomFunctionComponent) => ({
      label: component.__componentLabel,
      value: component.displayName,
    }),
  );
};

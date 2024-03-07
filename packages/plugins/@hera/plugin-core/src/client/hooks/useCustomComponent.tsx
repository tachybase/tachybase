import { useApp } from '@nocobase/client';
import _ from 'lodash';
import { KEY_CUSTOM_COMPONENT_LABEL, KEY_CUSTOM_COMPONENT_TYPE } from '..';

export const useCustomComponent = (type: string) => {
  const app = useApp();
  return _.filter(app.components, (component) => component[KEY_CUSTOM_COMPONENT_TYPE] === type).map((component) => ({
    label: component[KEY_CUSTOM_COMPONENT_LABEL],
    value: component.displayName,
  }));
};

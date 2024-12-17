import { lodash } from '@tachybase/utils/client';

export const debounceClick = lodash.debounce((parentForm, actionKey, keyName, headerValue) => {
  const { actions } = parentForm.values || {};

  parentForm.setValuesIn('actions', {
    ...actions,
    [actionKey]: {
      ...actions?.[actionKey],
      [keyName]: headerValue,
    },
  });
}, 400);

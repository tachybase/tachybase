import { tval as nTval } from '@tachybase/client';

export const NAMESPACE = '@tachybase/plugin-workflow-approval';

export const tval = (key: string, haveNamespace: boolean = true) => {
  if (haveNamespace) {
    return nTval(key, { ns: NAMESPACE });
  } else {
    return nTval(key);
  }
};

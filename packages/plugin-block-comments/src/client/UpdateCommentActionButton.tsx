import { useEffect, useState } from 'react';
import { useACLActionParamsContext, useDesignable } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { useTranslation } from './locale';

export function UpdateCommentActionButton() {
  const field = useField();
  const { t } = useTranslation();
  const [enable, setEnable] = useState(false);
  const acl = useACLActionParamsContext();
  const { designable } = useDesignable();

  useEffect(() => {
    const current = field.address.slice(0, field.address.length - 2);

    field.form.setFieldState(current.concat('content'), (prevState) => {
      prevState.pattern = enable ? 'editable' : 'readPretty';
    });

    field.form.setFieldState(current, (prevState) => {
      prevState.componentProps = {
        ...prevState.componentProps,
        editing: enable,
        setEditing: setEnable,
      };
    });
  }, [enable, field.address, field.form]);

  if (!designable && (field?.data?.hidden || !acl)) {
    return null;
  }

  return (
    <a
      style={{
        fontSize: 14,
      }}
      onClick={() => {
        setEnable(true);
      }}
    >
      {t('Edit')}
    </a>
  );
}

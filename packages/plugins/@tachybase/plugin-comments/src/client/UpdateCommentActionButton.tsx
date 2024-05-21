import React from 'react';
import { useDesignable, useACLActionParamsContext } from '@tachybase/client';
import { useEffect, useState } from 'react';
import { useTranslation } from './locale';
import { useField } from '@tachybase/schema';

export function UpdateCommentActionButton() {
  const field = useField();
  const { t } = useTranslation();
  const [enable, setEnable] = useState(false);
  const acl = useACLActionParamsContext();
  const { designable } = useDesignable();

  useEffect(() => {
    const current = field.address.slice(0, field.address.length - 2);
    field.form.setFieldState(current.concat('content'), (f) => {
      f.pattern = enable ? 'editable' : 'readPretty';
    });
    field.form.setFieldState(current, (f) => {
      f.componentProps = { ...f.componentProps, editing: enable, setEditing: setEnable };
    });
  }, [enable, field.address, field.form]);

  return !designable && (field?.data?.hidden || !acl) ? null : (
    <a
      style={{ fontSize: 14 }}
      onClick={() => {
        setEnable(true);
      }}
    >
      {t('Edit')}
    </a>
  );
}

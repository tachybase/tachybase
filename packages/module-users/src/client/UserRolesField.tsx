import React from 'react';
import { Field, Schema, useField } from '@tachybase/schema';

import { Tag } from 'antd';

import { useUsersTranslation } from './locale';

export const UserRolesField: React.FC = () => {
  const { t } = useUsersTranslation();
  const field = useField<Field>();
  return (field.value || []).map((role: { name: string; title: string }) => (
    <Tag key={role.name}>{Schema.compile(role.title, { t })}</Tag>
  ));
};

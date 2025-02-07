import React from 'react';
import { SchemaComponent, SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';

import { useUsersTranslation } from './locale';
import { PasswordField } from './PasswordField';
import { usersSchema } from './schemas/users';
import { UserRolesField } from './UserRolesField';

export const UsersManagement = () => {
  const { t } = useUsersTranslation();
  const scCtx = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider value={{ ...scCtx, designable: false }}>
      <SchemaComponent schema={usersSchema} scope={{ t }} components={{ UserRolesField, PasswordField }} />
    </SchemaComponentContext.Provider>
  );
};

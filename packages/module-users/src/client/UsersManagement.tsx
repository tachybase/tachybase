import React from 'react';
import { SchemaComponent, SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';

import { Card } from 'antd';

import { useFilterActionProps } from './hooks';
import { useUsersTranslation } from './locale';
import { PasswordField } from './PasswordField';
import { usersSchema } from './schemas/users';
import { UserRolesField } from './UserRolesField';

export const UsersManagement: React.FC = () => {
  const { t } = useUsersTranslation();
  const scCtx = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider value={{ ...scCtx, designable: false }}>
      <SchemaComponent
        schema={usersSchema}
        scope={{ t, useFilterActionProps }}
        components={{ UserRolesField, PasswordField }}
      />
    </SchemaComponentContext.Provider>
  );
};

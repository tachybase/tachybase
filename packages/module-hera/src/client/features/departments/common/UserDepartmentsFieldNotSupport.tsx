import React from 'react';
import { AssociationField } from '@tachybase/client';
import { connect, mapReadPretty } from '@tachybase/schema';

import { useTranslation } from '../../../locale';

export const UserDepartmentsFieldNotSupport = connect(() => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        color: '#ccc',
      }}
    >
      {t('This field is currently not supported for use in form blocks.')}
    </div>
  );
}, mapReadPretty(AssociationField.ReadPretty));

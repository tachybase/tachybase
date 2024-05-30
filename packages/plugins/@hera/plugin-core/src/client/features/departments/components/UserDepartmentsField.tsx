import React from 'react';
import { AssociationField } from '@tachybase/client';
import { connect, mapReadPretty } from '@tachybase/schema';

// import { jsxs } from 'react/jsx-runtime';
import { useTranslation } from '../../../locale';

export const UserDepartmentsField = connect(() => {
  const { t } = useTranslation();
  // return jsxs('div', {
  //   style: {
  //     color: '#ccc',
  //   },
  //   children: [t('This field is currently not supported for use in form blocks.'), ' '],
  // });

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

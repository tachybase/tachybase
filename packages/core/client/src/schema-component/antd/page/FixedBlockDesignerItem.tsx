import { useField, useFieldSchema } from '@tachybase/schema';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDesignable } from '../../hooks';
import { useIsBlockInPage } from './hooks/useIsBlockInPage';
import { SchemaSettingsSwitchItem } from '../../../schema-settings';
import { useBlockRequestContext } from '../../../block-provider/BlockProvider';
import { useFixedBlock } from './FixedBlock';

export const FixedBlockDesignerItem = () => {
  const field = useField();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  const { inFixedBlock } = useFixedBlock();
  const { isBlockInPage } = useIsBlockInPage();
  const { service } = useBlockRequestContext();

  if (!isBlockInPage() || !inFixedBlock) {
    return null;
  }
  return (
    <SchemaSettingsSwitchItem
      title={t('Fix block')}
      checked={fieldSchema['x-decorator-props']?.fixedBlock}
      onChange={async (fixedBlock) => {
        const decoratorProps = {
          ...fieldSchema['x-decorator-props'],
          fixedBlock,
        };
        await dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-decorator-props': decoratorProps,
          },
        });
        field.decoratorProps = fieldSchema['x-decorator-props'] = decoratorProps;
        service?.refresh?.();
      }}
    />
  );
};

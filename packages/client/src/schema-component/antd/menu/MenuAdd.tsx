import { useField, useFieldSchema } from '@tachybase/schema';

import { Icon, useDesignable, useGetAriaLabelOfDesigner } from '../../..';
import { SchemaSettingsDropdown } from '../../../schema-settings/SchemaSettings';
import { InsertMenuItemsGroup } from './Menu.Designer';

export const MenuAdd = () => {
  const { dn, designable } = useDesignable();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { getAriaLabel } = useGetAriaLabelOfDesigner();
  const schemaSettingsProps = {
    dn,
    field,
    fieldSchema,
  };

  if (!designable) {
    return null;
  }

  return (
    <SchemaSettingsDropdown
      title={<Icon type="PlusOutlined" aria-label={getAriaLabel('add-menu')} />}
      {...schemaSettingsProps}
    >
      <InsertMenuItemsGroup />
    </SchemaSettingsDropdown>
  );
};

import { createDesignable, Icon, useDesignable, useGetAriaLabelOfDesigner } from '../../..';
import { SchemaSettingsDropdown } from '../../../schema-settings/SchemaSettings';
import { InsertMenuItemsGroup } from './Menu.Designer';

export const MenuAdd = (props) => {
  const { dn } = props;
  const { dn: dnEvents } = useDesignable();

  const { getAriaLabel } = useGetAriaLabelOfDesigner();

  return (
    <SchemaSettingsDropdown title={<Icon type="PlusOutlined" aria-label={getAriaLabel('add-menu')} />}>
      <InsertMenuItemsGroup dn={{ ...dn, events: dnEvents.events }} />
    </SchemaSettingsDropdown>
  );
};

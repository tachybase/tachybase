import { Input } from 'antd';
import _ from 'lodash';

import { Icon, useTranslation } from '../../..';
import { MenuAdd } from './MenuAdd';
import { useStyles } from './MenuSearchAdd.style';

interface MenuSearchProps {
  setSearchMenuTitle: (title: string) => void;
  designable: boolean;
  dn?: any;
}

export const MenuSearchAdd = (props: MenuSearchProps) => {
  const { designable, dn, setSearchMenuTitle } = props;
  const { t } = useTranslation();

  const { styles } = useStyles();

  const handleChange = _.debounce((event) => {
    event.stopPropagation();
    const searchValue = event.target.value.trim();
    setSearchMenuTitle(searchValue);
  }, 500);

  const handleSearch = (value, event) => {
    event.stopPropagation();
    _.debounce(setSearchMenuTitle, 500)(value.trim());
  };

  return (
    <div className={styles.menuSearchAdd}>
      <Input.Search
        allowClear
        placeholder={t('search Menu')}
        prefix={<Icon type="SearchOutlined" />}
        onChange={handleChange}
        onSearch={handleSearch}
      />
      <div className="menu-add-wrapper">{designable && <MenuAdd dn={dn} />}</div>
    </div>
  );
};

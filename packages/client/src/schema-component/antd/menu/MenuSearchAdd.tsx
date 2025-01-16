import { Input } from 'antd';
import _ from 'lodash';

import { Icon, useTranslation } from '../../..';
import { MenuAdd } from './MenuAdd';
import { useStyles } from './MenuSearchAdd.style';

interface MenuSearchProps {
  setSearchMenuTitle: (title: string) => void;
  designable: boolean;
}

export const MenuSearchAdd = (props: MenuSearchProps) => {
  const { designable, setSearchMenuTitle } = props;
  const { t } = useTranslation();

  const { styles } = useStyles();

  const handleChange = _.debounce((event) => {
    event.stopPropagation();
    const searchValue = event.target.value.trim();
    setSearchMenuTitle(searchValue);
  }, 500);

  return (
    <div className={styles.menuSearchAdd}>
      <Input.Search
        allowClear
        placeholder={t('search Menu')}
        prefix={<Icon type="SearchOutlined" />}
        onChange={handleChange}
      />
      <div className="menu-add-wrapper">{designable && <MenuAdd />}</div>
    </div>
  );
};

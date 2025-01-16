import { Input } from 'antd';
import _ from 'lodash';

import { Icon, useTranslation } from '../../..';
import { useStyles } from './MenuSearch.style';

interface MenuSearchProps {
  setSearchMenuTitle: (title: string) => void;
}

export const MenuSearch = (props: MenuSearchProps) => {
  const { setSearchMenuTitle } = props;
  const { t } = useTranslation();

  const { styles } = useStyles();

  const handleChange = _.debounce((event) => {
    event.stopPropagation();
    const searchValue = event.target.value.trim();
    setSearchMenuTitle(searchValue);
  }, 500);

  return (
    <Input.Search
      style={{
        backgroundColor: 'white',
      }}
      className={styles.menuSearch}
      allowClear
      placeholder={t('search Menu')}
      prefix={<Icon type="SearchOutlined" />}
      onChange={handleChange}
    />
  );
};

import { Input } from 'antd';
import _ from 'lodash';

import { Icon, useTranslation } from '../../../..';
import { useStyles } from './SearchInput.style';

export const SearchInput = () => {
  const { styles } = useStyles();
  const { t } = useTranslation();
  const handleChange = _.debounce((event) => {
    event.stopPropagation();
    const searchValue = event.target.value.trim();
  }, 500);

  const handleSearch = (value, event) => {
    event.stopPropagation();
  };
  return (
    <Input.Search
      className={styles.searchInput}
      allowClear
      placeholder={t('search')}
      prefix={<Icon type="SearchOutlined" />}
      onChange={handleChange}
      onSearch={handleSearch}
    />
  );
};

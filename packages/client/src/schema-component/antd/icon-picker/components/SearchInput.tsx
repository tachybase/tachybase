import { Input } from 'antd';
import _ from 'lodash';

import { Icon, useTranslation } from '../../../..';
import { useStyles } from './SearchInput.style';

export const SearchInput = (props) => {
  const { changeFilterKey } = props;
  const { styles } = useStyles();
  const { t } = useTranslation();
  const handleChange = _.debounce((event) => {
    const searchValue = event.target.value.trim();
    changeFilterKey(searchValue);
  }, 500);
  return (
    <Input
      className={styles.searchInput}
      allowClear
      placeholder={t('')}
      prefix={<Icon type="SearchOutlined" />}
      onChange={handleChange}
    />
  );
};

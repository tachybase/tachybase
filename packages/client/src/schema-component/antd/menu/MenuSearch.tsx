import { Input } from 'antd';
import _ from 'lodash';

import { useTranslation } from '../../..';

interface MenuSearchProps {
  setSearchMenuTitle: (title: string) => void;
}

export const MenuSearch = (props: MenuSearchProps) => {
  const { setSearchMenuTitle } = props;
  const { t } = useTranslation();

  // NOTE: 为了同时实现 debounce 和 阻止冒泡事件, 并且具有可读性, 采用这样的实现方式
  const debounceChangeValue = _.debounce((value) => {
    setSearchMenuTitle(value);
  }, 500);

  const handleSearch = (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    debounceChangeValue(value.trim());
  };

  return (
    <Input.Search
      style={{ width: '100%' }}
      allowClear
      placeholder={t('search Menu')}
      prefix={null}
      onSearch={handleSearch}
    />
  );
};

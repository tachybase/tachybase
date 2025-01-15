import { Input } from 'antd';

import { useTranslation } from '../../..';

export const MenuSearch = (props) => {
  const {} = props;
  const { t } = useTranslation();
  const handleSearch = (value, event, { source }) => {
    event.stopPropagation();
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

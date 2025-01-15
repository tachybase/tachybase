import { Input } from 'antd';

import { useTranslation } from '../../..';

export const MenuSearch = (props) => {
  const {} = props;
  const { t } = useTranslation();
  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('%c Line:9 🍆 handleSearch', 'font-size:18px;color:#6ec1c2;background:#93c0a4', handleSearch);
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

import { useState } from 'react';

import { Dropdown, type MenuProps } from 'antd';

export const LanguageSwitcher = () => {
  const [language, setLanguage] = useState('zh_CN'); // 默认语言为中文

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          中文
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          English
        </a>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomRight" className="language-selector">
      <span>语言: {language === 'zh_CN' ? '中文' : 'English'}</span>
    </Dropdown>
  );
};

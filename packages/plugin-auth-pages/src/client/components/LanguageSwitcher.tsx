import { useState } from 'react';

import { Dropdown, type MenuProps } from 'antd';

import { useStyles } from './LanguageSwitcher.style';

export const LanguageSwitcher = () => {
  const { styles } = useStyles();
  const [language, setLanguage] = useState('zh_CN'); // 默认语言为中文

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <span>简体中文</span>,
    },
    {
      key: '2',
      label: <span>English</span>,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className={styles.languageText}>
        <span className="icon-globe"></span>
        <span>{language === 'zh_CN' ? '简体中文' : 'English'}</span>
      </div>
    </Dropdown>
  );
};

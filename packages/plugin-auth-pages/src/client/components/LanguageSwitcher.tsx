import { useState } from 'react';

import { Dropdown, type MenuProps } from 'antd';

import { useStyles } from './LanguageSwitcher.style';

export const LanguageSwitcher = () => {
  const { styles } = useStyles();
  const [language, setLanguage] = useState('zh_CN'); // 默认语言为中文

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem('TACHYBASE_LOCALE', value);
    window.location.reload();
  };

  const items: MenuProps['items'] = [
    {
      key: 'zh_CN',
      label: <span onClick={() => handleLanguageChange('zh_CN')}>简体中文</span>,
    },
    {
      key: 'en_US',
      label: <span onClick={() => handleLanguageChange('en_US')}>English</span>,
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

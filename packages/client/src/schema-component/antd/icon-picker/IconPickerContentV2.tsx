import { useMemo } from 'react';

import { Tabs, type TabsProps } from 'antd';

import { SearchInput } from './components/SearchInput';
import { SelectIcon } from './components/SelectIcon';
import { UploadConfigIcon } from './components/UploadConfigIcon';
import { useStyles } from './IconPickerContentV2.style';

export const IconPickerContentV2 = (props) => {
  const { value, onChange, setFilterKey, filterKey, setVisible } = props;

  const { styles } = useStyles();

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: '图标',
        children: <SelectIcon />,
      },
      {
        key: '2',
        label: '自定义图标',
        children: <UploadConfigIcon />,
      },
    ],
    [],
  );

  return (
    <Tabs
      className={styles.iconPickerContent}
      tabBarExtraContent={<SearchInput />}
      defaultActiveKey="1"
      items={items}
      onChange={onChange}
    />
  );
};

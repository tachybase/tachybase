import { useMemo } from 'react';

import { Tabs, type TabsProps } from 'antd';

import { SearchInput } from './components/SearchInput';
import { SelectIconList } from './components/SelectIconList';
import { SystemIcon } from './components/SystemIcon';
import { UploadConfigIcon } from './components/UploadConfigIcon';
import { useStyles } from './IconPickerContentV2.style';

export const IconPickerContentV2 = (props) => {
  const { value, onChange, setFilterKey, filterKey, setVisible } = props;

  const { styles } = useStyles();

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: 'icon',
        label: '图标',
        children: <SystemIcon {...props} />,
      },
      // {
      //   key: 'custom',
      //   label: '自定义图标',
      //   children: <UploadConfigIcon />,
      // },
    ],
    [props],
  );

  return (
    <div className={styles.iconPickerContent}>
      <Tabs
        tabBarExtraContent={<SearchInput changeFilterKey={setFilterKey} />}
        defaultActiveKey="icon"
        items={items}
        onChange={onChange}
      />
    </div>
  );
};

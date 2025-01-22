import { Tabs, type TabsProps } from 'antd';

import { SearchInput } from './components/SearchInput';
import { useStyles } from './IconPickerContentV2.style';

export const IconPickerContentV2 = (props) => {
  const { value, onChange, setFilterKey, filterKey, setVisible } = props;

  const { styles } = useStyles();

  // TODO: 做翻译
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '图标',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: '自定义图标',
      children: 'Content of Tab Pane 2',
    },
  ];

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

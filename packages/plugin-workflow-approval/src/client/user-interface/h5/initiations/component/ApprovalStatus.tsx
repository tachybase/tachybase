import { useState } from 'react';
import { observer } from '@tachybase/schema';

import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

import { useTranslation } from '../../../../locale';

export const ApprovalStatus = observer((props) => {
  const { changeFilter, filter } = props as any;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        {filter?.['status'] && filter?.['status'] !== 'all'
          ? t(columns.find((item) => item.value === filter['status']).label)
          : '申请状态'}
        <DownOutline />
      </Space>
      <Picker
        columns={[
          columns.map((value) => {
            return { ...value, label: t(value.label) };
          }),
        ]}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        value={[filter?.['status'] || 'all']}
        onConfirm={(e) => {
          const changeData = { ...filter };
          if (e[0] === 'all') {
            delete changeData['status'];
          } else {
            changeData['status'] = e[0];
          }
          changeFilter(changeData);
        }}
      />
    </>
  );
});
const columns = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: '0' },
  { label: 'Returned', value: '1' },
  { label: 'Submitted', value: '2' },
  { label: 'Processing', value: '3' },
  { label: 'Approved', value: '4' },
  { label: 'Rejected', value: '-1' },
];

import React, { useEffect, useState } from 'react';
import { useAPIClient } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

import { useTranslation } from '../../locale';

export const TabApplicantType = observer((props) => {
  const { changeFilter, filter } = props as any;
  const [visible, setVisible] = useState(false);
  const api = useAPIClient();
  const [columns, setColumns] = useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    api
      .request({ url: 'users:list', params: { pageSize: 99999 } })
      .then((res) => {
        const userData = res.data.data.map((item) => {
          return {
            label: item.nickname,
            value: item.id,
          };
        });
        userData.unshift({
          label: t('All'),
          value: 'all',
        });
        setColumns(userData);
      })
      .catch(() => {
        console.error;
      });
  }, []);
  return (
    <Space>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        {columns.length && filter['userId'] && filter['userId'] !== 'all'
          ? columns.find((item) => item.value === filter['userId']).label
          : '申请人'}
        <DownOutline />
      </Space>
      <Picker
        columns={[columns]}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={(e) => {
          const changeData = { ...filter };
          if (e[0] === 'all') {
            delete changeData['userId'];
          } else {
            changeData['userId'] = e[0];
          }
          changeFilter(changeData);
        }}
      />
    </Space>
  );
});

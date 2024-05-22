import { observer } from '@tachybase/schema';
import { dayjs } from '@tachybase/utils/client';
import { AutoCenter, Button, DatePicker, Grid, Popup, Space, Toast } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import React, { useState } from 'react';

export const ApprovalReachDataType = observer((props) => {
  const { changeFilter, filter } = props as any;
  const [pickerVisible, setPickerVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const now = new Date();
  const [currPicker, setCurrPicker] = useState('start');
  const [startData, setStartData] = useState<any>(dayjs(now).startOf('date').toISOString());
  const [endData, setEndData] = useState<any>(now);
  return (
    <>
      <Space
        onClick={() => {
          setPopupVisible(true);
        }}
      >
        {filter['createdAt'] ? `${formatDate(startData)}-${formatDate(endData)} ` : '到达日期'}
        <DownOutline />
      </Space>
      <Popup
        visible={popupVisible}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '15vh',
        }}
        onMaskClick={() => {
          setPopupVisible(false);
        }}
      >
        <Grid columns={9} style={{ height: '10vh' }}>
          <Grid.Item
            span={4}
            onClick={() => {
              setPickerVisible(true), setCurrPicker('start');
            }}
          >
            <AutoCenter style={{ lineHeight: '10vh' }}>{formatDate(startData) || ''}</AutoCenter>
          </Grid.Item>
          <Grid.Item style={{ lineHeight: '10vh' }}>——</Grid.Item>
          <Grid.Item
            style={{ lineHeight: '10vh' }}
            span={4}
            onClick={() => {
              setPickerVisible(true), setCurrPicker('end');
            }}
          >
            <AutoCenter>{formatDate(endData) || ''}</AutoCenter>
          </Grid.Item>
        </Grid>
        <Button
          block
          color="primary"
          style={{ width: '99%' }}
          onClick={() => {
            if (!startData || !endData) {
              Toast.show({
                content: '请将时间范围填写完整',
              });
            } else {
              const changeData = { ...filter };
              changeData['createdAt'] = { $dateBetween: [startData, endData] };
              changeFilter(changeData);
              setPopupVisible(false);
            }
          }}
        >
          确定
        </Button>

        <DatePicker
          visible={pickerVisible}
          onClose={() => {
            setPickerVisible(false);
          }}
          max={now}
          onConfirm={(e) => {
            if (currPicker === 'start') {
              setStartData(e);
            } else {
              setEndData(dayjs(e).endOf('date').toISOString());
            }
          }}
        />
      </Popup>
    </>
  );
});

const formatDate = (checkDate) => {
  return dayjs(checkDate).format('YYYY-MM-DD');
};

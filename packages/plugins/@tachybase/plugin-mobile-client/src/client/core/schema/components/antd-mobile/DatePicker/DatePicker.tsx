import { dayjs } from '@tachybase/utils/client';
import { connect, mapProps } from '@tachybase/schema';
import { Button, DatePicker, Input, Space } from 'antd-mobile';
import React, { useState } from 'react';

export const MDatePicker = connect(
  (props) => {
    const [visible, setVisible] = useState(false);
    const nowDate = props.value || new Date();
    return (
      <>
        <Button
          onClick={() => {
            setVisible(true);
          }}
        >
          {dayjs(nowDate).format('YYYY-MM-DD')}
        </Button>

        <DatePicker
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          onConfirm={(value) => {
            props.onChange(value);
            setVisible(false);
          }}
        />
      </>
    );
  },
  mapProps((props) => {
    return { ...props };
  }),
);
export default MDatePicker;

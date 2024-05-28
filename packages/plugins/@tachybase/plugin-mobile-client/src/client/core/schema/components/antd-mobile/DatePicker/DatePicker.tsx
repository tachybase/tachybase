import React, { useState } from 'react';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';
import { dayjs } from '@tachybase/utils/client';

import { Button, DatePicker, Input, Space } from 'antd-mobile';

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
  mapReadPretty((props) => {
    const changeProps = { ...props };
    changeProps.value = dayjs(props.value).format(props.dateFormat);
    return <Input {...changeProps} readOnly />;
  }),
);
export default MDatePicker;

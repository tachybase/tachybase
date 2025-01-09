import { useState } from 'react';
import { useTranslation } from '@tachybase/client';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';
import { dayjs } from '@tachybase/utils/client';

import { Button, DatePicker } from 'antd-mobile';

export const MDatePicker = connect(
  (props) => {
    const { t } = useTranslation();
    const { value, onChange } = props;
    const [visible, setVisible] = useState(false);
    const [dateValue, setDateValue] = useState(value);

    const dateValueShow = dateValue ? dayjs(dateValue).format('YYYY-MM-DD') : t('please enter the date');

    const openPicker = () => setVisible(true);
    const closePicker = () => setVisible(false);
    const selectDateValue = (value) => {
      setDateValue(value);
      onChange(value);
      setVisible(false);
    };
    return (
      <>
        <Button onClick={openPicker}>{dateValueShow}</Button>
        <DatePicker visible={visible} value={dateValue} onClose={closePicker} onConfirm={selectDateValue} />
      </>
    );
  },
  mapProps((props) => {
    return { ...props };
  }),
  mapReadPretty((props) => {
    const changeProps = { ...props };
    changeProps.value = props.value ? dayjs(props.value).format('YYYY-MM-DD') : '';
    return <div>{changeProps.value}</div>;
  }),
);
export default MDatePicker;

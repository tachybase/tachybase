import React, { useRef, useState } from 'react';
import { connect, mapProps } from '@tachybase/schema';

import { Button } from 'antd';

import ModalFullScreen from '../modal-full-screen/ModalFullScreen';
import Sheet, { SheetRef } from './Sheet';

const ExcelFileComponent = (props) => {
  const { title, disabled, value, onChange } = props;
  const ref = useRef<SheetRef>();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const showModal = () => {
    setIsOpenModal(true);
  };
  const hideModal = () => {
    setIsOpenModal(false);
  };
  const handleOk = () => {
    const data = ref.current.getData();
    onChange(data);
    setIsOpenModal(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        {disabled ? '查看' : '编辑'}
      </Button>
      <ModalFullScreen title={title ?? 'Excel'} open={isOpenModal} onOk={handleOk} onCancel={hideModal}>
        <Sheet ref={ref} data={value || []} />
      </ModalFullScreen>
    </>
  );
};

export const ExcelFile = connect(
  ExcelFileComponent,
  mapProps((props) => ({
    ...props,
  })),
);

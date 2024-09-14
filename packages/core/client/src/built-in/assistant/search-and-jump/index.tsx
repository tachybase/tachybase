import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { Input, InputRef, Modal } from 'antd';

export const SearchAndJumpContext = createContext({
  open: false,
  setOpen: (open: boolean | ((open: boolean) => boolean)) => {},
});

export const SearchAndJumpProvider = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <SearchAndJumpContext.Provider value={{ open, setOpen }}>
      {children}
      <SearchAndJump open={open} setOpen={setOpen} />
    </SearchAndJumpContext.Provider>
  );
};

export const useSearchAndJump = () => {
  return useContext(SearchAndJumpContext);
};

export const SearchAndJump = ({ open, setOpen }) => {
  const inputRef = useRef<InputRef>();
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  }, [open, inputRef]);

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={<Input style={{ width: '100%' }} autoFocus ref={inputRef} />}
      closable={false}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <p></p>
    </Modal>
  );
};

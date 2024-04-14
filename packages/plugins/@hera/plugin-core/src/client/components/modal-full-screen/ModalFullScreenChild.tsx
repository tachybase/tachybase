import React from 'react';
import { css } from '@nocobase/client';
import { Button } from 'antd';

export const ModalHeader = (props) => {
  const { title, onOk, onCancel } = props;
  return (
    <div
      className={css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 50px;
        height: 50px;
        background-color: #e9e9e9;
      `}
    >
      <div
        className={css`
          font-size: 16px;
          font-weight: bold;
          color: #333333;
        `}
      >
        {title}
      </div>
      <div
        className={css`
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        `}
      >
        <Button
          className={css`
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-right: 20px;
          `}
          type="primary"
          onClick={onOk}
        >
          确认
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </div>
    </div>
  );
};

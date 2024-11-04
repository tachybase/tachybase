import React, { useContext } from 'react';

import { css } from '@emotion/css';
import { Button } from 'antd';
import cx from 'classnames';
import { useNavigate, useParams } from 'react-router';

import { Icon } from '../../icon';
import { PageStyleContext } from './PageStyle.provider';

export const Tag = ({ onClick, onClose, children, active }) => {
  return (
    <span
      onClick={onClick}
      className={cx(
        css`
          margin: 6px 2px;
          align-items: center;
          background-image: none;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 6px;
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.88);
          cursor: pointer;
          display: inline-flex;
          font-size: 14px;
          font-weight: 400;
          gap: 8px;
          height: 32px;
          justify-content: center;
          line-height: 1.5714285714285714;
          outline: none;
          padding: 4px 15px;
          position: relative;
          text-align: center;
          touch-action: manipulation;
          transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
          user-select: none;
          white-space: nowrap;
        `,
        active
          ? ''
          : css`
              background: transparent;
            `,
      )}
    >
      {children}
      <Button
        className={css`
          color: rgba(255, 255, 255, 0.88);
        `}
        type="text"
        onClick={onClose}
        icon={<Icon type="CloseOutlined" />}
      ></Button>
    </span>
  );
};

export const TabHeader = () => {
  const navigate = useNavigate();
  const { items, setItems } = useContext(PageStyleContext);
  const params = useParams<{ name?: string }>();
  return items.map((item) => (
    <Tag
      key={item.key}
      active={item.key === params.name}
      onClick={() => {
        navigate(`/admin/${item.key}`);
      }}
      onClose={() => {
        setItems((items) => {
          return items.filter((i) => i.key !== item.key);
        });
      }}
    >
      {item.label}
    </Tag>
  ));
};

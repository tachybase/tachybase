import React, { useRef, useState } from 'react';

import { css } from '@emotion/css';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';

import { useDesignable } from '../../schema-component';
import { useJoystick } from './useJoystick';

export const dragAssistant = {
  name: 'dragAssistant',
  useLoadMethod: () => {
    const [enableDragable, setEnableDragable] = useState(false);
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>() as any;
    useJoystick(ref);
    return {
      title: t('Drag Assistant'),
      actionProps: {
        onClick: () => {
          setEnableDragable((enable) => !enable);
        },
      },
      children() {
        return (
          enableDragable && (
            <div
              ref={ref}
              className={css`
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                z-index: 30;
                width: 100vw;
                height: 100vh;
                background-color: rgba(141, 141, 113, 0.274);
              `}
            ></div>
          )
        );
      },
    };
  },
};

export const designerMode = {
  name: 'designerMode',
  useLoadMethod: () => {
    const { designable, setDesignable } = useDesignable() as any;
    const { t } = useTranslation();
    return {
      title: t('Designer Mode'),
      actionProps: {
        onClick: () => {
          setDesignable(!designable);
        },
      },
    };
  },
};

export const fullScreen = {
  name: 'fullScreen',
  useLoadMethod: ({ position }) => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    return {
      title: t('Full Screen'),
      actionProps: {
        onClick: () => {
          checkedAutoPage(position, message, t);
        },
      },
    };
  },
};

export const disableRightMenu = {
  name: 'disableRightMenu',
  useLoadMethod: ({ enable, setEnable }) => {
    return {
      title: 'Disable Right Menu',
      actionProps: {
        onClick: () => {
          setEnable(!enable);
        },
      },
    };
  },
};

const checkedAutoPage = (position, message, t) => {
  const layoutSider = document.querySelector('.ant-layout-sider');
  const layoutContent = document.querySelector('.ant-layout-content');
  const sibling = layoutContent.previousElementSibling;
  if (!sibling.classList.contains('autoPage')) {
    const element = document.elementFromPoint(position?.x, position?.y);
    const blockElement = element.closest('.ant-card');
    const navbar = document.querySelector('.ant-layout-header');
    const navbarHeight = navbar.getBoundingClientRect();
    if (blockElement) {
      //需要展示的区块
      const copyBlockElement = blockElement.cloneNode(true);
      copyBlockElement.style.width = '100%';
      copyBlockElement.style.height = '90vh';
      copyBlockElement.style.overflow = 'auto';
      copyBlockElement.style.backgroundColor = '#ffffff';

      const autoNode = document.createElement('div');
      autoNode.style.marginTop = `${navbarHeight.height}px`;
      autoNode.style.width = '100%';
      autoNode.className = 'autoPage';
      //退出按钮
      const exitNode = document.createElement('div');
      exitNode.style.width = '100%';
      exitNode.style.height = '4vh';
      exitNode.style.textAlign = 'center';
      exitNode.style.lineHeight = '4vh';
      exitNode.style.backgroundColor = '#e6e6e6';
      exitNode.textContent = `${t('Exit Full Screen')}`;
      autoNode.appendChild(exitNode);
      autoNode.appendChild(copyBlockElement);
      autoNode.addEventListener('click', () => {
        removeNode(layoutSider);
      });
      const fragment = document.createDocumentFragment();
      fragment.appendChild(autoNode);
      layoutSider.style.display = 'none';
      layoutContent.style.display = 'none';
      layoutContent?.parentNode.insertBefore(fragment, layoutContent);
    } else {
      message.warning(t('There are no full screen blocks available at the current location'));
    }
  } else {
    removeNode(layoutSider);
  }
};

const removeNode = (layoutSider) => {
  const layoutContent = document.querySelector('.ant-layout-content');
  const sibling = layoutContent.previousElementSibling;
  layoutSider.style.display = 'block';
  layoutContent.style.display = 'block';
  if (sibling.classList.contains('autoPage')) sibling.parentNode.removeChild(sibling);
};

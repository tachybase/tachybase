import React, { useRef, useState } from 'react';
import { uid } from '@tachybase/utils/client';

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
  const element = document.elementFromPoint(position?.x, position?.y);
  const blockElement = element.closest('.ant-card');
  const gridRow = blockElement?.closest('.CardRow');
  const navbar = document.querySelector('.ant-layout-header');
  const modal = blockElement.closest('.ant-modal-body');
  const amplifierBlock = blockElement.closest('.amplifier-block');
  const navbarHeight = navbar.getBoundingClientRect();
  const classId = uid();
  if (blockElement) {
    const page = blockElement?.closest('.ant-tb-page ');
    const drawer = blockElement?.closest('.ant-drawer-body');
    const modal = blockElement?.closest('.ant-modal-body');
    const tabNav = amplifierBlock.querySelector('.ant-tabs-nav');
    if (tabNav) tabNav.style.display = 'none';
    const parentNode = gridRow.parentNode;
    Array.from(parentNode.children).forEach((sibling) => {
      if (sibling !== gridRow) {
        sibling.style.display = 'none';
      }
    });
    const autoNode = document.createElement('div');
    autoNode.style.width = amplifierBlock.getBoundingClientRect().width + 'px';
    autoNode.className = 'autoPage' + classId;
    autoNode.style.position = 'fixed';
    autoNode.style.top = '0';
    autoNode.style.zIndex = '100';
    //退出按钮
    const exitNode = document.createElement('div');
    exitNode.style.width = '100%';
    exitNode.style.height = '30px';
    exitNode.style.textAlign = 'center';
    exitNode.style.lineHeight = '30px';
    exitNode.style.backgroundColor = '#e6e6e6';
    exitNode.textContent = `${t('Exit Full Screen')}`;
    autoNode.appendChild(exitNode);
    autoNode.addEventListener('click', () => {
      removeNode({ gridRow, classId });
    });

    if (page) {
      autoNode.style.marginTop = `${navbarHeight.height}px`;
      const header = document.querySelector('.ant-page-header');
      const layoutSider = document.querySelector('.ant-layout-sider');
      header.style.display = 'none';
      layoutSider.style.display = 'none';
      page.style.marginTop = '30px';
      page.insertAdjacentElement('beforebegin', autoNode);
    } else if (drawer) {
      autoNode.style.position = '';
      drawer.insertAdjacentElement('beforebegin', autoNode);
    } else if (modal) {
      autoNode.style.position = '';
      autoNode.style.width = '100%';
      modal.insertAdjacentElement('beforebegin', autoNode);
    }
  } else {
    message.warning(t('There are no full screen blocks available at the current location'));
  }
};

const removeNode = ({ gridRow: blockElement, classId }) => {
  const page = blockElement?.closest('.ant-tb-page ');
  const drawer = blockElement?.closest('.ant-drawer-body');
  const parentNode = blockElement.parentNode;
  const tabNav = document.querySelector('.ant-tabs-nav');
  if (tabNav) tabNav.style.display = '';
  Array.from(parentNode.children).forEach((sibling) => {
    if (sibling !== blockElement) {
      sibling.style.display = '';
    }
    if ((sibling.id as string).includes('DndDescribedBy')) {
      sibling.style.display = 'none';
    }
  });
  if (page) {
    page.style.marginTop = '';
    const layoutSider = document.querySelector('.ant-layout-sider');
    const header = document.querySelector('.ant-page-header');
    layoutSider.style.display = '';
    header.style.display = '';
  } else if (drawer) {
    drawer.style.marginTop = '';
  }

  const autoPage = document.querySelector('.autoPage' + classId);

  if (autoPage) autoPage.parentNode.removeChild(autoPage);
};

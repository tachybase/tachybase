import { uid } from '@tachybase/utils/client';

import { App } from 'antd';
import { useTranslation } from 'react-i18next';

import { useDesignable } from '../../schema-component';

// TASK 1 分享页面禁用设计者模式
// 设计模式开关
export const designerMode = {
  name: 'designerMode',
  useLoadMethod: () => {
    // 使用url判断是否为share界面
    const isSharePage = window.location.pathname.includes('/share');
    const { designable, setDesignable } = useDesignable() as any;
    const { t } = useTranslation();
    if (isSharePage) return null;
    return {
      title: t('Designer mode'),
      actionProps: {
        onClick: () => {
          setDesignable(!designable);
        },
      },
    };
  },
};

// 切换全屏开关
export const fullScreen = {
  name: 'fullScreen',
  useLoadMethod: ({ position }) => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    return {
      title: t('Fullscreen'),
      actionProps: {
        onClick: () => {
          checkedAutoPage(position, message, t);
        },
      },
    };
  },
};

// 右键禁用开关
export const disableRightMenu = {
  name: 'disableRightMenu',
  sort: 4,
  useLoadMethod: ({ enable, setEnable }) => {
    const { t } = useTranslation();
    return {
      title: t('Disable contextmenu'),
      actionProps: {
        onClick: () => {
          setEnable(!enable);
        },
      },
    };
  },
};

// 显示隐藏滚动区域开关
export const showScrollArea = {
  name: 'showScrollArea',
  sort: 3,
  useLoadMethod: ({ showScrollArea, setShowScrollArea }) => {
    const { t } = useTranslation();
    return {
      title: showScrollArea ? t('Hidden scroll area') : t('Show scroll area'),
      actionProps: {
        onClick: () => {
          setShowScrollArea(!showScrollArea);
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
    const page = blockElement?.closest('.ant-tb-page ') as HTMLElement;
    const drawer = blockElement?.closest('.ant-drawer-body');
    const modal = blockElement?.closest('.ant-modal-body');
    const tabNav = amplifierBlock.querySelector('.ant-tabs-nav') as HTMLElement;
    if (tabNav) tabNav.style.display = 'none';
    const parentNode = gridRow.parentNode;
    Array.from(parentNode.children).forEach((sibling: HTMLElement) => {
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
    exitNode.textContent = `${t('Exit fullscreen')}`;
    autoNode.appendChild(exitNode);
    autoNode.addEventListener('click', () => {
      removeNode({ gridRow, classId });
    });

    if (page) {
      autoNode.style.marginTop = `${navbarHeight.height}px`;
      const header = document.querySelector('.ant-page-header') as HTMLElement;
      const layoutSider = document.querySelector('.ant-layout-sider') as HTMLElement;
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
    message.warning(t('There are no fullscreen blocks available at the current location'));
  }
};

const removeNode = ({ gridRow: blockElement, classId }) => {
  const page = blockElement?.closest('.ant-tb-page') as HTMLElement;
  const drawer = blockElement?.closest('.ant-drawer-body') as HTMLElement;
  const parentNode = blockElement.parentNode;
  const tabNav = document.querySelector('.ant-tabs-nav') as HTMLElement;
  if (tabNav) tabNav.style.display = '';
  Array.from(parentNode.children).forEach((sibling: HTMLElement) => {
    if (sibling !== blockElement) {
      sibling.style.display = '';
    }
    if ((sibling.id as string).includes('DndDescribedBy')) {
      sibling.style.display = 'none';
    }
  });
  if (page) {
    page.style.marginTop = '';
    const layoutSider = document.querySelector('.ant-layout-sider') as HTMLElement;
    const header = document.querySelector('.ant-page-header') as HTMLElement;
    layoutSider.style.display = '';
    header.style.display = '';
  } else if (drawer) {
    drawer.style.marginTop = '';
  }

  const autoPage = document.querySelector('.autoPage' + classId);

  if (autoPage) autoPage.parentNode.removeChild(autoPage);
};

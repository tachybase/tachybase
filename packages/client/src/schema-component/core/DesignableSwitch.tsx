import React from 'react';

import { HighlightOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';

import { useDesignable } from '..';
import { Icon } from '../../icon';
import { useToken } from '../../style';

export const DesignableSwitch = () => {
  const { designable, setDesignable } = useDesignable();
  const { t } = useTranslation();
  const { token } = useToken();

  // 检测是否为分享页面，如果是则不渲染
  const isSharePage = typeof window !== 'undefined' && window.location.pathname.includes('/share');
  if (isSharePage) {
    return null;
  }

  const style = {};
  if (designable) {
    style['backgroundColor'] = 'var(--colorSettings)';
  }

  // 快捷键切换编辑状态
  useHotkeys('Ctrl+Shift+U', () => setDesignable(!designable), [designable]);

  return (
    <Tooltip title={t('UI Editor')}>
      <Button
        data-testid={'ui-editor-button'}
        icon={<Icon type="Design" style={{ color: token.colorTextHeaderMenu, fill: token.colorTextHeaderMenu }} />}
        title={t('UI Editor')}
        style={style}
        onClick={() => {
          setDesignable(!designable);
        }}
      />
    </Tooltip>
  );
};

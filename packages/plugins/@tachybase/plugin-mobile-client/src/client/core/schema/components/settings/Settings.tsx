import React from 'react';
import { css, cx, SettingsMenu, SortableItem, useDesigner } from '@tachybase/client';

import { SettingsDesigner } from './Settings.Designer';

export const InternalSettings = () => {
  const Designer = useDesigner();
  return (
    <SortableItem
      className={cx(
        'tb-mobile-setting',
        css`
          margin-bottom: var(--tb-spacing);
        `,
      )}
    >
      <Designer />
      <SettingsMenu redirectUrl="/mobile" />
    </SortableItem>
  );
};
export const MSettings = InternalSettings as unknown as typeof InternalSettings & {
  Designer: typeof SettingsDesigner;
};

MSettings.Designer = SettingsDesigner;

import React from 'react';
import { css } from '@tachybase/client';

export default function WeChatQrComponent() {
  return (
    <fieldset
      className={css`
        display: flex;
        gap: 0.5em;
        max-height: 17vh;
      `}
    >
      <div id="wechat_qr_container"></div>
    </fieldset>
  );
}

import React from 'react';
import { AppNotFound, css } from '@tachybase/client';

import { Button, ErrorBlock } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

export const MAppNotFound = () => {
  const navigate = useNavigate();
  const path = window.location.pathname.split('/');
  const isMobile = path[1] === 'mobile';
  return isMobile ? (
    <ErrorBlock
      status="empty"
      title="Sorry, the page you visited does not exist."
      description={
        <Button onClick={() => navigate('/mobile', { replace: true })} color="primary">
          Back Home
        </Button>
      }
      className={css`
        .adm-error-block-image {
          height: 30vh;
        }
        .adm-error-block-description-title {
          font-size: 50px;
        }
        .adm-error-block-description-subtitle {
          font-size: 50px;
        }
        button {
          width: 20vh;
          height: 3.5vh;
          font-size: 50px;
        }
      `}
    />
  ) : (
    <AppNotFound />
  );
};

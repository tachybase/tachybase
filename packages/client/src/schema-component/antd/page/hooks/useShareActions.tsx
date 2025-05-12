import { useEffect, useRef, useState } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { Button, message } from 'antd';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router';

import { useCurrentUserVariable } from '../../../../schema-settings';

export const UseShareActions = ({ title }) => {
  const fieldSchema = useFieldSchema();
  const isAdmin = useMatch('/admin/:name');
  const isShare = useMatch('/share/:name');
  const currentRoute = isAdmin || isShare;
  const link = window.location.href
    .replace('/admin', '/share')
    .replace(currentRoute?.params?.name, fieldSchema['x-uid'])
    .replace(window.location.search || '', '');
  const { t } = useTranslation();
  const [qrLink, setQrLink] = useState();
  QRCode.toDataURL(link, { width: 170 }, (err, url) => {
    if (err) {
      console.error(err);
      return;
    }
    if (!qrLink) {
      setQrLink(url);
    }
  });
  const copyLink = () => {
    navigator.clipboard.writeText(link).then((res) => {
      message.success(`${t('Replicated')}${title}${t('page link')}`);
    });
  };

  const imageAction = () => {
    return <ImageModal link={qrLink} title={title} />;
  };
  return {
    copyLink,
    imageAction,
  };
};

const ImageModal = (props) => {
  const { link, title } = props;
  const canvasRef = useRef(null);
  const { t } = useTranslation();
  const { currentUserCtx } = useCurrentUserVariable();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentUserCtx.nickname}`, canvas.width / 2, 20);

    const img = new Image();
    img.src = link;
    img.onload = () => {
      ctx.drawImage(img, 5, 25);
    };

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('Scan the code to view the sharing'), canvas.width / 2, 210);

    ctx.strokeStyle = '#AAAAAA';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 218);
    ctx.lineTo(250, 218);
    ctx.stroke();

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('灵矶(Tachybase)', canvas.width / 2, 235);
  }, []);

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'Tachybase-Share.png';
      link.click();
    }
  };

  const copyImage = () => {
    const canvas = canvasRef.current;
    if (canvas && navigator.clipboard) {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          message.success(`${t('Replicated')}${title}${t('QR code')}`);
        } catch (err) {
          message.error(t('Copy failed, please try again'));
        }
      }, 'image/png');
    }
  };

  return (
    <div
      style={{
        marginTop: '23px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        width={180}
        height={250}
        style={{ border: '1px solid black', backgroundColor: 'white' }}
      />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '18px', gap: '15px' }}>
        <Button onClick={saveImage} style={{ flex: 1 }}>
          {t('Save Picture')}
        </Button>
        <Button onClick={copyImage} style={{ flex: 1 }}>
          {t('Copy QR code')}
        </Button>
      </div>
    </div>
  );
};

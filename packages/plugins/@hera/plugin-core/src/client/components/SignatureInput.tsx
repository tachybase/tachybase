import { connect, mapProps } from '@nocobase/schema';
import { Button } from 'antd';
import React, { useRef, useEffect } from 'react';
import SignaturePad from './SignaturePad';

export const SignatureInput = connect(
  (props) => {
    const { onChange, value } = props;
    const signatureRef = useRef(null);
    useEffect(() => {
      if (value) {
        signatureRef.current.fromDataURL(value);
      }
    }, []);
    const handleClear = () => {
      if (signatureRef.current) {
        signatureRef.current.clear();
        onChange && onChange('');
      }
    };
    const handleSave = () => {
      if (signatureRef.current) {
        const signatureDataURL = signatureRef.current.toDataURL();
        onChange && onChange(signatureDataURL);
      }
    };
    const divStyle: any = {
      pointerEvents: props.disabled ? 'none' : 'auto',
      opacity: props.disabled ? 0.8 : 1,
    };
    return (
      <div style={divStyle}>
        <SignaturePad ref={signatureRef} options={{ penColor: 'black', backgroundColor: 'lightgrey' }} />
        {!props.disabled && (
          <div>
            <Button onClick={handleClear}>清空</Button>
            <Button onClick={handleSave}>确认</Button>
          </div>
        )}
      </div>
    );
  },
  mapProps((props, field) => {
    return {
      ...props,
    };
  }),
);

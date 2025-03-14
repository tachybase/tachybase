import React, { useState } from 'react';

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Space } from 'antd';

import { usePasswordValidator } from '../hooks/usePasswordValidator';
import { tval } from '../locale';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  username?: string;
  placeholder?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value = '',
  onChange,
  username,
  placeholder = tval('Please input your password'),
}) => {
  const [password, setPassword] = useState(value);
  const { validatePassword } = usePasswordValidator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPassword(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.Password
        value={password}
        onChange={handleChange}
        placeholder={placeholder}
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      {password && <PasswordStrengthIndicator password={password} username={username} />}
    </Space>
  );
};

// 用于表单验证的函数
export const validatePasswordStrength = (username?: string) => {
  const { validatePassword } = usePasswordValidator();

  return {
    validator: (_: any, value: string) => {
      if (!value) {
        return Promise.resolve();
      }

      const result = validatePassword(value, username);
      if (!result.valid) {
        return Promise.reject(new Error(result.message));
      }

      return Promise.resolve();
    },
  };
};

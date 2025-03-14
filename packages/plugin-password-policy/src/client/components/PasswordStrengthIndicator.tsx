import React, { useEffect, useState } from 'react';

import { Progress, Space, Typography } from 'antd';

import { PasswordStrengthLevel } from '../../constants';
import { usePasswordValidator } from '../hooks/usePasswordValidator';
import { tval } from '../locale';

const { Text } = Typography;

interface PasswordStrengthIndicatorProps {
  password: string;
  username?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password, username }) => {
  const { config, validatePassword } = usePasswordValidator();
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setMessage('');
      setIsValid(false);
      return;
    }

    const result = validatePassword(password, username);
    setIsValid(result.valid);

    if (!result.valid) {
      setStrength(20);
      setMessage(result.message || '');
      return;
    }

    // 计算密码强度
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const typesCount = [hasLowerCase, hasUpperCase, hasDigit, hasSymbol].filter(Boolean).length;

    let strengthValue = 0;

    switch (config.strengthLevel) {
      case PasswordStrengthLevel.None:
        strengthValue = Math.min(100, password.length * 10);
        setMessage(tval('No password strength requirements'));
        break;
      case PasswordStrengthLevel.NumberAndLetter:
        strengthValue = 60;
        setMessage(tval('Password strength: Medium'));
        break;
      case PasswordStrengthLevel.NumberAndLetterAndSymbol:
      case PasswordStrengthLevel.NumberAndLetterAndUpperAndLower:
      case PasswordStrengthLevel.NumberAndLetterAndUpperAndLowerAndSymbol3:
        strengthValue = 80;
        setMessage(tval('Password strength: Strong'));
        break;
      case PasswordStrengthLevel.NumberAndLetterAndUpperAndLowerAndSymbol:
        strengthValue = 100;
        setMessage(tval('Password strength: Very Strong'));
        break;
    }

    setStrength(strengthValue);
  }, [password, username, config, validatePassword]);

  const getProgressStatus = () => {
    if (!password) return 'normal';
    if (!isValid) return 'exception';
    if (strength < 60) return 'normal';
    if (strength < 80) return 'active';
    return 'success';
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Progress percent={strength} status={getProgressStatus()} showInfo={false} />
      {message && <Text type={isValid ? 'success' : 'danger'}>{message}</Text>}
    </Space>
  );
};

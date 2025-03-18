import { useEffect, useState } from 'react';
import { useAPIClient } from '@tachybase/client';

import { PasswordStrengthLevel } from '../../constants';
import { tval } from '../locale';

interface PasswordConfig {
  minLength: number;
  strengthLevel: PasswordStrengthLevel;
  notContainUsername: boolean;
  historyCount: number;
}

export const usePasswordValidator = () => {
  const api = useAPIClient();
  const [config, setConfig] = useState<PasswordConfig>({
    minLength: 0,
    strengthLevel: PasswordStrengthLevel.None,
    notContainUsername: false,
    historyCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const { data } = await api.resource('passwordStrengthConfig').list({
          pageSize: 1,
        });

        if (data.length > 0) {
          setConfig({
            minLength: data[0].minLength,
            strengthLevel: data[0].strengthLevel,
            notContainUsername: data[0].notContainUsername,
            historyCount: data[0].historyCount,
          });
        }
      } catch (error) {
        console.error('Failed to load password strength config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [api]);

  const validatePassword = (password: string, username?: string): { valid: boolean; message?: string } => {
    // 如果未启用强度验证，直接返回
    if (config.strengthLevel === PasswordStrengthLevel.None) {
      return { valid: true };
    }

    // 检查密码长度
    if (config.minLength && password.length < config.minLength) {
      return {
        valid: false,
        message: tval('Password must be at least {{length}} characters long').replace(
          '{{length}}',
          String(config.minLength),
        ),
      };
    }

    // 检查密码是否包含用户名
    if (config.notContainUsername && username && password.toLowerCase().includes(username.toLowerCase())) {
      return {
        valid: false,
        message: tval('Password cannot contain username'),
      };
    }

    // 根据强度级别验证密码
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    switch (config.strengthLevel) {
      case PasswordStrengthLevel.NumberAndLetter: // 必须包含字母和数字
        if (!(hasLowerCase || hasUpperCase) || !hasDigit) {
          return {
            valid: false,
            message: tval('Password must contain both letters and numbers'),
          };
        }
        break;
      case PasswordStrengthLevel.NumberAndLetterAndSymbol: // 必须包含字母、数字和符号
        if (!(hasLowerCase || hasUpperCase) || !hasDigit || !hasSymbol) {
          return {
            valid: false,
            message: tval('Password must contain letters, numbers, and symbols'),
          };
        }
        break;
      case PasswordStrengthLevel.NumberAndLetterAndUpperAndLower: // 必须包含数字、大写和小写字母
        if (!hasLowerCase || !hasUpperCase || !hasDigit) {
          return {
            valid: false,
            message: tval('Password must contain numbers, uppercase and lowercase letters'),
          };
        }
        break;
      case PasswordStrengthLevel.NumberAndLetterAndUpperAndLowerAndSymbol: // 必须包含数字、大写和小写字母、符号
        if (!hasLowerCase || !hasUpperCase || !hasDigit || !hasSymbol) {
          return {
            valid: false,
            message: tval('Password must contain numbers, uppercase and lowercase letters, and symbols'),
          };
        }
        break;
      case PasswordStrengthLevel.NumberAndLetterAndUpperAndLowerAndSymbol3: // 必须包含以下字符的其中3种：数字、大写字母、小写字母和特殊字符
        const typesCount = [hasLowerCase, hasUpperCase, hasDigit, hasSymbol].filter(Boolean).length;
        if (typesCount < 3) {
          return {
            valid: false,
            message: tval(
              'Password must contain at least 3 of the following: numbers, uppercase letters, lowercase letters, and symbols',
            ),
          };
        }
        break;
    }

    return { valid: true };
  };

  return {
    config,
    loading,
    validatePassword,
  };
};

import { useEffect, useState } from 'react';
import { useAPIClient } from '@tachybase/client';

interface PasswordStrengthConfig {
  minLength: number;
  strengthLevel: number;
  notContainUsername: boolean;
  historyCount: number;
}

export function usePasswordStrength() {
  const api = useAPIClient();
  const [config, setConfig] = useState<PasswordStrengthConfig>({
    minLength: 8,
    strengthLevel: 0,
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

  return {
    config,
    loading,
  };
}

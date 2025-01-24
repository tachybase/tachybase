import { useMemo } from 'react';

export const useEventSourceOptions = (type) => {
  // 根据 type 返回相应的 options
  const options = useMemo(() => {
    switch (type) {
      case 'code':
        return [
          { title: 'Code Option 1', type: 'codeOption1' },
          { title: 'Code Option 2', type: 'codeOption2' },
        ];
      case 'webhook':
        return [
          { title: 'Webhook Option 1', type: 'webhookOption1' },
          { title: 'Webhook Option 2', type: 'webhookOption2' },
        ];
      default:
        return [];
    }
  }, [type]);

  return options;
};

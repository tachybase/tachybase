import { useTranslation } from 'react-i18next';

import { Plugin } from '../../application/Plugin';
import { ScrollAssistantProvider } from './ScrollAssistant.provider';
import { useScrollAssistantStatus } from './ScrollAssistantStatus.provider';

export const scrollAssistant = {
  name: 'scrollAssistant',
  useLoadMethod: () => {
    const { setEnable } = useScrollAssistantStatus();
    const { t } = useTranslation();
    return {
      title: t('Scroll assistant'),
      actionProps: {
        onClick: () => {
          setEnable((enable) => !enable);
        },
      },
    };
  },
};

export class ScrollAssistantPlugin extends Plugin {
  async load() {
    this.app.use(ScrollAssistantProvider);
    this.app.pluginContextMenu.add(scrollAssistant.name, scrollAssistant);
  }
}

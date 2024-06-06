import { Plugin, useCollection } from '@tachybase/client';

import { tval } from '../../../locale';
import { APIRegularInitializer } from './APIRegular.schema';
import { APIRegularActionSettings } from './APIRegular.setting';
import { usePropsAPIRegular } from './hooks';

export class KitAPIRegularUsage extends Plugin {
  async load() {
    this.app.addComponents({
      APIRegularInitializer,
    });

    this.app.addScopes({
      usePropsAPIRegular,
    });

    this.app.schemaSettingsManager.add(APIRegularActionSettings);

    ['table', 'details'].forEach((block) => {
      this.app.schemaInitializerManager.addItem(`${block}:configureActions`, 'customize.APIRegular', {
        title: tval('Regular workflow'),
        Component: 'APIRegularInitializer',
        name: 'apiRegular',
        useVisible() {
          const collection = useCollection();
          return (
            (collection.template !== 'view' || collection?.writableView) &&
            collection.template !== 'file' &&
            collection.template !== 'sql'
          );
        },
      });
    });
  }
}

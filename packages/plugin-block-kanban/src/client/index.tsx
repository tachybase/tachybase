import React from 'react';
import { Action, Plugin, SchemaComponentOptions } from '@tachybase/client';

import { Kanban } from './Kanban';
import { KanbanCard } from './Kanban.Card';
import { KanbanCardDesigner, kanbanCardInitializers } from './Kanban.Card.Designer';
import { KanbanCardViewer } from './Kanban.CardViewer';
import { KanbanDesigner } from './Kanban.Designer';
import { kanbanSettings } from './Kanban.Settings';
import { kanbanActionInitializers } from './KanbanActionInitializers';
import { KanbanBlockInitializer } from './KanbanBlockInitializer';
import { KanbanBlockProvider, useKanbanBlockProps } from './KanbanBlockProvider';

Kanban.Card = KanbanCard;
Kanban.CardAdder = Action;
Kanban.CardViewer = KanbanCardViewer;
Kanban.Card.Designer = KanbanCardDesigner;
Kanban.Designer = KanbanDesigner;

const KanbanV2 = Kanban;

const KanbanPluginProvider = React.memo((props: { children: React.ReactNode }) => {
  return (
    <SchemaComponentOptions
      components={{ Kanban, KanbanBlockProvider, KanbanV2, KanbanBlockInitializer }}
      scope={{ useKanbanBlockProps }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
});
KanbanPluginProvider.displayName = 'KanbanPluginProvider';

class KanbanPlugin extends Plugin {
  async load() {
    this.app.use(KanbanPluginProvider);
    this.app.schemaInitializerManager.add(kanbanCardInitializers);
    this.app.schemaInitializerManager.add(kanbanActionInitializers);
    this.app.schemaSettingsManager.add(kanbanSettings);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers?.add('dataBlocks.kanban', {
      title: '{{t("Kanban")}}',
      Component: 'KanbanBlockInitializer',
    });
  }
}

export default KanbanPlugin;

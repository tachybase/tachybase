import React from 'react';
import { ActionBar, CurrentAppInfoProvider, Plugin, SchemaComponentOptions } from '@tachybase/client';

import { Event } from './components/gantt/Event';
import { Gantt } from './components/gantt/gantt';
import { GanttDesigner } from './Gantt.Designer';
import { ganttSettings, oldGanttSettings } from './Gantt.Settings';
import { ganttActionInitializers, GanttActionInitializers_deprecated } from './GanttActionInitializers';
import { GanttBlockInitializer } from './GanttBlockInitializer';
import { GanttBlockProvider, useGanttBlockProps } from './GanttBlockProvider';
import { ViewMode } from './types/public-types';

Gantt.ActionBar = ActionBar;
Gantt.ViewMode = ViewMode;
Gantt.Designer = GanttDesigner;
Gantt.Event = Event;
export { Gantt };

const GanttProvider = React.memo((props: { children: React.ReactNode }) => {
  return (
    <SchemaComponentOptions
      components={{ Gantt, GanttBlockInitializer, GanttBlockProvider }}
      scope={{ useGanttBlockProps }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
});

GanttProvider.displayName = 'GanttProvider';
export class GanttPlugin extends Plugin {
  async load() {
    this.app.use(GanttProvider);
    this.app.schemaSettingsManager.add(oldGanttSettings);
    this.app.schemaSettingsManager.add(ganttSettings);
    this.app.schemaInitializerManager.add(GanttActionInitializers_deprecated);
    this.app.schemaInitializerManager.add(ganttActionInitializers);
    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers?.add('dataBlocks.gantt', {
      title: "{{t('Gantt')}}",
      Component: 'GanttBlockInitializer',
    });

    this.app.addScopes({
      useGanttBlockProps,
    });
  }
}

export default GanttPlugin;

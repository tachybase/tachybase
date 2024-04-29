import { observer } from '@tachybase/schema';

export const KanbanCardViewer: any = observer(
  (props: any) => {
    return props.children;
  },
  { displayName: 'KanbanCardViewer' },
);

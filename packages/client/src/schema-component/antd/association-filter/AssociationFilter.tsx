import React from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { createStyles } from 'antd-style';
import cls from 'classnames';

import { useSchemaInitializerRender } from '../../../application';
import { Plugin } from '../../../application/Plugin';
import { TableBlockProvider } from '../../../block-provider/TableBlockProvider';
import { useCollection_deprecated } from '../../../collection-manager';
import {
  associationFilterFilterBlockInitializer,
  filterCollapseItemInitializer,
} from '../../../modules/blocks/filter-blocks/collapse/filterCollapseItemInitializer';
import { DndContext, SortableItem } from '../../common';
import { useDesigner } from '../../hooks';
import { AssociationFilterBlockDesigner } from './AssociationFilter.BlockDesigner';
import { associationFilterInitializer } from './AssociationFilter.Initializer';
import { AssociationFilterItem } from './AssociationFilter.Item';
import { AssociationFilterItemDesigner } from './AssociationFilter.Item.Designer';

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      height: 100%;
      overflow-y: auto;
      position: relative;
      border-radius: ${token.borderRadiusLG}px;
      &:hover {
        > .general-schema-designer {
          display: block;
        }
      }
      &.tb-form-item:hover {
        > .general-schema-designer {
          background: var(--colorBgSettingsHover) !important;
          border: 0 !important;
          top: -5px !important;
          bottom: -5px !important;
          left: -5px !important;
          right: -5px !important;
        }
      }
      > .general-schema-designer {
        position: absolute;
        z-index: 999;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: none;
        border: 2px solid var(--colorBorderSettingsHover);
        pointer-events: none;
        > .general-schema-designer-icons {
          position: absolute;
          right: 2px;
          top: 2px;
          line-height: 16px;
          pointer-events: all;
          .ant-space-item {
            background-color: var(--colorSettings);
            color: #fff;
            line-height: 16px;
            width: 16px;
            padding-left: 1px;
            align-self: stretch;
          }
        }
      }
    `,
  };
});

export const AssociationFilter = (props) => {
  const Designer = useDesigner();
  const filedSchema = useFieldSchema();
  const { styles } = useStyles();

  const { render } = useSchemaInitializerRender(filedSchema['x-initializer'], filedSchema['x-initializer-props']);

  return (
    <DndContext>
      <SortableItem className={cls('tb-block-item', props.className, styles.container)}>
        <Designer />
        {props.children}
        {render()}
      </SortableItem>
    </DndContext>
  );
};

AssociationFilter.Provider = TableBlockProvider;
AssociationFilter.Item = AssociationFilterItem as typeof AssociationFilterItem & {
  Designer: typeof AssociationFilterItemDesigner;
};
AssociationFilter.Item.Designer = AssociationFilterItemDesigner;
AssociationFilter.BlockDesigner = AssociationFilterBlockDesigner;

AssociationFilter.useAssociationField = () => {
  const fieldSchema = useFieldSchema();
  const { getField } = useCollection_deprecated();
  return React.useMemo(() => getField(fieldSchema.name as any), [fieldSchema.name]);
};

export class AssociationFilterPlugin extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(associationFilterFilterBlockInitializer);
    this.app.schemaInitializerManager.add(filterCollapseItemInitializer);
    this.app.schemaInitializerManager.add(associationFilterInitializer);
  }
}

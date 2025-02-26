import { useMemo } from 'react';
import { ActionBar, canMakeAssociationBlock, Plugin, useCollection, useCollectionManager } from '@tachybase/client';

import { CommentBlockActionInitializer } from './CommentBlockActionInitializer';
import { CommentBlockInitializer } from './CommentBlockInitializer';
import { CommentBlockSchemaSettings } from './CommentBlockSchemaSettings';
import { CommentCollectionTemplate } from './CommentCollectionTemplate';
import { CommentDecorator } from './CommentDecorator';
import { CommentItem } from './CommentItem';
import { CommentList } from './CommentList';
import { CommentSubmit } from './CommentSubmit';
import { tval } from './locale';
import { QuoteReplyCommentActionButton } from './QuoteReplyCommentActionButton';
import { QuoteReplyCommentActionInitializer } from './QuoteReplyCommentActionInitializer';
import { UpdateCommentActionButton } from './UpdateCommentActionButton';
import { UpdateCommentActionInitializer } from './UpdateCommentActionInitializer';
import { useCommentBlockDecoratorProps } from './useCommentBlockDecoratorProps';

const Comment = () => null;
Comment.ActionBar = ActionBar;
Comment.List = CommentList;
Comment.Item = CommentItem;
Comment.Decorator = CommentDecorator;
Comment.Submit = CommentSubmit;

class PluginComments extends Plugin {
  async load() {
    this.app.dataSourceManager.addCollectionTemplates([CommentCollectionTemplate]);
    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.comment', {
      title: tval('Comment'),
      Component: 'CommentBlockInitializer',
      useComponentProps() {
        return {
          filterCollections({ collection }) {
            return collection.template === 'comment';
          },
        };
      },
    });

    this.app.schemaInitializerManager.addItem('popup:common:addBlock', 'dataBlocks.comment', {
      title: tval('Comment'),
      Component: 'CommentBlockInitializer',
      useVisible() {
        const collection = useCollection();
        return useMemo(
          () =>
            collection.fields.some(
              (field) => canMakeAssociationBlock(field) && ['hasMany', 'belongsToMany'].includes(field.type),
            ),
          [collection.fields],
        );
      },
      useComponentProps() {
        const cm = useCollectionManager();
        return {
          onlyCurrentDataSource: true,
          filterCollections({ associationField: field }) {
            if (field) {
              if (!['hasMany', 'belongsToMany'].includes(field.type)) return false;
              const collection = cm.getCollection(field.target);
              return collection?.template === 'comment';
            }
            return false;
          },
          filterOtherRecordsCollection(collection) {
            return collection?.template === 'comment';
          },
          showAssociationFields: true,
          hideOtherRecordsInPopup: false,
          hideSearch: true,
        };
      },
    });
    this.app.addComponents({
      CommentBlockInitializer,
      Comment,
      UpdateCommentActionInitializer,
      UpdateCommentActionButton,
      QuoteReplyCommentActionButton,
      QuoteReplyCommentActionInitializer,
    });

    this.app.addScopes({ useCommentBlockDecoratorProps });
    this.schemaSettingsManager.add(CommentBlockSchemaSettings);
    this.schemaInitializerManager.add(CommentBlockActionInitializer);
  }
}

export default PluginComments;

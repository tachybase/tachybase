import { ActionBar, Plugin, useCollection, canMakeAssociationBlock, useCollectionManager } from '@tachybase/client';
import { useMemo } from 'react';
import { tval } from './locale';
import { CommentList } from './CommentList';
import { CommentItem } from './CommentItem';
import { CommentCollectionTemplate } from './CommentCollectionTemplate';
import { CommentBlockSchemaSettings } from './CommentBlockSchemaSettings';
import { CommentBlockActionInitializer } from './CommentBlockActionInitializer';
import { QuoteReplyCommentActionInitializer } from './QuoteReplyCommentActionInitializer';
import { CommentSubmit } from './CommentSubmit';
import { CommentDecorator } from './CommentDecorator';
import { useCommentBlockDecoratorProps } from './useCommentBlockDecoratorProps';
import { QuoteReplyCommentActionButton } from './QuoteReplyCommentActionButton';
import { UpdateCommentActionButton } from './UpdateCommentActionButton';
import { UpdateCommentActionInitializer } from './UpdateCommentActionInitializer';
import { CommentBlockInitializer } from './CommentBlockInitializer';

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

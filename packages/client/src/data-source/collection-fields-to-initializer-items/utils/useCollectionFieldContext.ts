import { Form, ISchema, useFieldSchema, useForm } from '@tachybase/schema';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { InheritanceCollectionMixin } from '../../../collection-manager';
import { useCompile } from '../../../schema-component';
import { useActionContext } from '../../../schema-component/antd/action';
import { Collection } from '../../collection/Collection';
import { CollectionManager } from '../../collection/CollectionManager';
import { useCollectionManager } from '../../collection/CollectionManagerProvider';
import { useCollection } from '../../collection/CollectionProvider';
import { DataSource } from '../../data-source/DataSource';
import { DataSourceManager } from '../../data-source/DataSourceManager';
import { useDataSourceManager } from '../../data-source/DataSourceManagerProvider';
import { useDataSource } from '../../data-source/DataSourceProvider';

export interface CollectionFieldContext {
  fieldSchema: ISchema;
  collection?: InheritanceCollectionMixin & Collection;
  dataSource: DataSource;
  form: Form<any>;
  actionContext: ReturnType<typeof useActionContext>;
  t: TFunction<'translation', undefined>;
  collectionManager: CollectionManager;
  dataSourceManager: DataSourceManager;
  compile: (source: any, ext?: any) => any;
  targetCollection?: Collection;
}

export function useCollectionFieldContext(): CollectionFieldContext {
  const { t } = useTranslation();
  const collection = useCollection<InheritanceCollectionMixin>();
  const dataSourceManager = useDataSourceManager();
  const actionContext = useActionContext();
  const dataSource = useDataSource();
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const collectionManager = useCollectionManager();
  const compile = useCompile();

  return {
    t,
    compile,
    actionContext,
    fieldSchema,
    collection,
    dataSource,
    form,
    collectionManager,
    dataSourceManager,
  };
}

import { useCallback, useMemo } from 'react';
import {
  RecordProvider,
  useBlockRequestContext,
  useCollectionFields,
  useCollectionParentRecordData,
} from '@tachybase/client';
import { Field, observer, RecursionField, useField } from '@tachybase/schema';

import { Button, Card, Tooltip } from 'antd';
import dayjs from 'dayjs';

import { useTranslation } from './locale';
import { styles } from './styles';

export const CommentItem = observer(({ editing, setEditing, children }: any) => {
  const field = useField<Field>();
  const { t } = useTranslation();
  const { componentCls } = styles();
  const collectionParentRecordData = useCollectionParentRecordData();
  const { resource, service } = useBlockRequestContext();

  const updateResource = useCallback(async () => {
    await resource.update({
      filterByTk: field.value?.id,
      values: {
        content: field?.value?.content,
      },
    });

    service.refresh();
  }, [resource, service, field.value]);

  const collectionFields = useCollectionFields();

  const fieldProps = useMemo(() => {
    const targetField = collectionFields.find((field) => field.name === 'content');
    return targetField?.uiSchema?.['x-component-props'];
  }, [collectionFields]);

  const handleUpdateComment = () => {
    setEditing(false);
    updateResource();
    field.form.setFieldState(`${field.address}.content`, (targetField) => {
      targetField.pattern = 'readPretty';
    });
  };

  return (
    <RecordProvider record={field.value} parent={collectionParentRecordData}>
      <div className={`${componentCls}-item-container`}>
        <div className={`${componentCls}-item-container-line`}></div>
        <Card
          size="small"
          title={
            <div className={`${componentCls}-item-title`}>
              <div className={`${componentCls}-item-title-left`}>
                <span>{t('commented')}</span>
                <Tooltip title={dayjs(field?.value?.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{(dayjs(field?.value?.createdAt) as any).fromNow()}</span>
                </Tooltip>
              </div>
              <div className={`${componentCls}-item-title-right`}>{children}</div>
            </div>
          }
        >
          <RecursionField
            name="content"
            basePath={field.address}
            schema={{
              type: 'string',
              name: 'content',
              'x-component': 'MarkdownVditor',
              'x-component-props': {
                ...fieldProps,
                value: field?.value?.content,
              },
              'x-read-pretty': true,
            }}
          />
          {editing && (
            <div className={`${componentCls}-item-editor-button-area`}>
              <Button
                onClick={() => {
                  (field.form.setFieldState(`${field.address}.content`, (field) => {
                    field.pattern = 'readPretty';
                  }),
                    setEditing(false));
                }}
              >
                {t('Cancel')}
              </Button>
              <Button type="primary" onClick={handleUpdateComment}>
                {t('Update Comment')}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </RecordProvider>
  );
});

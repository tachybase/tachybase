import { SchemaSettings, SchemaSettingsItem, SchemaSettingsModalItem } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { useContextStepsForm } from '../contexts/stepsForm';
import { useTranslation } from '../locale';

export const stepTitleSettings = new SchemaSettings({
  name: 'settings:stepsFormStepTitleSettings',
  items: [
    {
      name: 'SchemaSettingsStepTitleItem',
      Component: () => {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const contextStepsForm = useContextStepsForm();
        return (
          <SchemaSettingsModalItem
            title={t('Edit')}
            schema={{
              type: 'object',
              title: t('Edit'),
              properties: {
                title: {
                  type: 'string',
                  title: t('Title'),
                  default: fieldSchema['x-content'],
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            }}
            onSubmit={(params) => {
              const { title } = params;
              contextStepsForm.changeStepTitle(fieldSchema.name, title);
            }}
          />
        );
      },
    },
    {
      name: 'SchemaSettingDeleteItem',
      Component: () => {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const contextStepsForm = useContextStepsForm();
        return (
          <SchemaSettingsItem
            title={t('Delete')}
            onClick={() => {
              contextStepsForm.deleteStep(fieldSchema.name);
            }}
          />
        );
      },
    },
  ],
});

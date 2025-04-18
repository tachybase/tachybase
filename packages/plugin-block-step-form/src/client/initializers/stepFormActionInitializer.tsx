import {
  ActionInitializer,
  InitializerWithSwitch,
  SchemaInitializer,
  SchemaInitializerItem,
  useAPIClient,
  useCollection,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { message } from 'antd';

import { useContextStepsForm } from '../contexts/stepsForm';
import { tval } from '../locale';
import { stepNextSettings } from '../settings/stepNext';
import { stepPreviousSettings } from '../settings/stepPrevious';
import { mergeSchemas } from '../tools/mergeSchema';

export const stepFormActionInitializer = new SchemaInitializer({
  name: 'stepsForm:configureActions',
  title: tval('Configure actions', { ns: 'core' }),
  icon: 'SettingOutlined',
  items: [
    {
      type: 'item',
      title: tval('Previous'),
      name: 'previousAction',
      Component: () => {
        const itemConfig = useSchemaInitializerItem();
        return (
          <InitializerWithSwitch
            {...itemConfig}
            item={itemConfig}
            type={'x-action'}
            schema={{
              type: 'void',
              title: tval('Previous'),
              'x-component': 'Action',
              'x-use-component-props': 'useStepsFormPreviousActionProps',
              'x-toolbar': 'ActionSchemaToolbar',
              'x-settings': stepPreviousSettings.name,
              'x-action': 'stepsform:previous',
              'x-align': 'right',
            }}
          />
        );
      },
    },
    {
      type: 'item',
      name: 'nextAction',
      title: tval('Next'),
      Component: () => {
        const itemConfig = useSchemaInitializerItem();
        return (
          <InitializerWithSwitch
            {...itemConfig}
            item={itemConfig}
            type={'x-action'}
            schema={{
              type: 'void',
              title: tval('Next'),
              'x-component': 'Action',
              'x-use-component-props': 'useStepsFormNextActionProps',
              'x-toolbar': 'ActionSchemaToolbar',
              'x-settings': stepNextSettings.name,
              'x-action': 'stepsform:next',
              'x-align': 'right',
            }}
          />
        );
      },
    },
    {
      type: 'item',
      title: tval('Done'),
      name: 'doneAction',
      Component: (props) => {
        const contextStepsForm = useContextStepsForm();
        const { isEdit } = contextStepsForm;
        const schema = {
          title: tval('Done'),
          'x-component': 'Action',
          'x-component-props': {
            type: 'primary',
          },
          'x-use-component-props': 'useStepsFormSubmitActionProps',
          'x-toolbar': 'ActionSchemaToolbar',
          'x-action': 'submit',
          'x-action-settings': {
            triggerWorkflows: [],
          },
        };

        return (
          <ActionInitializer
            schema={{
              ...schema,
              'x-settings': isEdit ? 'actionSettings:updateSubmit' : 'actionSettings:createSubmit',
            }}
          />
        );
      },
    },
    {
      title: tval('Request action'),
      name: 'requestAction',
      Component: () => {
        const { insert } = useSchemaInitializer();

        const itemConfig = useSchemaInitializerItem();
        const apiClient = useAPIClient();
        const resource = apiClient.resource('customRequests');

        const itemSchema = {
          title: tval('Custom request'),
          'x-component': 'CustomRequestAction',
          'x-action': 'customize:stepsform:request',
          'x-toolbar': 'ActionSchemaToolbar',
          'x-settings': 'actionSettings:customRequest',
          'x-decorator': 'CustomRequestAction.Decorator',
          'x-uid': uid(),
          'x-action-settings': {
            onSuccess: {
              manualClose: false,
              redirecting: false,
              successMessage: tval('Request success'),
            },
          },
          'x-use-component-props': 'useStepsFormCustomActionProps',
        };

        const handleClick = async () => {
          try {
            const mergedSchema = mergeSchemas(itemSchema, itemConfig.schema);

            itemConfig?.schemaInitialize?.(mergedSchema);

            insert(mergedSchema);

            await resource.create({
              values: {
                key: mergedSchema['x-uid'],
              },
            });
          } catch (error) {
            console.error('Custom request failed:', error);
            message.error(tval('Request failed'));
          }
        };

        return <SchemaInitializerItem {...itemConfig} onClick={handleClick} />;
      },
      useVisible() {
        const collection = useCollection();
        return !['view', 'file', 'sql'].includes(collection.template) || collection?.writableView;
      },
    },
  ],
});

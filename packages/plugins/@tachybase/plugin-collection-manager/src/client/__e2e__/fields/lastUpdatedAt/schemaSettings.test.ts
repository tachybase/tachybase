import {
  expectSettingsMenu,
  oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields,
  test,
} from '@tachybase/test/e2e';

import { createColumnItem, showSettingsMenu } from '../../utils';

test.describe('form item & create form', () => {
  test('supported options', async ({ page, mockPage }) => {
    const nocoPage = await mockPage(oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields).waitForInit();
    await nocoPage.goto();

    await expectSettingsMenu({
      page,
      showMenu: async () => {
        await page.getByRole('button', { name: 'Add new' }).click();
        await page.getByLabel(`block-item-CollectionField-general-form-general.updatedAt-`).hover();
        await page
          .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.updatedAt`)
          .hover();
      },
      supportedOptions: [
        'Edit field title',
        'Display title',
        'Edit tooltip',
        'Pattern',
        'Date display format',
        'Delete',
      ],
    });
  });
});

test.describe('form item & edit form', () => {
  test('supported options', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields).waitForInit();
    await mockRecord('general');
    await nocoPage.goto();

    await expectSettingsMenu({
      page,
      showMenu: async () => {
        await page.getByLabel('action-Action.Link-Edit record-update-general-table-0').click();
        await page.getByLabel(`block-item-CollectionField-general-form-general.updatedAt-`).hover();
        await page
          .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.updatedAt`)
          .hover();
      },
      supportedOptions: [
        'Edit field title',
        'Display title',
        'Edit tooltip',
        'Pattern',
        'Date display format',
        'Delete',
      ],
    });
  });
});

test.describe('form item & view form', () => {
  test('supported options', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields).waitForInit();
    await mockRecord('general');
    await nocoPage.goto();

    await expectSettingsMenu({
      page,
      showMenu: async () => {
        await page.getByLabel('action-Action.Link-View record-view-general-table-0').click();
        await page.getByLabel(`block-item-CollectionField-general-form-general.updatedAt-`).hover();
        await page
          .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.updatedAt`)
          .hover();
      },
      supportedOptions: ['Edit field title', 'Display title', 'Delete', 'Edit tooltip', 'Date display format'],
      unsupportedOptions: ['Set default value'],
    });
  });
});

test.describe('table column & table', () => {
  test('supported options', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields).waitForInit();
    await mockRecord('general');
    await nocoPage.goto();

    await expectSettingsMenu({
      page,
      showMenu: async () => {
        await createColumnItem(page, 'Last updated at');
        await showSettingsMenu(page, 'Last updated at');
      },
      supportedOptions: ['Custom column title', 'Column width', 'Sortable', 'Date display format', 'Delete'],
    });
  });
});
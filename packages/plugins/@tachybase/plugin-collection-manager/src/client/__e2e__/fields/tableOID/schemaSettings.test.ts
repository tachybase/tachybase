import {
  expect,
  expectSettingsMenu,
  oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields,
  Page,
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
        await page.getByLabel(`block-item-CollectionField-general-form-general.tableoid-`).hover();
        await page
          .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.tableoid`)
          .hover();
      },
      supportedOptions: ['Edit field title', 'Display title', 'Edit tooltip', 'Pattern', 'Delete'],
    });
  });

  test('options', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields).waitForInit();
    await nocoPage.goto();
    await page.getByRole('button', { name: 'Add new' }).click();
    await page.getByLabel(`block-item-CollectionField-general-form-general.tableoid-`).hover();
    await page
      .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.tableoid`)
      .hover();
    await expect(page.getByRole('menuitem', { name: 'Edit tooltip' })).toBeVisible();
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
        await page.getByLabel(`block-item-CollectionField-general-form-general.tableoid-`).hover();
        await page
          .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.tableoid`)
          .hover();
      },
      supportedOptions: ['Edit field title', 'Display title', 'Edit tooltip', 'Pattern', 'Delete'],
    });
  });

  test('options', async ({ page, mockPage, mockRecord }) => {
    await (async (mockPage, mockRecord) => {
      const nocoPage = await mockPage(oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields).waitForInit();
      const record = await mockRecord('general');
      await nocoPage.goto();

      return record;
    })(mockPage, mockRecord);
    await (async (page: Page) => {
      await page.getByLabel('action-Action.Link-Edit record-update-general-table-0').click();
    })(page);
    await (async (page: Page, fieldName: string) => {
      await page.getByLabel(`block-item-CollectionField-general-form-general.${fieldName}-`).hover();
      await page
        .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.${fieldName}`)
        .hover();
    })(page, 'tableoid');
    await expect(page.getByRole('menuitem', { name: 'Edit tooltip' })).toBeVisible();
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
        await page.getByLabel(`block-item-CollectionField-general-form-general.tableoid-`).hover();
        await page
          .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.tableoid`)
          .hover();
      },
      supportedOptions: ['Edit field title', 'Display title', 'Delete', 'Edit tooltip'],
      unsupportedOptions: ['Set default value'],
    });
  });

  test('options', async ({ page, mockPage, mockRecord }) => {
    await (async (mockPage, mockRecord) => {
      const nocoPage = await mockPage(oneTableBlockWithAddNewAndViewAndEditAndSystemInfoFields).waitForInit();
      const record = await mockRecord('general');
      await nocoPage.goto();

      return record;
    })(mockPage, mockRecord);
    await (async (page: Page) => {
      await page.getByLabel('action-Action.Link-View record-view-general-table-0').click();
    })(page);
    await (async (page: Page, fieldName: string) => {
      await page.getByLabel(`block-item-CollectionField-general-form-general.${fieldName}-`).hover();
      await page
        .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.${fieldName}`)
        .hover();
    })(page, 'tableoid');
    await expect(page.getByRole('menuitem', { name: 'Edit tooltip' })).toBeVisible();
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
        await createColumnItem(page, 'Table OID');
        await showSettingsMenu(page, 'Table OID');
      },
      supportedOptions: ['Custom column title', 'Column width', 'Sortable', 'Delete'],
    });
  });
});

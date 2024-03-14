import { Page, expect, test } from '@nocobase/test/e2e';
import { createTable } from './utils';

test.describe('where table data selector can be added', () => {
  test('popup', async ({ page, mockPage, mockRecord }) => {
    await createTable({ page, mockPage, fieldName: 'manyToOne' });

    // 选中一行数据之后，弹窗自动关闭，且数据被填充到关联字段中
    await page.getByLabel('checkbox').click();
    await expect(
      page
        .getByLabel('block-item-CollectionField-general-form-general.manyToOne-manyToOne')
        .getByTestId('select-data-picker'),
    ).toHaveText(`1`);
  });
});

test.describe('configure actions', () => {
  test('filter & add new & delete & refresh', async ({ page, mockPage }) => {
    await createTable({ page, mockPage, fieldName: 'manyToOne' });

    // add buttons
    await page.getByLabel('schema-initializer-ActionBar-table:configureActions-users').hover();
    await page.getByRole('menuitem', { name: 'Filter' }).click();
    await page.getByRole('menuitem', { name: 'Add new' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('menuitem', { name: 'Refresh' }).click();

    await expect(page.getByRole('menuitem', { name: 'Filter' }).getByRole('switch')).toBeChecked();
    await expect(page.getByRole('menuitem', { name: 'Add new' }).getByRole('switch')).toBeChecked();
    await expect(page.getByRole('menuitem', { name: 'Delete' }).getByRole('switch')).toBeChecked();
    await expect(page.getByRole('menuitem', { name: 'Refresh' }).getByRole('switch')).toBeChecked();

    await page.mouse.move(300, 0);
    await expect(page.getByRole('button', { name: 'Filter' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add new' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();

    // delete buttons
    await page.getByLabel('schema-initializer-ActionBar-table:configureActions-users').hover();
    await page.getByRole('menuitem', { name: 'Filter' }).click();
    await page.getByRole('menuitem', { name: 'Add new' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('menuitem', { name: 'Refresh' }).click();

    await expect(page.getByRole('menuitem', { name: 'Filter' }).getByRole('switch')).not.toBeChecked();
    await expect(page.getByRole('menuitem', { name: 'Add new' }).getByRole('switch')).not.toBeChecked();
    await expect(page.getByRole('menuitem', { name: 'Delete' }).getByRole('switch')).not.toBeChecked();
    await expect(page.getByRole('menuitem', { name: 'Refresh' }).getByRole('switch')).not.toBeChecked();

    await page.mouse.move(300, 0);
    await expect(page.getByRole('button', { name: 'Filter' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Add new' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Refresh' })).not.toBeVisible();
  });

  test('customize: bulk update', async ({ page, mockPage }) => {
    await createTable({ page, mockPage, fieldName: 'manyToOne' });

    await page.getByLabel('schema-initializer-ActionBar-table:configureActions-users').hover();
    await page.getByRole('menuitem', { name: 'Customize' }).hover();
    await page.getByRole('menuitem', { name: 'Bulk update' }).click();

    await page.mouse.move(300, 0);
    await expect(page.getByRole('button', { name: 'Bulk update' })).toBeVisible();
  });
});

test.describe('configure actions column', () => {
  test('column width', async ({ page, mockPage }) => {
    await createTable({ page, mockPage, fieldName: 'manyToOne' });
    await createActionColumn(page);

    const expectActionsColumnWidth = async (width: number) => {
      // 移动鼠标，防止悬浮到 Actions 列，不然会导致 page.getByRole('columnheader', { name: 'Actions', exact: true }) 无效
      await page.mouse.move(0, 300);
      const box = await page.getByRole('columnheader', { name: 'Actions', exact: true }).boundingBox();
      expect(Math.floor(box.width)).toBe(width);
    };

    // 列宽度默认为 200
    await expectActionsColumnWidth(200);

    await page.getByText('Actions', { exact: true }).hover();
    await page.getByLabel('designer-schema-settings-TableV2.Column-TableV2.ActionColumnDesigner-users').hover();
    await page.getByRole('menuitem', { name: 'Column width' }).click();

    await expect(page.getByRole('dialog').getByText('Column width')).toBeVisible();

    // 修改列宽度为 400
    await page.getByRole('dialog').getByRole('spinbutton').click();
    await page.getByRole('dialog').getByRole('spinbutton').fill('400');
    await page.getByTestId('modal-Action.Modal-users-Column width').getByRole('button', { name: 'Submit' }).click();

    await expectActionsColumnWidth(400);
  });
});

async function createActionColumn(page: Page) {
  await page.getByLabel('schema-initializer-TableV2.Selector-table:configureColumns-users').hover();
  await page.getByRole('menuitem', { name: 'Action column' }).click();
}

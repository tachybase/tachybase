import {
  expect,
  oneDetailBlockWithM2oFieldToGeneral,
  oneEmptyTableBlockWithActions,
  oneEmptyTableBlockWithCustomizeActions,
  oneFormBlockWithRolesFieldBasedUsers,
  test,
} from '@tachybase/test/e2e';

import { tableWithInherit, tableWithInheritWithoutAssociation, tableWithRoles, tableWithUsers } from './templatesOfBug';

test.describe('where to open a popup and what can be added to it', () => {
  test('add new', async ({ page, mockPage }) => {
    await mockPage(oneEmptyTableBlockWithActions).goto();

    // open dialog
    await page.getByLabel('action-Action-Add new-create-general-table').click();

    // add a tab
    await page.getByLabel('schema-initializer-Tabs-TabPaneInitializersForCreateFormBlock-general').click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('test123');
    await page.getByLabel('action-Action-Submit-general-table').click();

    await expect(page.getByText('test123')).toBeVisible();

    // add blocks
    await page.getByLabel('schema-initializer-Grid-popup:addNew:addBlock-general').hover();
    await page.getByText('Form').click();
    await page.getByText('Markdown').click();

    await page.mouse.move(300, 0);

    await expect(page.getByLabel('block-item-CardItem-general-form')).toBeVisible();
    await expect(page.getByLabel('block-item-Markdown.Void-general-markdown')).toBeVisible();
  });

  test('add record', async ({ page, mockPage }) => {
    await mockPage(oneEmptyTableBlockWithActions).goto();

    // open dialog
    await page.getByLabel('action-Action-Add record-customize:create-general-table').click();

    // add a tab
    await page.getByLabel('schema-initializer-Tabs-TabPaneInitializersForCreateFormBlock-general').click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('test7');
    await page.getByLabel('action-Action-Submit-general-table').click();

    await expect(page.getByText('test7')).toBeVisible();

    // add blocks
    await page.getByLabel('schema-initializer-Grid-popup:addRecord:addBlock-general').hover();
    await page.getByText('Form').hover();
    await page.getByRole('menuitem', { name: 'Users' }).click();

    // add Markdown
    await page.getByLabel('schema-initializer-Grid-popup:addRecord:addBlock-general').hover();
    await page.getByRole('menuitem', { name: 'Markdown' }).click();

    await expect(page.getByLabel('block-item-CardItem-users-form')).toBeVisible();
    await expect(page.getByLabel('block-item-Markdown.Void-general-markdown')).toBeVisible();
  });

  test('view', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneEmptyTableBlockWithActions).waitForInit();
    await mockRecord('general');
    await nocoPage.goto();

    // open dialog
    await page.getByLabel('action-Action.Link-View-view-general-table-0').click();

    // add a tab
    await page.getByLabel('schema-initializer-Tabs-TabPaneInitializers-general').click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('test8');
    await page.getByLabel('action-Action-Submit-general-table-0').click();

    await expect(page.getByText('test8')).toBeVisible();

    // add blocks
    await addBlock(['table Details right', 'Current record']);
    await addBlock(['form Form (Edit)']);
    await addBlock(['Markdown']);

    await expect(page.getByText('GeneralConfigure actionsConfigure fields')).toBeVisible();
    await expect(page.getByText('GeneralConfigure fieldsConfigure actions')).toBeVisible();
    await expect(page.getByLabel('block-item-Markdown.Void-general-markdown')).toBeVisible();

    // 删除已创建的 blocks，腾出页面空间
    // delete details block
    await page.getByText('GeneralConfigure actionsConfigure fields').hover();
    await page.getByLabel('designer-schema-settings-CardItem-blockSettings:details-general').hover();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    // delete form block
    await page.getByLabel('block-item-CardItem-general-form').hover();
    await page.getByLabel('designer-schema-settings-CardItem-blockSettings:editForm-general').hover();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    // delete markdown block
    await page.getByLabel('block-item-Markdown.Void-general-markdown').hover();
    await page
      .getByRole('button', { name: 'designer-schema-settings-Markdown.Void-blockSettings:markdown-general' })
      .hover();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // add relationship blocks
    await addBlock(['table Details right', 'Associated records', 'Many to one']);
    await expect(page.getByLabel('block-item-CardItem-users-')).toBeVisible();
    await addBlock(['table Table right', 'Associated records', 'One to many']);
    await expect(page.getByLabel('block-item-CardItem-users-table')).toBeVisible();

    async function addBlock(names: string[]) {
      await page.getByLabel('schema-initializer-Grid-popup').hover();
      for (let i = 0; i < names.length - 1; i++) {
        const name = names[i];
        await page.getByRole('menuitem', { name }).hover();
      }
      await page.getByRole('menuitem', { name: names[names.length - 1] }).click();
      await page.mouse.move(300, 0);
    }
  });

  test('bulk edit', async ({ page, mockPage }) => {
    await mockPage(oneEmptyTableBlockWithCustomizeActions).goto();

    // open dialog
    await page.getByLabel('action-Action-Bulk edit-customize:bulkEdit-general-table').click();
    await page.getByLabel('schema-initializer-Tabs-TabPaneInitializersForBulkEditFormBlock-general').click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('test1');
    await page.getByLabel('action-Action-Submit-general-table').click();

    await expect(page.getByText('test1')).toBeVisible();

    // add blocks
    await page.getByLabel('schema-initializer-Grid-popup:bulkEdit:addBlock-general').hover();
    await page.getByText('Form').click();
    await page.getByRole('menuitem', { name: 'Markdown' }).click();
    await page.mouse.move(300, 0);

    await expect(page.getByLabel('block-item-CardItem-general-form')).toBeVisible();
    await expect(page.getByLabel('block-item-Markdown.Void-general-markdown')).toBeVisible();
  });

  test('association link', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneDetailBlockWithM2oFieldToGeneral).waitForInit();
    const record = await mockRecord('targetToGeneral');
    await nocoPage.goto();

    // open dialog
    await page
      .getByLabel('block-item-CollectionField-targetToGeneral-details-targetToGeneral.toGeneral-toGeneral')
      .getByText(record.id, { exact: true })
      .click();

    // add a tab
    await page.getByLabel('schema-initializer-Tabs-TabPaneInitializers-general').click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('test8');
    await page.getByLabel('action-Action-Submit-general-details').click();

    await expect(page.getByText('test8')).toBeVisible();

    // add blocks
    await page.getByLabel('schema-initializer-Grid-popup:common:addBlock-general').hover();
    await page.getByRole('menuitem', { name: 'Details' }).hover();
    await page.getByRole('menuitem', { name: 'Current record' }).click();
    await page.getByLabel('schema-initializer-Grid-popup:common:addBlock-general').hover();
    await page.getByRole('menuitem', { name: 'form Form (Edit)' }).first().click();
    await page.getByLabel('schema-initializer-Grid-popup:common:addBlock-general').hover();
    await page.getByRole('menuitem', { name: 'Markdown' }).click();
    await page.mouse.move(300, 0);

    await expect(page.getByText('GeneralConfigure actionsConfigure fields')).toBeVisible();
    await expect(page.getByText('GeneralConfigure fieldsConfigure actions')).toBeVisible();
    await expect(page.getByLabel('block-item-Markdown.Void-general-markdown')).toBeVisible();

    // add relationship blocks
    // 下拉列表中，可选择以下卡片进行创建
    await page.getByLabel('schema-initializer-Grid-popup:common:addBlock-general').hover();
    await expect(page.getByRole('menuitem', { name: 'table Details right' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'form Form (Edit)' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'form Form (Add new) right' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'form Form (Add new) right' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'table Table right' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'ordered-list List right' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'ordered-list Grid Card right' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Calendar' })).toBeVisible();

    await page.getByLabel('schema-initializer-Grid-popup:common:addBlock-general').hover();
    await page.getByRole('menuitem', { name: 'Details' }).hover();
    await page.getByRole('menuitem', { name: 'Associated records' }).hover();
    await page.getByRole('menuitem', { name: 'Many to one' }).click();
    await page.mouse.move(300, 0);
    await expect(page.getByLabel('block-item-CardItem-users-')).toBeVisible();

    await page.getByLabel('schema-initializer-Grid-popup:common:addBlock-general').hover();
    await page.getByRole('menuitem', { name: 'table Table right' }).hover();
    await page.getByRole('menuitem', { name: 'Associated records' }).hover();
    await page.getByRole('menuitem', { name: 'One to many' }).click();
    await page.mouse.move(300, 0);
    await expect(page.getByLabel('block-item-CardItem-users-table')).toBeVisible();
    // 屏幕上没有显示错误提示
    await expect(page.locator('.ant-notification-notice').first()).toBeHidden({ timeout: 1000 });
  });

  test('data picker', async ({ page, mockPage }) => {
    await mockPage(oneFormBlockWithRolesFieldBasedUsers).goto();

    // open dialog
    await page.getByTestId('select-data-picker').click();

    // add blocks
    await addBlock('form Table');
    await addBlock('form Form');
    await addBlock('Collapse');
    await addBlock('Add text');

    await expect(page.getByLabel('block-item-CardItem-roles-table-selector')).toBeVisible();
    await expect(page.getByLabel('block-item-CardItem-roles-filter-form')).toBeVisible();
    await expect(page.getByLabel('block-item-CardItem-roles-filter-collapse')).toBeVisible();
    await expect(page.getByLabel('block-item-Markdown.Void-roles-form')).toBeVisible();

    async function addBlock(name: string) {
      await page.getByLabel('schema-initializer-Grid-popup:tableSelector:addBlock-roles').hover();
      await page.getByRole('menuitem', { name }).click();
      await page.mouse.move(300, 0);
    }
  });
});

test.describe('add blocks to the popup', () => {
  test('no inheritance, no views, no association fields', async ({ page, mockPage }) => {
    await mockPage(tableWithRoles).goto();

    // 打开弹窗
    await page.getByLabel('action-Action.Link-View-view-roles-table-root').click();

    // 直接点击 Details 选项创建详情卡片
    await page.getByLabel('schema-initializer-Grid-popup').hover();
    await page.getByRole('menuitem', { name: 'table Details' }).click();
    await page.getByLabel('schema-initializer-Grid-details:configureFields-roles').hover();
    await page.getByRole('menuitem', { name: 'Role UID' }).click();
    await expect(page.getByLabel('block-item-CollectionField-Role').getByText('root')).toBeVisible();
    await page.mouse.move(300, 0);

    // 直接点击 Form(Edit) 选项创建表单卡片
    await page.getByLabel('schema-initializer-Grid-popup').hover();
    await page.getByRole('menuitem', { name: 'form Form (Edit)' }).click();
    await page.getByLabel('schema-initializer-Grid-form:').hover();
    await page.getByRole('menuitem', { name: 'Role UID' }).click();
    await expect(
      page.getByLabel('block-item-CollectionField-roles-form-roles.name-Role UID').getByRole('textbox'),
    ).toHaveValue('root');
  });

  test('no inheritance, no views, with association fields', async ({ page, mockPage }) => {
    await mockPage(tableWithUsers).goto();

    // 打开弹窗
    await page.getByLabel('action-Action.Link-View-view-').click();

    // 通过点击 Current record 选项创建详情卡片
    await page.getByLabel('schema-initializer-Grid-popup').hover();
    await page.getByRole('menuitem', { name: 'table Details right' }).hover();
    await page.getByRole('menuitem', { name: 'Current record' }).click();
    await page.getByLabel('schema-initializer-Grid-details:configureFields-users').hover();
    await page.getByRole('menuitem', { name: 'Nickname' }).click();
    await page.mouse.move(300, 0);
    await expect(page.getByLabel('block-item-CollectionField-users').getByText('Super Admin')).toBeVisible();

    // 通过 Association records 创建一个关系卡片
    await page.getByLabel('schema-initializer-Grid-popup').hover();
    await page.getByRole('menuitem', { name: 'table Details right' }).hover();
    await page.getByRole('menuitem', { name: 'Associated records' }).hover();
    await page.getByRole('menuitem', { name: 'Roles' }).click();
    await page.getByLabel('schema-initializer-Grid-details:configureFields-roles').hover();
    await page.getByRole('menuitem', { name: 'Role UID' }).click();
    await page.mouse.move(300, 0);
    await expect(page.getByLabel('block-item-CollectionField-roles').getByText('admin')).toBeVisible();
  });

  test('with inheritance, with association fields', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(tableWithInherit).waitForInit();
    const fatherRecord = await mockRecord('father');
    await nocoPage.goto();

    // 打开弹窗
    await page.getByLabel('action-Action.Link-View-view-father-table-0').click();

    // 通过 Current record 创建详情卡片
    await page.getByLabel('schema-initializer-Grid-popup').hover();
    await page.getByRole('menuitem', { name: 'table Details right' }).hover();
    await page.getByRole('menuitem', { name: 'Current record right' }).hover();
    await page.getByRole('menuitem', { name: 'father' }).click();
    await page.mouse.move(-300, 0);
    await page.getByLabel('schema-initializer-Grid-details:configureFields-father').hover();
    await page.getByRole('menuitem', { name: 'singleLineText' }).click();
    await page.mouse.move(300, 0);
    await expect(
      page.getByLabel('block-item-CollectionField-father').getByText(fatherRecord.singleLineText),
    ).toBeVisible();

    // 通过 Association records 创建关系卡片
    await page.getByLabel('schema-initializer-Grid-popup').hover();
    await page.getByRole('menuitem', { name: 'table Table right' }).hover();
    await page.getByRole('menuitem', { name: 'Associated records' }).hover();
    await page.getByRole('menuitem', { name: 'manyToMany' }).click();
    await page.mouse.move(-300, 0);
    await page
      .getByTestId('drawer-Action.Container-father-View record')
      .getByLabel('schema-initializer-TableV2-')
      .hover();
    await page.getByRole('menuitem', { name: 'singleLineText' }).click();
    await page.mouse.move(300, 0);
    await expect(
      page
        .getByTestId('drawer-Action.Container-father-View record')
        .getByLabel('block-item-CardItem-')
        .getByRole('row')
        .getByText(fatherRecord.manyToMany[0].singleLineText),
    ).toBeVisible();
  });

  test('with inheritance, no association fields', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(tableWithInheritWithoutAssociation).waitForInit();
    const fatherRecord = await mockRecord('father');
    await nocoPage.goto();

    // 打开弹窗
    await page.getByLabel('action-Action.Link-View-view-father-table-0').click();

    // 通过 Current record 创建详情卡片
    await page.getByLabel('schema-initializer-Grid-popup').hover();
    await page.getByRole('menuitem', { name: 'table Details right' }).hover();
    await page.getByRole('menuitem', { name: 'Current record right' }).hover();
    await page.getByRole('menuitem', { name: 'father' }).click();
    await page.getByLabel('schema-initializer-Grid-details:configureFields-father').hover();
    await page.getByRole('menuitem', { name: 'singleLineText' }).click();
    await page.mouse.move(300, 0);
    await expect(
      page.getByLabel('block-item-CollectionField-father').getByText(fatherRecord.singleLineText),
    ).toBeVisible();
  });

  test('only support association fields', async ({ page, mockPage }) => {
    await mockPage(tableWithUsers).goto();

    // 打开弹窗
    await page.getByLabel('action-Action.Link-View-view-').click();

    // 通过 Association records 创建一个关系卡片
    await page.getByLabel('schema-initializer-Grid-popup').hover();
    await page.getByRole('menuitem', { name: 'table Table right' }).hover();
    await page.getByRole('menuitem', { name: 'Associated records' }).hover();
    await page.getByRole('menuitem', { name: 'Roles' }).click();
    await page
      .getByTestId('drawer-Action.Container-users-View record')
      .getByLabel('schema-initializer-TableV2-')
      .hover();
    await page.getByRole('menuitem', { name: 'Role UID' }).click();
    await page.mouse.move(300, 0);
    await expect(page.getByLabel('block-item-CardItem-roles-').getByRole('row').getByText('root')).toBeVisible();
  });
});

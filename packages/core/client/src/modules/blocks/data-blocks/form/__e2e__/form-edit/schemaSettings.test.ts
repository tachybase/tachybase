import {
  Page,
  expect,
  expectSettingsMenu,
  oneEmptyFormWithActions,
  oneTableBlockWithActionsAndFormBlocks,
  test,
} from '@tachybase/test/e2e';

const clickOption = async (page: Page, optionName: string) => {
  await page.getByLabel('block-item-CardItem-general-form').hover();
  await page.getByLabel('designer-schema-settings-CardItem-FormV2.Designer-general').hover();
  await page.getByRole('menuitem', { name: optionName }).click();
};

test.describe('edit form block schema settings', () => {
  test('Edit block title', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneTableBlockWithActionsAndFormBlocks).waitForInit();
    await mockRecord('general');
    await nocoPage.goto();
    await page.getByText('Edit', { exact: true }).click();

    // 打开编辑弹窗
    await clickOption(page, 'Edit block title');
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('Block title 123');
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    const runExpect = async () => {
      // 设置成功后，显示在区块顶部
      await expect(
        page.getByLabel('block-item-CardItem-general-form').getByText('Block title 123', { exact: true }),
      ).toBeVisible();

      // 再次打开编辑弹窗时，显示的是上次设置的值
      await clickOption(page, 'Edit block title');
      await expect(page.getByRole('textbox')).toHaveValue('Block title 123');
    };

    await runExpect();

    // 刷新页面后，显示的应该依然是上次设置的值
    await page.reload();
    await page.getByText('Edit', { exact: true }).click();
    await runExpect();
  });

  test('Linkage rules', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneTableBlockWithActionsAndFormBlocks).waitForInit();
    await mockRecord('general');
    await nocoPage.goto();
    await page.getByText('Edit', { exact: true }).click();

    // 打开编辑弹窗
    await clickOption(page, 'Linkage rules');
    await page.getByRole('button', { name: 'Add linkage rule' }).click();
    await page.getByText('Add property').click();
    await page.getByTestId('select-linkage-property-field').click();
    await page.getByText('singleLineText', { exact: true }).click();
    await page.getByTestId('select-linkage-action-field').click();
    await page.getByRole('option', { name: 'Visible' }).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    const runExpect = async () => {
      await expect(page.getByTestId('select-linkage-property-field').getByText('singleLineText')).toBeVisible();
      await expect(page.getByTestId('select-linkage-action-field').getByText('Visible')).toBeVisible();
    };

    // 再次打开，设置的值应该存在
    await clickOption(page, 'Linkage rules');
    await runExpect();

    // 刷新页面后，设置的值应该依然存在
    await page.reload();
    await page.getByText('Edit', { exact: true }).click();
    await clickOption(page, 'Linkage rules');
    await runExpect();
  });

  test('Convert reference to duplicate & Save as block template', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneTableBlockWithActionsAndFormBlocks).waitForInit();
    await mockRecord('general');
    await nocoPage.goto();
    await page.getByText('Edit', { exact: true }).click();

    // 打开编辑弹窗
    await clickOption(page, 'Save as block template');
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // 设置成功后，不再显示 Save as block template 选项，而是显示 Convert reference to duplicate 选项
    await page.getByLabel('block-item-CardItem-general-form').hover();
    await page.getByLabel('designer-schema-settings-CardItem-FormV2.Designer-general').hover();
    await expect(page.getByRole('menuitem', { name: 'Save as block template' })).not.toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Convert reference to duplicate' })).toBeVisible();

    // 刷新页面
    await page.reload();
    await page.getByText('Edit', { exact: true }).click();
    await page.getByLabel('block-item-CardItem-general-form').hover();
    await page.getByLabel('designer-schema-settings-CardItem-FormV2.Designer-general').hover();
    await expect(page.getByRole('menuitem', { name: 'Save as block template' })).not.toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Convert reference to duplicate' })).toBeVisible();

    // Convert reference to duplicate
    await clickOption(page, 'Convert reference to duplicate');
    await expect(page.getByRole('menuitem', { name: 'Save as block template' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Convert reference to duplicate' })).not.toBeVisible();

    // 刷新页面
    await page.reload();
    await page.getByText('Edit', { exact: true }).click();
    await page.getByLabel('block-item-CardItem-general-form').hover();
    await page.getByLabel('designer-schema-settings-CardItem-FormV2.Designer-general').hover();
    await expect(page.getByRole('menuitem', { name: 'Save as block template' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Convert reference to duplicate' })).not.toBeVisible();

    // 保存为模板之后，应该在 ui-schema-storage 页面显示出来
    await page.goto('/admin/settings/ui-schema-storage');
    await expect(page.getByRole('row', { name: 'General_Form' }).first()).toBeVisible();

    // 删除创建的模板，以免影响其它测试
    await page.getByLabel('Select all').check();
    await page.getByLabel('action-Action-Delete-destroy-').click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(page.getByRole('row', { name: 'General_Form' }).first()).toBeHidden();
  });

  test('Delete', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage(oneTableBlockWithActionsAndFormBlocks).waitForInit();
    await mockRecord('general');
    await nocoPage.goto();

    await page.getByText('Edit', { exact: true }).click();
    await page.getByLabel('block-item-CardItem-general-form').hover();
    await page.getByLabel('designer-schema-settings-CardItem-FormV2.Designer-general').hover();

    // 打开编辑弹窗
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // 设置成功后，显示在区块顶部
    await expect(page.getByLabel('block-item-CardItem-general-form')).not.toBeVisible();

    // 刷新页面后，区块依然是被删除状态
    await page.reload();
    await page.getByText('Edit', { exact: true }).click();
    await expect(page.getByLabel('block-item-CardItem-general-form')).not.toBeVisible();
  });
});

test.describe('actions schema settings', () => {
  test('submit', async ({ page, mockPage }) => {
    await mockPage(oneEmptyFormWithActions).goto();

    await expectSettingsMenu({
      page,
      showMenu: async () => {
        await page.getByRole('button', { name: 'Submit' }).hover();
        await page.getByRole('button', { name: 'designer-schema-settings-Action-Action.Designer-users' }).hover();
      },
      supportedOptions: ['Edit button', 'Bind workflows', 'Delete'],
    });
  });

  test('customize: save record', async ({ page, mockPage }) => {
    await mockPage(oneEmptyFormWithActions).goto();

    await expectSettingsMenu({
      page,
      showMenu: async () => {
        await page.getByRole('button', { name: 'Save record' }).hover();
        await page.getByRole('button', { name: 'designer-schema-settings-Action-Action.Designer-users' }).hover();
      },
      supportedOptions: [
        'Edit button',
        'Assign field values',
        'Skip required validation',
        'After successful submission',
        'Bind workflows',
        'Delete',
      ],
    });
  });
});

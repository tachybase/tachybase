import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { Application } from '../Application';

describe('PluginSettingsManager', () => {
  let app: Application;

  const test = {
    title: 'test title',
    Component: () => null,
  };

  const test1 = {
    title: 'test1 title',
    Component: () => null,
  };

  const test2 = {
    title: 'test2 title',
    Component: () => null,
  };

  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet('pm:listEnabled').reply(200, {
      data: [],
    });
  });

  beforeEach(() => {
    app = new Application({});
  });

  it('basic use', () => {
    const name = 'test';

    app.systemSettingsManager.add(name, test);

    const settingRes = { ...test, name };
    const getRes = {
      ...test,
      name,
      label: test.title,
      path: '/admin/settings/test',
      isAllow: true,
      aclSnippet: 'pm.test',
      key: name,
      children: undefined,
    };
    expect(app.systemSettingsManager.getSetting('test')).toMatchObject(settingRes);
    expect(app.systemSettingsManager.get('test')).toMatchObject(getRes);
    expect(app.systemSettingsManager.hasAuth('test')).toBeTruthy();
    const list = app.systemSettingsManager.getList();
    expect(list.length).toBe(1);
    expect(list[0]).toMatchObject(getRes);
  });

  it('constructor init', () => {
    const app = new Application({
      pluginSettings: {
        test: test,
      },
    });
    const name = 'test';
    const settingRes = { ...test, name };
    expect(app.systemSettingsManager.getSetting('test')).toMatchObject(settingRes);
  });

  it('multi', () => {
    app.systemSettingsManager.add('test1', test1);
    app.systemSettingsManager.add('test2', test2);
    expect(app.systemSettingsManager.get('test1')).toMatchObject(test1);
    expect(app.systemSettingsManager.get('test2')).toMatchObject(test2);
    const list = app.systemSettingsManager.getList();
    expect(list.length).toBe(2);
    expect(list[0]).toMatchObject(test1);
    expect(list[1]).toMatchObject(test2);
  });

  it('nested', () => {
    app.systemSettingsManager.add('test1', test1);
    app.systemSettingsManager.add('test1.test2', test2);
    expect(app.systemSettingsManager.get('test1')).toMatchObject(test1);
    expect(app.systemSettingsManager.get('test1.test2')).toMatchObject(test2);
    expect(app.systemSettingsManager.get('test1').children.length).toBe(1);
    expect(app.systemSettingsManager.get('test1').children[0]).toMatchObject(test2);
  });

  it('remove', () => {
    app.systemSettingsManager.add('test1', test1);
    app.systemSettingsManager.add('test1.test2', test2);

    app.systemSettingsManager.remove('test1');
    expect(app.systemSettingsManager.get('test1')).toBeFalsy();
    expect(app.systemSettingsManager.get('test1.test2')).toBeFalsy();
    expect(app.systemSettingsManager.getList().length).toBe(0);
  });

  it('has', () => {
    app.systemSettingsManager.add('test', test);
    expect(app.systemSettingsManager.has('test')).toBeTruthy();
    expect(app.systemSettingsManager.has('test1')).toBeFalsy();
  });

  it('acl', () => {
    app.systemSettingsManager.setAclSnippets(['!pm.test']);
    app.systemSettingsManager.add('test', test);

    expect(app.systemSettingsManager.get('test')).toBeFalsy();
    expect(app.systemSettingsManager.hasAuth('test')).toBeFalsy();
    expect(app.systemSettingsManager.has('test')).toBeFalsy();

    expect(app.systemSettingsManager.get('test', false)).toMatchObject({
      ...test,
      isAllow: false,
    });
    expect(app.systemSettingsManager.getList(false).length).toBe(1);
    expect(app.systemSettingsManager.getList(false)[0]).toMatchObject({
      ...test,
      isAllow: false,
    });
  });

  it('getAclSnippet()', () => {
    app.systemSettingsManager.add('test1', test1);
    app.systemSettingsManager.add('test2', {
      ...test2,
      aclSnippet: 'any.string',
    });
    expect(app.systemSettingsManager.getAclSnippet('test1')).toBe('pm.test1');
    expect(app.systemSettingsManager.getAclSnippet('test2')).toBe('any.string');
  });

  it('getAclSnippets()', () => {
    app.systemSettingsManager.add('test', test);
    app.systemSettingsManager.add('test1', test1);

    expect(app.systemSettingsManager.getAclSnippets()).toEqual(['pm.test', 'pm.test1']);
  });

  it('getRouteName()', () => {
    app.systemSettingsManager.add('test1', test1);
    app.systemSettingsManager.add('test1.test2', test2);
    expect(app.systemSettingsManager.getRouteName('test1')).toBe('admin.settings.test1');
    expect(app.systemSettingsManager.getRouteName('test1.test2')).toBe('admin.settings.test1.test2');
  });

  it('getRoutePath()', () => {
    app.systemSettingsManager.add('test1', test1);
    app.systemSettingsManager.add('test1.test2', test2);
    expect(app.systemSettingsManager.getRoutePath('test1')).toBe('/admin/settings/test1');
    expect(app.systemSettingsManager.getRoutePath('test1.test2')).toBe('/admin/settings/test1/test2');
  });

  it('router', () => {
    app.systemSettingsManager.add('test1', test1);
    app.systemSettingsManager.add('test1.test2', test2);
    expect(app.router.getRoutesTree()[0]).toMatchInlineSnapshot(`
      {
        "children": undefined,
        "element": <AppNotFound />,
        "path": "*",
      }
    `);
  });

  it('When icon is a string, it will be converted to the Icon component', () => {
    const name = 'test';
    const icon = 'test-icon';
    app.systemSettingsManager.add(name, {
      ...test,
      icon,
    });
    expect(app.systemSettingsManager.get(name).icon).toMatchInlineSnapshot(`
      <Icon
        type="test-icon"
      />
    `);
  });
});

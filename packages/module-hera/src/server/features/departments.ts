import type { CollectionRepository } from '@tachybase/module-collection';
import { InstallOptions, Plugin } from '@tachybase/server';

import {
  aggregateSearch,
  listExcludeDept,
  removeOwner,
  setMainDepartment as setMainDepartmentAction,
  setOwner,
} from '../actions';
import { departmentsField, mainDepartmentField } from '../collections/users';
import {
  destroyDepartmentCheck,
  resetUserDepartmentsCache,
  setDepartmentOwners,
  setDepartmentsInfo,
  setMainDepartment,
  updateDepartmentIsLeaf,
} from '../middlewares';
import { listUsersIncludeChildDepartment } from '../middlewares/list-users-include-child-department';
import { DepartmentModel } from '../models/department';

export class DepartmentsPlugin extends Plugin {
  beforeLoad() {
    this.app.db.registerModels({ DepartmentModel });
    this.app.acl.addFixedParams('collections', 'destroy', () => {
      return {
        filter: {
          'name.$notIn': ['departments', 'departmentsUsers', 'departmentsRoles'],
        },
      };
    });
  }
  async load() {
    this.app.resourcer.define({
      name: 'users',
      actions: {
        listExcludeDept: listExcludeDept,
        setMainDepartment: setMainDepartmentAction,
      },
    });
    this.app.resourcer.define({
      name: 'departments',
      actions: {
        aggregateSearch: aggregateSearch,
        setOwner: setOwner,
        removeOwner: removeOwner,
      },
    });
    this.app.acl.allow('users', ['setMainDepartment', 'listExcludeDept'], 'loggedIn');
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.*`,
      actions: [
        'departments:*',
        'roles:list',
        'users:list',
        'users:listExcludeDept',
        'users:setMainDepartment',
        'roles.departments:add',
        'roles.departments:remove',
        'users.departments:add',
        'users.departments:remove',
      ],
    });
    this.app.resourcer.use(setDepartmentsInfo, {
      tag: 'setDepartmentsInfo',
      before: 'setCurrentRole',
      after: 'auth',
    });
    this.app.resourcer.use(setDepartmentOwners, { tag: 'setDepartmentOwners' });
    this.app.resourcer.use(destroyDepartmentCheck, { tag: 'destroyDepartmentCheck' });
    this.app.resourcer.use(updateDepartmentIsLeaf, { tag: 'updateDepartmentIsLeaf' });
    this.app.resourcer.use(resetUserDepartmentsCache, { tag: 'resetUserDepartmentsCache' });
    this.app.resourcer.use(setMainDepartment, { tag: 'setMainDepartment' });
    this.app.resourcer.use(listUsersIncludeChildDepartment, { tag: 'listUsersIncludeChildDepartment' });
    this.app.db.on('departmentsUsers.afterSave', async (model) => {
      const cache = this.app.cache;
      await cache.del(`departments:${model.get('userId')}`);
    });
    this.app.db.on('departmentsUsers.afterDestroy', async (model) => {
      const cache = this.app.cache;
      await cache.del(`departments:${model.get('userId')}`);
    });
    this.app.on('beforeSignOut', ({ userId }) => {
      this.app.cache.del(`departments:${userId}`);
    });
  }

  async upgrade() {
    await this.install();
  }

  async install(options?: InstallOptions) {
    const collectionRepo = this.db.getRepository<CollectionRepository>('collections');
    if (collectionRepo) {
      await collectionRepo.db2cm('departments');
    }
    const fieldRepo = this.db.getRepository('fields');
    if (fieldRepo) {
      const isDepartmentsFieldExists = await fieldRepo.count({
        filter: {
          name: 'departments',
          collectionName: 'users',
        },
      });
      if (!isDepartmentsFieldExists) {
        await fieldRepo.create({
          values: departmentsField,
        });
      }
      const isMainDepartmentFieldExists = await fieldRepo.count({
        filter: {
          name: 'mainDepartment',
          collectionName: 'users',
        },
      });
      if (!isMainDepartmentFieldExists) {
        await fieldRepo.create({
          values: mainDepartmentField,
        });
      }
    }
  }
}

import type { CollectionRepository } from '@nocobase/plugin-collection-manager';
import { Plugin } from '@tachybase/server';
import { resolve } from 'path';
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
    this.app.resource({
      name: 'users',
      actions: {
        listExcludeDept: listExcludeDept,
        setMainDepartment: setMainDepartmentAction,
      },
    });
    this.app.resource({
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
    this.app.resourcer.use(setDepartmentOwners);
    this.app.resourcer.use(destroyDepartmentCheck);
    this.app.resourcer.use(updateDepartmentIsLeaf);
    this.app.resourcer.use(resetUserDepartmentsCache);
    this.app.resourcer.use(setMainDepartment);
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
  async install(options) {
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

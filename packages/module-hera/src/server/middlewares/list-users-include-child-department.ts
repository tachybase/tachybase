import type { Context, Next } from '@tachybase/actions';
import { Repository } from '@tachybase/database';

type DepartmentInfo = {
  id: number;
  parentId: number;
  isLeaf: boolean;
};

function getChildIds(ids: number[], departmentIds: Set<number>, departments: DepartmentInfo[]) {
  const children = departments.filter((department) => ids.includes(department.parentId));
  const noLeaf: number[] = [];
  children.forEach((child) => {
    departmentIds.add(child.id);
    if (!child.isLeaf) {
      noLeaf.push(child.id);
    }
  });
  if (noLeaf.length) {
    getChildIds(noLeaf, departmentIds, departments);
  }
}

async function getAllDepartmentIds(repo: Repository, parentId: number): Promise<number[]> {
  // 查找所有部门,在内存里递归
  const departments = (await repo.find({
    fields: ['id', 'parentId', 'isLeaf'],
    raw: true,
  })) as DepartmentInfo[];
  const departmentIds = new Set<number>([parentId]);
  getChildIds([parentId], departmentIds, departments);
  return [...departmentIds];
}

export const listUsersIncludeChildDepartment = async (ctx: Context, next: Next) => {
  const { filter, resourceName, actionName } = ctx.action.params;
  const repo = ctx.db.getRepository('departments');
  if (resourceName === 'users' && actionName === 'list') {
    if (filter?.showChildren !== undefined) {
      const showChildren = filter.showChildren;
      delete filter.showChildren;
      if (showChildren && filter?.departments?.id) {
        const departmentIds = await getAllDepartmentIds(repo, filter.departments.id);
        if (departmentIds.length > 1) {
          delete filter.departments.id;
          filter.departments.id = {
            $in: departmentIds,
          };
        }
      }
    }
    return next();
  }
  return next();
};

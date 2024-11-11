import type { Context, Next } from '@tachybase/actions';
import type { ArrayFieldRepository } from '@tachybase/database';

export const setDepartmentsInfo = async (ctx: Context, next: Next) => {
  const currentUser = ctx.state.currentUser;
  if (!currentUser) {
    return next();
  }
  const cache = ctx.cache;
  const repo = ctx.db.getRepository<ArrayFieldRepository>('users.departments', currentUser.id);
  const departments = await cache.wrap(`departments:${currentUser.id}`, () =>
    repo.find({
      appends: ['owners', 'roles', 'parent(recursively=true)'],
      raw: true,
    }),
  );
  if (!departments.length) {
    return next();
  }
  ctx.state.currentUser.departments = departments;
  ctx.state.currentUser.mainDeparmtent = departments.find((dept) => dept.isMain);
  const departmentIds = departments.map((dept) => dept.id);
  const roleRepo = ctx.db.getRepository('roles');
  const roles = await roleRepo.find({
    filter: {
      'departments.id': {
        $in: departmentIds,
      },
    },
  });
  if (!roles.length) {
    return next();
  }
  const rolesMap = new Map();
  roles.forEach((role) => rolesMap.set(role.name, role));
  ctx.state.attachRoles = Array.from(rolesMap.values());
  await next();
};

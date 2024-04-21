import type { Context, Next } from '@nocobase/actions';

export const setMainDepartment = async (ctx: Context, next: Next) => {
  await next();
  const { associatedName, resourceName, associatedIndex, actionName, values } = ctx.action.params;
  if (associatedName === 'departments' && resourceName === 'members' && (values == null ? void 0 : values.length)) {
    const throughRepo = ctx.db.getRepository('departmentsUsers');
    const usersHasMain = await throughRepo.find({
      filter: {
        userId: {
          $in: values,
        },
        isMain: true,
      },
    });
    const userIdsHasMain = usersHasMain.map((item) => item.userId);
    if (actionName === 'add' || actionName === 'set') {
      await throughRepo.update({
        filter: {
          userId: {
            $in: values.filter((id) => !userIdsHasMain.includes(id)),
          },
          departmentId: associatedIndex,
        },
        values: {
          isMain: true,
        },
      });
      return;
    }
    if (actionName === 'remove') {
      const userIdsHasNoMain = values.filter((id) => !userIdsHasMain.includes(id));
      for (const userId of userIdsHasNoMain) {
        const firstDept = await throughRepo.findOne({
          filter: {
            userId,
          },
        });
        if (firstDept) {
          await throughRepo.update({
            filter: {
              userId,
              departmentId: firstDept.departmentId,
            },
            values: {
              isMain: true,
            },
          });
        }
      }
    }
  }
  if (associatedName === 'users' && resourceName === 'departments' && ['add', 'remove', 'set'].includes(actionName)) {
    const throughRepo = ctx.db.getRepository('departmentsUsers');
    const hasMain = await throughRepo.findOne({
      filter: {
        userId: associatedIndex,
        isMain: true,
      },
    });
    if (hasMain) {
      return;
    }
    const firstDept = await throughRepo.findOne({
      filter: {
        userId: associatedIndex,
      },
    });
    if (firstDept) {
      await throughRepo.update({
        filter: {
          userId: associatedIndex,
          departmentId: firstDept.departmentId,
        },
        values: {
          isMain: true,
        },
      });
    }
  }
};

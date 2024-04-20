import { Model } from '@nocobase/database';
export class DepartmentModel extends Model {
  getOwners() {
    return this.getMembers({
      through: {
        where: {
          isOwner: true,
        },
      },
    });
  }
}

import { Model } from '@tachybase/database';

export class AutoBackupModel extends Model {
  declare id: number;
  declare title: string;
  declare startsOn: Date;
  declare endsOn?: Date;
  declare repeat: string;
  declare enabled: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare allExecuted: number;

  // declare password: string;
  declare dumpRules: string;
  // 本地最多备份文件数量
  declare maxNumber: number;
}

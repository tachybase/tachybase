import path from 'path';
import Database from '@tachybase/database';
import { Db, Service } from '@tachybase/utils';

import fs from 'fs-extra';

import { isMain } from '../utils/multiprocess';

@Service()
export class SqlLoader {
  sqlFiles: { [key: string]: string } = {};
  @Db()
  private db: Database;

  async loadSqlFiles(directory: string): Promise<{ [key: string]: string }> {
    try {
      const files = await fs.readdir(directory);
      const dialect = this.db.options.dialect;
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(directory, file);
          const stat = await fs.stat(filePath);
          if (stat.isFile() && path.extname(file) === '.sql') {
            const content = await fs.readFile(filePath, 'utf-8');
            const filename = path.basename(file, '.sql');
            // 解析content第一行
            // -- dialect: mysql,postgres,sqlite,mariadb,mssql,db2,snowflake,oracle
            // 判断支持的dialect
            const dialects = content
              .split('\n')
              .filter((line) => line.startsWith('-- dialect:'))
              .map((line) => line.split(':')[1].trim());
            if (!dialects.includes(dialect)) {
              return;
            }
            this.sqlFiles[filename] = content;
            if (filename.startsWith('view_')) {
              await this.loadView(filename, content);
            }
          }
        }),
      );

      return this.sqlFiles;
    } catch (error) {
      console.error('Error reading SQL files:', error);
    }
  }

  async loadView(filename: string, content: string) {
    if (!isMain()) {
      return;
    }
    try {
      await this.db.sequelize.query(content);
    } catch (error) {
      console.error('Error Creation failed, view name:', filename, 'message：' + error);
    }
  }
}

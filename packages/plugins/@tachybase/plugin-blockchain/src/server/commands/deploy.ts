import { exec } from 'child_process';
import path from 'path';
import { Application } from '@tachybase/server';

export default function (app: Application) {
  app
    .command('deploy')
    .option('-v, --version')
    .action(async (options) => {
      const scriptPath = path.join(__dirname, 'deploy_contract.sh');

      exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行脚本时出错: ${error.message}`);
          return;
        }

        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        console.log(`stdout: ${stdout}`);
      });
    });
}

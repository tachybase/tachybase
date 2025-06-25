import updateNotifier from 'update-notifier';
import packageJson from '../package.json' assert { type: 'json' };

updateNotifier({ pkg: packageJson }).notify({ defer: true });

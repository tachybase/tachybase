import { Trigger } from '.';

export class APPEventTrigger extends Trigger {
  title = `{{t("App event")}}`;
  type = 'applicationEvent';
  description = `{{t("Application after start before start")}}`;
}

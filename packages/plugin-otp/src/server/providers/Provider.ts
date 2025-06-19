import Plugin from '../Plugin';

export class Provider {
  constructor(
    protected plugin: Plugin,
    protected options,
  ) {
    this.options = plugin.app.environment.renderJsonTemplate(options);
  }

  async send(receiver: string, data: { [key: string]: any }): Promise<any> {}
}

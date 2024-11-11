export class processMeters {
  meter: any;
  constructor(meter) {
    this.meter = meter;
  }
  async start() {
    console.log('process meter start');

    const selfUptime = this.meter.createObservableGauge('tachybase.basic.uptime', {
      description: 'Process Uptime in seconds',
      unit: 'seconds',
    });
    selfUptime.addCallback((result) => {
      const uptime = Number(process.uptime().toFixed(2));
      console.log('self uptime', uptime);
      result.observe(uptime);
    });

    const selfMemoryUsage = this.meter.createObservableGauge('tachybase.basic.memoryusage', {
      description: 'Process Memory Usage in MB',
      unit: 'mb',
    });
    selfMemoryUsage.addCallback((result) => {
      const mem = process.memoryUsage();
      console.log('self mem', mem);
      const memUsage = Number((mem.rss / 1024 / 1024).toFixed(2));
      console.log('self memUsage', memUsage);
      result.observe(memUsage);
    });
  }
  async shutdown() {
    console.log('process meter shutdown');
  }
}

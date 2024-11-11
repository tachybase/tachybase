import { environmentMeters } from './environment';
import { processMeters } from './process';

export default class initMeters {
  meter: any;
  constructor(meter) {
    this.meter = meter;
  }
  async start() {
    try {
      const environmentMeter = new environmentMeters(this.meter);
      await environmentMeter.start();

      const processMeter = new processMeters(this.meter);
      await processMeter.start();
    } catch (error) {
      console.error('Failed to initialize meters:', error);
    }
  }
}

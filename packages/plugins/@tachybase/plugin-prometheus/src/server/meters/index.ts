import { hardware } from './hardware';
import { processSelf } from './process';

export default class initMeters {
  meter: any;
  constructor(meter) {
    this.meter = meter;
  }
  async start() {
    const hardwareMeter = new hardware(this.meter);
    await hardwareMeter.start();

    const processMeter = new processSelf(this.meter);
    await processMeter.start();
  }
}

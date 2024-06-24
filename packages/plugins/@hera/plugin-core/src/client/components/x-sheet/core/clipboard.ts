import CellRange from './cell_range';

export default class Clipboard {
  range: CellRange;
  state: 'clear' | 'cut' | 'copy';
  constructor() {
    this.range = null; // CellRange
    this.state = 'clear';
  }

  copy(cellRange: CellRange) {
    this.range = cellRange;
    this.state = 'copy';
    return this;
  }

  cut(cellRange: CellRange) {
    this.range = cellRange;
    this.state = 'cut';
    return this;
  }

  isCopy() {
    return this.state === 'copy';
  }

  isCut() {
    return this.state === 'cut';
  }

  isClear() {
    return this.state === 'clear';
  }

  clear() {
    this.range = null;
    this.state = 'clear';
  }
}

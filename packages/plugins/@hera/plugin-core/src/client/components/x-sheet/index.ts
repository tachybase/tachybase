import Bottombar from './component/bottombar';
import { h, HComponent } from './component/element';
import Sheet from './component/sheet';
import { cssPrefix } from './config';
import DataProxy from './core/data_proxy';
import { locale } from './locale/locale';

import './index.less';

export type CELL_SELECTED = 'cell-selected';
export type CELLS_SELECTED = 'cells-selected';
export type CELL_EDITED = 'cell-edited';

export type CellMerge = [number, number];

export interface SpreadsheetEventHandler {
  (envt: CELL_SELECTED, callback: (cell: Cell, rowIndex: number, colIndex: number) => void): void;
  (
    envt: CELLS_SELECTED,
    callback: (cell: Cell, parameters: { sri: number; sci: number; eri: number; eci: number }) => void,
  ): void;
  (evnt: CELL_EDITED, callback: (text: string, rowIndex: number, colIndex: number) => void): void;
}

export interface ColProperties {
  width?: number;
}

/**
 * Data for representing a cell
 */
export interface CellData {
  text: string;
  style?: number;
  merge?: CellMerge;
}
/**
 * Data for representing a row
 */
export interface RowData {
  cells: {
    [key: number]: CellData;
  };
}

/**
 * Data for representing a sheet
 */
export interface SheetData {
  name?: string;
  freeze?: string;
  styles?: CellStyle[];
  merges?: string[];
  cols?: {
    len?: number;
    [key: number]: ColProperties;
  };
  rows?: {
    [key: number]: RowData;
  };
}

/**
 * Data for representing a spreadsheet
 */
export interface SpreadsheetData {
  [index: number]: SheetData;
}

export interface CellStyle {
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  font?: {
    bold?: boolean;
  };
  bgcolor?: string;
  textwrap?: boolean;
  color?: string;
  border?: {
    top?: string[];
    right?: string[];
    bottom?: string[];
    left?: string[];
  };
}
export interface Editor {}
export interface Element {}

export interface Row {}
export interface Table {}
export interface Cell {}

export interface ExtendToolbarOption {
  tip?: string;
  el?: HTMLElement;
  icon?: string;
  onClick?: (data: object, sheet: object) => void;
}

export interface Options {
  mode?: 'edit' | 'read';
  showToolbar?: boolean;
  showGrid?: boolean;
  showContextmenu?: boolean;
  showBottomBar?: boolean;
  extendToolbar?: {
    left?: ExtendToolbarOption[];
    right?: ExtendToolbarOption[];
  };
  autoFocus?: boolean;
  view?: {
    height: () => number;
    width: () => number;
  };
  row?: {
    len: number;
    height: number;
  };
  col?: {
    len: number;
    width: number;
    indexWidth: number;
    minWidth: number;
  };
  style?: {
    bgcolor: string;
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
    textwrap: boolean;
    strike: boolean;
    underline: boolean;
    color: string;
    font: {
      name: 'Helvetica';
      size: number;
      bold: boolean;
      italic: false;
    };
  };
}

class Spreadsheet {
  private targetEl: HTMLElement;
  private options: Options;
  sheetIndex: number;
  datas: any[];
  bottombar: Bottombar;
  sheet: any;
  data: DataProxy;
  rootEl: HComponent;
  constructor(selectors: string | HTMLElement, options: Options = {}) {
    this.options = { showBottomBar: true, ...options };
    this.sheetIndex = 1;
    this.datas = [];

    if (typeof selectors === 'string') {
      this.targetEl = document.querySelector(selectors) as HTMLElement;
    } else {
      this.targetEl = selectors;
    }
    this.bottombar = this.options.showBottomBar
      ? new Bottombar(
          () => {
            if (this.options.mode === 'read') return;
            const d = this.addSheet();
            this.sheet.resetData(d);
          },
          (index) => {
            const d = this.datas[index];
            this.sheet.resetData(d);
          },
          () => {
            this.deleteSheet();
          },
          (index, value) => {
            this.datas[index].name = value;
            this.sheet.trigger('change');
          },
        )
      : null;
    this.data = this.addSheet();
    this.rootEl = h('div', `${cssPrefix}`).on('contextmenu', (evt) => evt.preventDefault());
    // create canvas element
    this.targetEl.appendChild(this.rootEl.el);
    this.sheet = new Sheet(this.rootEl, this.data);
    if (this.bottombar !== null) {
      this.rootEl.child(this.bottombar.el);
    }
  }

  dispose() {
    this.targetEl.removeChild(this.rootEl.el);
    console.debug('x-sheet is diposed');
  }

  addSheet(name?: string, active = true) {
    const n = name || `sheet${this.sheetIndex}`;
    const d = new DataProxy(n, this.options);
    d.change = (...args) => {
      this.sheet.trigger('change', ...args);
    };
    this.datas.push(d);
    // console.log('d:', n, d, this.datas);
    if (this.bottombar !== null) {
      this.bottombar.addItem(n, active, this.options);
    }
    this.sheetIndex += 1;
    return d;
  }

  deleteSheet() {
    if (this.bottombar === null) return;

    const [oldIndex, nindex] = this.bottombar.deleteItem();
    if (oldIndex >= 0) {
      this.datas.splice(oldIndex, 1);
      if (nindex >= 0) this.sheet.resetData(this.datas[nindex]);
      this.sheet.trigger('change');
    }
  }

  loadData(data: Record<string, any>): this {
    const ds = Array.isArray(data) ? data : [data];
    if (this.bottombar !== null) {
      this.bottombar.clear();
    }
    this.datas = [];
    if (ds.length > 0) {
      for (let i = 0; i < ds.length; i += 1) {
        const it = ds[i];
        const nd = this.addSheet(it.name, i === 0);
        nd.setData(it);
        if (i === 0) {
          this.sheet.resetData(nd);
        }
      }
    }
    return this;
  }

  getData(): Record<string, any> {
    return this.datas.map((it) => it.getData());
  }

  cellText(ri: number, ci: number, text: string, sheetIndex = 0): this {
    this.datas[sheetIndex].setCellText(ri, ci, text, 'finished');
    return this;
  }

  cell(ri: number, ci: number, sheetIndex = 0) {
    return this.datas[sheetIndex].getCell(ri, ci);
  }

  cellStyle(ri: number, ci: number, sheetIndex = 0): CellStyle {
    return this.datas[sheetIndex].getCellStyle(ri, ci);
  }

  reRender() {
    this.sheet.table.render();
    return this;
  }

  on(eventName, func) {
    this.sheet.on(eventName, func);
    return this;
  }

  validate() {
    const { validations } = this.data;
    return validations.errors.size <= 0;
  }

  /**
   * bind handler to change event, including data change and user actions
   * @param cb
   * @returns
   */
  change(cb: (json: Record<string, any>) => void): this {
    this.sheet.on('change', cb);
    return this;
  }

  /**
   * set locale
   * @param lang
   * @param message
   */
  static locale(lang: string, message: unknown): void {
    locale(lang, message);
  }
}

export default Spreadsheet;

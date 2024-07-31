import { expr2xy, xy2expr } from './alphabet';

class CellRange {
  constructor(
    public sri: number,
    public sci: number,
    public eri: number,
    public eci: number,
    public w = 0,
    public h = 0,
  ) {}

  set(sri: number, sci: number, eri: number, eci: number) {
    this.sri = sri;
    this.sci = sci;
    this.eri = eri;
    this.eci = eci;
  }

  multiple() {
    return this.eri - this.sri > 0 || this.eci - this.sci > 0;
  }

  // cell-index: ri, ci
  // cell-ref: A10
  includes(a: string, b: undefined): boolean;
  includes(a: number, b: number): boolean;
  includes(a: string | number, b: number | undefined): boolean {
    let [ri, ci] = [0, 0];
    if (typeof a === 'string') {
      [ci, ri] = expr2xy(a);
    } else if (typeof a === 'number') {
      [ri, ci] = [a, b];
    }
    const { sri, sci, eri, eci } = this;
    return sri <= ri && ri <= eri && sci <= ci && ci <= eci;
  }

  each(cb, rowFilter = (i: number) => true) {
    const { sri, sci, eri, eci } = this;
    for (let i = sri; i <= eri; i += 1) {
      if (rowFilter(i)) {
        for (let j = sci; j <= eci; j += 1) {
          cb(i, j);
        }
      }
    }
  }

  contains(other: CellRange) {
    return this.sri <= other.sri && this.sci <= other.sci && this.eri >= other.eri && this.eci >= other.eci;
  }

  // within
  within(other: CellRange) {
    return this.sri >= other.sri && this.sci >= other.sci && this.eri <= other.eri && this.eci <= other.eci;
  }

  // disjoint
  disjoint(other: CellRange) {
    return this.sri > other.eri || this.sci > other.eci || other.sri > this.eri || other.sci > this.eci;
  }

  // intersects
  intersects(other: CellRange) {
    return this.sri <= other.eri && this.sci <= other.eci && other.sri <= this.eri && other.sci <= this.eci;
  }

  // union
  union(other: CellRange) {
    const { sri, sci, eri, eci } = this;
    return new CellRange(
      other.sri < sri ? other.sri : sri,
      other.sci < sci ? other.sci : sci,
      other.eri > eri ? other.eri : eri,
      other.eci > eci ? other.eci : eci,
    );
  }

  // intersection
  // intersection(other) {}

  // Returns Array<CellRange> that represents that part of this that does not intersect with other
  // difference
  difference(other: CellRange) {
    const ret = [];
    const addRet = (sri, sci, eri, eci) => {
      ret.push(new CellRange(sri, sci, eri, eci));
    };
    const { sri, sci, eri, eci } = this;
    const dsr = other.sri - sri;
    const dsc = other.sci - sci;
    const der = eri - other.eri;
    const dec = eci - other.eci;
    if (dsr > 0) {
      addRet(sri, sci, other.sri - 1, eci);
      if (der > 0) {
        addRet(other.eri + 1, sci, eri, eci);
        if (dsc > 0) {
          addRet(other.sri, sci, other.eri, other.sci - 1);
        }
        if (dec > 0) {
          addRet(other.sri, other.eci + 1, other.eri, eci);
        }
      } else {
        if (dsc > 0) {
          addRet(other.sri, sci, eri, other.sci - 1);
        }
        if (dec > 0) {
          addRet(other.sri, other.eci + 1, eri, eci);
        }
      }
    } else if (der > 0) {
      addRet(other.eri + 1, sci, eri, eci);
      if (dsc > 0) {
        addRet(sri, sci, other.eri, other.sci - 1);
      }
      if (dec > 0) {
        addRet(sri, other.eci + 1, other.eri, eci);
      }
    }
    if (dsc > 0) {
      addRet(sri, sci, eri, other.sci - 1);
      if (dec > 0) {
        addRet(sri, other.eri + 1, eri, eci);
        if (dsr > 0) {
          addRet(sri, other.sci, other.sri - 1, other.eci);
        }
        if (der > 0) {
          addRet(other.sri + 1, other.sci, eri, other.eci);
        }
      } else {
        if (dsr > 0) {
          addRet(sri, other.sci, other.sri - 1, eci);
        }
        if (der > 0) {
          addRet(other.sri + 1, other.sci, eri, eci);
        }
      }
    } else if (dec > 0) {
      addRet(eri, other.eci + 1, eri, eci);
      if (dsr > 0) {
        addRet(sri, sci, other.sri - 1, other.eci);
      }
      if (der > 0) {
        addRet(other.eri + 1, sci, eri, other.eci);
      }
    }
    return ret;
  }

  size() {
    return [this.eri - this.sri + 1, this.eci - this.sci + 1];
  }

  toString() {
    const { sri, sci, eri, eci } = this;
    let ref = xy2expr(sci, sri);
    if (this.multiple()) {
      ref = `${ref}:${xy2expr(eci, eri)}`;
    }
    return ref;
  }

  clone() {
    const { sri, sci, eri, eci, w, h } = this;
    return new CellRange(sri, sci, eri, eci, w, h);
  }

  /*
  toJSON() {
    return this.toString();
  }
  */

  equals(other: CellRange) {
    return this.eri === other.eri && this.eci === other.eci && this.sri === other.sri && this.sci === other.sci;
  }

  static valueOf(ref: string) {
    // B1:B8, B1 => 1 x 1 cell range
    const refs = ref.split(':');
    const [sci, sri] = expr2xy(refs[0]);
    let [eri, eci] = [sri, sci];
    if (refs.length > 1) {
      [eci, eri] = expr2xy(refs[1]);
    }
    return new CellRange(sri, sci, eri, eci);
  }
}

export default CellRange;

export { CellRange };

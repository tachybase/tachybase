import Topo from '@hapi/topo';

export interface ToposortOptions extends Topo.Options {
  tag?: string;
  group?: string;
  unique?: boolean;
}

export class Toposort<T> extends Topo.Sorter<T> {
  #tags = new Set<string>();

  unshift(...items) {
    (this as any)._items.unshift(
      ...items.map((node) => ({
        node,
        seq: (this as any)._items.length,
        sort: 0,
        before: [],
        after: [],
        group: '?',
      })),
    );
  }

  push(...items) {
    (this as any)._items.push(
      ...items.map((node) => ({
        node,
        seq: (this as any)._items.length,
        sort: 0,
        before: [],
        after: [],
        group: '?',
      })),
    );
  }

  add(nodes: T | T[], options?: ToposortOptions): T[] {
    if (options?.tag) {
      options.group = options.tag;
      if (this.#tags.has(options.tag) && options.unique) {
        return;
      }
      this.#tags.add(options.tag);
    }
    return super.add(nodes, options);
  }
}

export default Toposort;

import _ from 'lodash';
import { ModelStatic } from 'sequelize';

import { Model } from './model';

const debug = require('debug')('noco-database');

type sortType = string[];

export default class SortParser {
  model: ModelStatic<Model>;
  sort: string | string[];

  constructor(sort: sortType, model: ModelStatic<Model>) {
    this.model = model;
    this.sort = sort;
  }

  toSequelizeParams(): any {
    debug('sort %o', this.sort);

    if (!this.sort) {
      return {};
    }

    const model = this.model;
    const include = {};
    const associations = model.associations;
    const group = this.getGroup();

    debug('associations %O', associations);

    for (const sort of group) {
      const keys = sort.split('.');

      // origins ?
      const origins = [];

      while (keys.length) {
        // move key from keys to origins
        const firstKey = keys.shift();
        origins.push(firstKey);

        // firstKey is number
        if (!_.isNaN(parseInt(firstKey))) {
          continue;
        }

        // firstKey is not association
        if (!associations[firstKey]) {
          continue;
        }

        const associationKeys = [];

        associationKeys.push(firstKey);

        debug('associationKeys %o', associationKeys);

        const existInclude = _.get(include, firstKey);

        if (!existInclude) {
          // set sequelize include option
          _.set(include, firstKey, {
            association: firstKey,
            attributes: [], // out put empty fields by default
          });
        }

        // association target model
        let target = associations[firstKey].target;
        debug('association target %o', target);

        while (target) {
          const attr = keys.shift();
          origins.push(attr);
          // if it is target model attribute
          if (target.rawAttributes[attr]) {
            associationKeys.push(target.rawAttributes[attr].field || attr);
            target = null;
          } else if (target.associations[attr]) {
            // if it is target model association (nested association filter)
            associationKeys.push(attr);
            const assoc = [];
            associationKeys.forEach((associationKey, index) => {
              if (index > 0) {
                assoc.push('include');
              }
              assoc.push(associationKey);
            });

            const existInclude = _.get(include, assoc);
            if (!existInclude) {
              _.set(include, assoc, {
                association: attr,
                attributes: [],
              });
            }

            target = target.associations[attr].target;
          } else {
            throw new Error(`${attr} neither ${firstKey}'s association nor ${firstKey}'s attribute`);
          }
        }

        debug('associationKeys %o', associationKeys);
      }
    }

    const toInclude = (items) => {
      return Object.values(items).map((item: any) => {
        if (item.include) {
          item.include = toInclude(item.include);
        }
        return item;
      });
    };
    debug('include %o', include);
    const results = { include: toInclude(include), group };

    //traverse filter include, set fromFiler to true
    const traverseInclude = (include) => {
      for (const item of include) {
        if (item.include) {
          traverseInclude(item.include);
        }
      }
    };

    traverseInclude(results.include);

    return results;
  }

  getGroup(): string[] {
    if (!this.sort) {
      return [];
    }
    let sortList = typeof this.sort === 'string' ? [this.sort] : this.sort;
    return sortList.filter((v) => v.includes('.')).map((v) => (v.startsWith('-') ? v.substring(1) : v));
  }
}

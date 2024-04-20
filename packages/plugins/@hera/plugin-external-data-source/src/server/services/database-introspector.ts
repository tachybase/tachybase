import { ViewFieldInference } from '@nocobase/database';
import { mergeOptions } from '@nocobase/plugin-data-source-manager';
import { EventEmitter } from 'events';
import _ from 'lodash';
import { showUniqueIndexes } from './utils';
export class DatabaseIntrospector extends EventEmitter {
  db;
  typeInterfaceMap;
  constructor(options) {
    super();
    this.db = options.db;
    this.typeInterfaceMap = options.typeInterfaceMap;
  }
  async getCollections(options = {}) {
    let tableList = await this.db.sequelize.getQueryInterface().showAllTables();
    const views = (await this.db.queryInterface.listViews()).map((view) => view.name);
    tableList = tableList.concat(views);
    if (this.db.options.tablePrefix) {
      tableList = tableList.filter((tableName) => {
        return tableName.startsWith(this.db.options.tablePrefix);
      });
    }
    const batchSize = 5;
    const results = [];
    for (let i = 0; i < tableList.length; i += batchSize) {
      const batch = tableList.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (tableName) => {
          const tableInfo = {
            tableName,
          };
          this.emit('loadMessage', {
            message: `load table ${tableName}`,
          });
          const collectionOptions = this.tableInfoToCollectionOptions(tableInfo);
          // @ts-ignore
          const localOptions = options.localData?.[collectionOptions.name];
          try {
            return await this.getCollection({
              tableInfo,
              localOptions,
              mergedOptions: views.includes(tableName) ? { view: true, template: 'view' } : {},
            });
          } catch (e) {
            if (e.message.includes('No description found for')) {
              return false;
            }
            this.db.logger.error(`load table ${tableName} failed, ${e.message}`);
            return false;
          }
        }),
      );
      results.push(...batchResults);
    }
    return results.filter(Boolean);
  }
  async getPrimaryKeysOfTable(tableInfo) {
    const sql = `
      SELECT
        pg_attribute.attname,
        format_type(pg_attribute.atttypid, pg_attribute.atttypmod)
      FROM pg_index, pg_class, pg_attribute, pg_namespace
      WHERE
        pg_class.oid = '${tableInfo.tableName}'::regclass AND
  indrelid = pg_class.oid AND
  nspname = '${tableInfo.schema || 'public'}' AND
  pg_class.relnamespace = pg_namespace.oid AND
  pg_attribute.attrelid = pg_class.oid AND
  pg_attribute.attnum = any(pg_index.indkey)
 AND indisprimary
    `;
    return await this.db.sequelize.query(sql, {
      type: 'SELECT',
    });
  }
  async getCollection(options) {
    const { tableInfo } = options;
    const columnsInfo = await this.db.sequelize.getQueryInterface().describeTable(tableInfo);
    const primaryKeys = await this.getPrimaryKeysOfTable(tableInfo);
    Object.keys(columnsInfo).forEach((columnName) => {
      const columnInfo = columnsInfo[columnName];
      const primaryKey = primaryKeys.find((key) => key.attname === columnName);
      if (primaryKey) {
        columnInfo.primaryKey = true;
      }
    });
    const collectionOptions = this.tableInfoToCollectionOptions(tableInfo);
    const constraints = await this.db.sequelize.query(showUniqueIndexes(tableInfo), {
      type: 'SELECT',
    });
    try {
      const fields = Object.keys(columnsInfo).map((columnName) => {
        return this.columnInfoToFieldOptions(columnsInfo, columnName, constraints);
      });
      const unsupportedFields = fields.filter((field) => {
        // @ts-ignore
        return field.supported === false;
      });
      const supportFields = fields.filter((field) => {
        // @ts-ignore
        return field.supported !== false;
      });
      const remoteCollectionInfo = {
        ...collectionOptions,
        ...((options == null ? void 0 : options.mergedOptions) || {}),
        ...this.collectionOptionsByFields(supportFields),
        fields: [...supportFields],
      };
      if (unsupportedFields.length) {
        remoteCollectionInfo.unsupportedFields = unsupportedFields;
      }
      const finalOptions = this.mergeLocalDataIntoCollectionOptions(remoteCollectionInfo, options.localOptions);
      if (finalOptions.view && !finalOptions.filterTargetKey && supportFields.find((field) => field.name === 'id')) {
        finalOptions.filterTargetKey = 'id';
      }
      return finalOptions;
    } catch (e) {
      throw new Error(`table ${tableInfo.tableName} introspection error: ${e.message}`);
    }
  }
  loadCollection(options) {
    this.db.collection({
      ...options,
      introspected: true,
    });
  }
  loadCollections(options) {
    options.collections.forEach((collection) => {
      this.loadCollection(collection);
    });
  }
  tableInfoToCollectionOptions(tableInfo) {
    const tableName = tableInfo.tableName;
    let name = tableName;
    if (this.db.options.tablePrefix) {
      name = tableName.replace(this.db.options.tablePrefix, '');
    }
    return {
      name,
      title: name,
      schema: tableInfo.schema,
      tableName,
    };
  }
  collectionOptionsByFields(fields) {
    const options = {
      timestamps: false,
      autoGenId: false,
      filterTargetKey: undefined,
    };
    const autoIncrementField = fields.find((field) => field.autoIncrement);
    if (autoIncrementField) {
      options.filterTargetKey = autoIncrementField.name;
    }
    const primaryKeys = fields.filter((field) => field.primaryKey);
    if (!options.filterTargetKey && primaryKeys.length === 1) {
      options.filterTargetKey = primaryKeys[0].name;
    }
    const uniques = fields.filter((field) => field.unique);
    if (!options.filterTargetKey && uniques.length === 1) {
      options.filterTargetKey = uniques[0].name;
    }
    return options;
  }
  mergeLocalDataIntoCollectionOptions(collectionOptions, localData) {
    if (!localData) {
      return collectionOptions;
    }
    const collectionFields = collectionOptions.fields || [];
    const localFieldsAsObject = _.keyBy(localData.fields, 'name');
    const newFields = collectionFields.map((field) => {
      const localField = localFieldsAsObject[field.name];
      if (!localField) {
        return field;
      }
      return mergeOptions(field, localField);
    });
    const localAssociationFields = localData.fields?.filter((field) => {
      return ['belongsTo', 'belongsToMany', 'hasMany', 'hasOne'].includes(field.type);
    });
    if (localAssociationFields) {
      newFields.push(...localAssociationFields);
    }
    return {
      ...collectionOptions,
      ..._.omit(localData, ['fields']),
      fields: newFields,
    };
  }
  columnInfoToFieldOptions(columnsInfo, columnName, indexes) {
    const columnInfo = columnsInfo[columnName];
    let fieldOptions = {
      ...this.columnAttribute(columnsInfo, columnName, indexes),
      ...ViewFieldInference.inferToFieldType({
        dialect: this.db.options.dialect,
        type: columnInfo.type,
        name: columnName,
      }),
      rawType: columnInfo.type,
      name: columnName,
    };
    const interfaceConfig = this.getDefaultInterfaceByType(columnsInfo, columnName, fieldOptions.type);
    if (typeof interfaceConfig === 'string') {
      // @ts-ignore
      fieldOptions.interface = interfaceConfig;
    } else {
      fieldOptions = {
        ...fieldOptions,
        ...interfaceConfig,
      };
    }
    if (!fieldOptions.type) {
      return {
        rawType: columnInfo.type,
        name: columnName,
        supported: false,
      };
    }
    _.set(fieldOptions, 'uiSchema.title', columnName);
    return fieldOptions;
  }
  getDefaultInterfaceByType(columnsInfo, columnName, type) {
    const interfaceConfig = this.typeInterfaceMap[type];
    if (typeof interfaceConfig === 'function') {
      return interfaceConfig(columnsInfo[columnName]);
    }
    return interfaceConfig;
  }
  columnAttribute(columnsInfo, columnName, indexes) {
    const columnInfo = columnsInfo[columnName];
    const attr = {
      type: columnInfo.type,
      allowNull: columnInfo.allowNull,
      primaryKey: columnInfo.primaryKey,
      unique: false,
      autoIncrement: false,
    };
    if (columnInfo.defaultValue && typeof columnInfo.defaultValue === 'string') {
      const isSerial = columnInfo.defaultValue.match(/^nextval\(/);
      const isUUID = columnInfo.defaultValue.match(/^uuid_generate_v4\(/);
      if (isSerial || isUUID) {
        attr.autoIncrement = true;
      }
    }
    for (const index of indexes) {
      if (index['is_single_column'] && index['column_name'] === columnName) {
        attr.unique = true;
      }
    }
    return attr;
  }
}

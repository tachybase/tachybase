import { randomUUID } from 'crypto';
import { Cache } from '@tachybase/cache';
import { Database, Transaction } from '@tachybase/database';

export default class Resources {
  cache: Cache;
  db: Database;

  constructor(db: Database, cache: Cache) {
    this.cache = cache;
    this.db = db;
  }

  async getETag(locale: string) {
    const { eTag } = await this.getTranslationsCache(locale);
    return eTag;
  }

  async getTexts(transaction?: Transaction) {
    return await this.cache.wrap(`texts`, async () => {
      return await this.db.getRepository('localizationTexts').find({
        fields: ['id', 'module', 'text'],
        raw: true,
        transaction,
      });
    });
  }

  async getTranslations(locale: string) {
    const response = await this.getTranslationsCache(locale);
    return response.result;
  }

  async getTranslationsCache(locale: string) {
    return await this.cache.wrap(`translations:${locale}`, async () => {
      const result = await this.db.getRepository('localizationTranslations').find({
        fields: ['textId', 'translation'],
        filter: { locale },
        raw: true,
      });
      this.cache.del(`translationsETag:${locale}`);
      return { result, eTag: randomUUID() };
    });
  }

  async getResources(locale: string) {
    const [texts, translations] = await Promise.all([this.getTexts(), this.getTranslations(locale)]);
    const resources = {};
    const textsMap = texts.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {});
    translations.forEach((item) => {
      const text = textsMap[item.textId];
      if (!text) {
        return;
      }
      const module = text.module;
      if (!resources[module]) {
        resources[module] = {};
      }
      resources[module][text.text] = item.translation;
    });
    return resources;
  }

  async filterExists(texts: { text: string; module: string }[], transaction?: Transaction) {
    const existTexts = await this.getTexts(transaction);
    return texts.filter((text) => {
      return !existTexts.find((item: any) => item.text === text.text && item.module === text.module);
    });
  }

  async updateCacheTexts(texts: any[], transaction?: Transaction) {
    const newTexts = texts.map((text) => ({
      id: text.id,
      module: text.module,
      text: text.text,
    }));
    const existTexts = await this.getTexts(transaction);
    await this.cache.set(`texts`, [...existTexts, ...newTexts]);
  }

  async resetCache(locale: string) {
    await this.cache.del(`translations:${locale}`);
  }
}

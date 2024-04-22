import { PluginConfiguration } from '@nocobase/server';
import process from 'process';

export default [process.env.PRESET_NAME ?? 'tachybase'] as PluginConfiguration[];

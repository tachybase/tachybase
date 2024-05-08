import { PluginConfiguration } from '@tachybase/server';
import process from 'process';

export default [process.env.PRESET_NAME ?? 'tachybase'] as PluginConfiguration[];

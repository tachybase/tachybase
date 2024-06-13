import process from 'process';
import { PluginConfiguration } from '@tachybase/server';

export default [process.env.PRESET_NAME ?? 'tachybase'] as PluginConfiguration[];

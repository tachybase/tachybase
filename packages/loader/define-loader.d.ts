/// <reference types="node" />

import { Module } from 'node:module';

/**
 * 自定义模块加载器工厂函数
 *
 * @param whitelists - 包含被允许特殊处理的模块名的集合
 * @param originalLoad - 原始的模块加载函数（通常为 Module._load）
 * @param lookingPaths - 用于尝试解析模块的路径数组
 * @returns 一个新的模块加载函数
 */
declare const defineLoader: (
  whitelists: Set<string>,
  originalLoad: typeof Module._load,
  lookingPaths: string[],
) => (request: string, parent: NodeModule | null, isMain: boolean) => any;

export { defineLoader };

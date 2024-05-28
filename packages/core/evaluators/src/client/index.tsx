import { Registry } from '@tachybase/utils/client';

import formulajs from './engines/formulajs';
import mathjs from './engines/mathjs';
import string from './engines/string';

export interface Evaluator {
  label: string;
  tooltip?: string;
  link?: string;
  evaluate(exp: string, scope?: { [key: string]: any }): any;
}

export const evaluators = new Registry<Evaluator>();

evaluators.register('math.js', mathjs);
evaluators.register('formula.js', formulajs);
evaluators.register('string', string);

export function getOptions() {
  return Array.from((evaluators as Registry<Evaluator>).getEntities()).reduce(
    (result: any[], [value, options]) => result.concat({ value, ...options }),
    [],
  );
}

export default evaluators;

import { Registry } from '@tachybase/utils';

import { Evaluator } from '../utils';
import formulajs from '../utils/formulajs';
import mathjs from '../utils/mathjs';
import string from '../utils/string';

export { Evaluator, evaluate, appendArrayColumn } from '../utils';

export const evaluators = new Registry<Evaluator>();

evaluators.register('math.js', mathjs);
evaluators.register('formula.js', formulajs);
evaluators.register('string', string);

export default evaluators;

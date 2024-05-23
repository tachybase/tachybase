import { connect } from '@tachybase/schema';

import Expression from './Expression';
import Result from './Result';

export const Formula = () => null;

Formula.Expression = Expression;
Formula.Result = connect(Result);

export default Formula;

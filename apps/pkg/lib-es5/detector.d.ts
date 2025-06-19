import * as babel from '@babel/parser';
import * as babelTypes from '@babel/types';

export declare function visitorSuccessful(
  node: babelTypes.Node,
  test?: boolean,
):
  | string
  | {
      alias: string | number | boolean;
      aliasType: number;
      mustExclude: boolean;
      mayExclude: boolean;
    }
  | {
      alias: string | number | boolean;
      aliasType: number;
      mustExclude?: undefined;
      mayExclude?: undefined;
    }
  | {
      alias: string | number | boolean;
      aliasType: number;
      mayExclude: boolean;
      mustExclude?: undefined;
    }
  | null;
export declare function visitorNonLiteral(n: babelTypes.Node): {
  alias: string;
  mustExclude: boolean;
  mayExclude: boolean;
} | null;
export declare function visitorMalformed(n: babelTypes.Node): {
  alias: string;
} | null;
export declare function visitorUseSCWD(n: babelTypes.Node): {
  alias: string;
} | null;
type VisitorFunction = (node: babelTypes.Node, trying?: boolean) => boolean;
export declare function parse(body: string): babel.ParseResult<babelTypes.File>;
export declare function detect(body: string, visitor: VisitorFunction): void;
export {};
//# sourceMappingURL=detector.d.ts.map

import { useGridCardBlockParams } from './useGridCardBlockParams';
import { useSourceIdCommon } from '../../../useSourceIdCommon';

export function useGridCardBlockDecoratorProps(props) {
  const params = useGridCardBlockParams(props);
  let sourceId;

  // 因为 association 是固定的，所以可以在条件中使用 hooks
  if (props.association) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    sourceId = useSourceIdCommon(props.association);
  }

  return {
    params,
    sourceId,
  };
}

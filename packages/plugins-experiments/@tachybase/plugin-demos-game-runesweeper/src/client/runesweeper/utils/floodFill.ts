import type { TileType } from '../components/tile/Tile';

/**
 * Recursively flood fills all applicable 0s.
 * Not a pure function; edits the tiles in-place
 */
export default function floodFill(triggerTile: TileType, tiles: TileType[]) {
  const { r, c } = triggerTile;

  const tilesAround = [
    tiles.find((tile) => tile.r === r && tile.c === c + 1),
    tiles.find((tile) => tile.r === r && tile.c === c - 1),
    tiles.find((tile) => tile.r === r + 1 && tile.c === c),
    tiles.find((tile) => tile.r === r - 1 && tile.c === c),
    tiles.find((tile) => tile.r === r + 1 && tile.c === c + 1),
    tiles.find((tile) => tile.r === r - 1 && tile.c === c - 1),
    tiles.find((tile) => tile.r === r + 1 && tile.c === c - 1),
    tiles.find((tile) => tile.r === r - 1 && tile.c === c + 1),
  ].filter((tile) => tile?.id && !tile?.swept && tile.flagStatus !== 'flagged');

  tilesAround.forEach((tile) => {
    if (!tile) return;

    tiles[tile.id - 1].swept = true;
    tiles[tile.id - 1].flagStatus = 'unflagged';

    if (tile.minesAround === 0) floodFill(tile, tiles);
  });
}

import type { TileType } from '../components/tile/Tile';
import type { GameState } from '../hooks/useGameStateContext';
import floodFill from './floodFill';

/**
 * {@link https://en.wikipedia.org/wiki/Chording#Minesweeper_tactic | Chording} is the feature of sweeping all neighbouring tiles when the appropriate number of neighbouring tiles have been flagged.
 */
export default function chord(triggerTile: TileType, gameState: GameState): GameState {
  const newTiles = [...gameState.tiles];
  const { r, c, minesAround } = triggerTile;

  const numOfAdjacentFlaggedTiles = [
    newTiles.find((tile) => tile.r === r && tile.c === c + 1),
    newTiles.find((tile) => tile.r === r && tile.c === c - 1),
    newTiles.find((tile) => tile.r === r + 1 && tile.c === c),
    newTiles.find((tile) => tile.r === r - 1 && tile.c === c),
    newTiles.find((tile) => tile.r === r + 1 && tile.c === c + 1),
    newTiles.find((tile) => tile.r === r - 1 && tile.c === c - 1),
    newTiles.find((tile) => tile.r === r + 1 && tile.c === c - 1),
    newTiles.find((tile) => tile.r === r - 1 && tile.c === c + 1),
  ].filter((tile) => tile?.flagStatus === 'flagged').length;

  if (minesAround !== numOfAdjacentFlaggedTiles) return gameState;

  // Chording is a go-go!

  const tilesToSweep = [
    newTiles.find((tile) => tile.r === r && tile.c === c + 1),
    newTiles.find((tile) => tile.r === r && tile.c === c - 1),
    newTiles.find((tile) => tile.r === r + 1 && tile.c === c),
    newTiles.find((tile) => tile.r === r - 1 && tile.c === c),
    newTiles.find((tile) => tile.r === r + 1 && tile.c === c + 1),
    newTiles.find((tile) => tile.r === r - 1 && tile.c === c - 1),
    newTiles.find((tile) => tile.r === r + 1 && tile.c === c - 1),
    newTiles.find((tile) => tile.r === r - 1 && tile.c === c + 1),
  ].filter((tile) => !tile?.swept && tile?.flagStatus !== 'flagged');

  const triggeredMines = tilesToSweep.filter((tile) => tile && tile.isMine) as TileType[];
  const triggeredMinesIds = triggeredMines.map((tm) => tm.id);

  if (triggeredMinesIds.length) {
    triggeredMines.forEach((m) => (m.swept = true));
    return { ...gameState, status: 'lost' };
  }

  tilesToSweep.forEach((tile) => {
    if (!tile) return;

    tile.swept = true;
    tile.flagStatus = 'unflagged';

    if (tile.minesAround === 0) floodFill(tile, newTiles);
  });

  return { ...gameState, tiles: newTiles };
}

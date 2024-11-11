import { TileType } from '../components/tile/Tile';

export default function generateTiles(
  columns: number,
  rows: number,
  minePercentage: number,
  isLandscape: boolean,
): TileType[] {
  const tilesToReturn: TileType[] = [];

  const numOfRows = isLandscape ? columns : rows;
  const numOfColumns = isLandscape ? rows : columns;

  // Create a board of all 0s
  for (let r = 1; r <= numOfRows; r++) {
    for (let c = 1; c <= numOfColumns; c++) {
      tilesToReturn.push({
        c,
        r,
        isMine: false,
        id: c + (r - 1) * numOfColumns,
        swept: false,
        flagStatus: 'unflagged',
        minesAround: 0,
      });
    }
  }

  // Place the mines
  let minesToPlace = Math.round(columns * rows * minePercentage);

  while (minesToPlace > 0) {
    const index = Math.floor(Math.random() * rows * columns);
    if (!tilesToReturn[index].isMine) {
      tilesToReturn[index].isMine = true;
      minesToPlace--;
    }
  }

  // Update the minesAround value of each tile
  tilesToReturn.forEach((tile) => {
    const { r, c } = tile;
    tile.minesAround = [
      tilesToReturn.find((t) => t.r === r && t.c === c + 1),
      tilesToReturn.find((t) => t.r === r && t.c === c - 1),
      tilesToReturn.find((t) => t.r === r + 1 && t.c === c),
      tilesToReturn.find((t) => t.r === r - 1 && t.c === c),
      tilesToReturn.find((t) => t.r === r + 1 && t.c === c + 1),
      tilesToReturn.find((t) => t.r === r - 1 && t.c === c - 1),
      tilesToReturn.find((t) => t.r === r + 1 && t.c === c - 1),
      tilesToReturn.find((t) => t.r === r - 1 && t.c === c + 1),
    ].filter((tileAround) => tileAround?.isMine).length;
  });

  return tilesToReturn;
}

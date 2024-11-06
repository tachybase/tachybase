import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

import { TileType } from '../components/tile/Tile';

export type Status = 'pre' | 'during' | 'won' | 'lost';

export interface GameState {
  tiles: TileType[];
  status: Status;
}

interface GameStateContextType {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

const defaultValue: GameStateContextType = {
  gameState: { tiles: [], status: 'pre' },
  setGameState: () => {},
};

export const GameStateContext = createContext(defaultValue);

export function useGameStateContext() {
  const { gameState, setGameState } = useContext(GameStateContext);
  return { gameState, setGameState };
}

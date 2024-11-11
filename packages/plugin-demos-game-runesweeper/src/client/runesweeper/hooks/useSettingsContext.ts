import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

import { difficultiesDict, sizesDict } from '../utils/settings';

export interface Settings {
  mineRatio: number;
  numOfRows: number;
  numOfColumns: number;
  swipeToFlag: boolean;
  swipeToChord: boolean;
  allowMaybe: boolean;
  instalose: boolean;
  isLandscape: boolean;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

export const defaultSettings: Settings = {
  numOfColumns: sizesDict.m.w,
  numOfRows: sizesDict.m.h,
  mineRatio: difficultiesDict.medium.mineRatio,
  swipeToChord: true,
  swipeToFlag: true,
  allowMaybe: true,
  instalose: false,
  isLandscape: false,
};

const defaultValue: SettingsContextType = {
  settings: defaultSettings,
  setSettings: () => {},
};

export const SettingsContext = createContext(defaultValue);

export function useSettingsContext() {
  const { settings, setSettings } = useContext(SettingsContext);
  return { settings, setSettings };
}

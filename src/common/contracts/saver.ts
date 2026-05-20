import { SaveData } from 'common/save_data';

export interface Saver {
  load(): SaveData;

  save(state: SaveData): void;
}

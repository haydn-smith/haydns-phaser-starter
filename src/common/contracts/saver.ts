import { Data } from 'common/data';

export interface Saver {
  load(): Data;

  save(state: Data): void;
}

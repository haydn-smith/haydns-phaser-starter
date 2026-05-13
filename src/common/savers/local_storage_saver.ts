import { Saver } from 'common/contracts/saver';
import { SaveData } from 'common/save_data';
import { logEvent } from 'common/utils/log';
import { APP_ID } from 'constants';

export class LocalStorageSaver implements Saver {
  load(): SaveData {
    logEvent('Loading data from localStorage.');

    return SaveData.deserialise(window.localStorage.getItem(APP_ID) ?? undefined) as SaveData;
  }

  save(saveData: SaveData): void {
    logEvent('Saving data to localStorage.');

    window.localStorage.setItem(APP_ID, saveData.serialise());
  }
}

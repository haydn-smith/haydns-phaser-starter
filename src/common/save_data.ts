export class SaveData {
  private playtime: number = 0;

  setPlaytime(playtime: number) {
    this.playtime = playtime;

    return this;
  }

  addPlaytime(delta: number) {
    this.playtime += delta;

    return this;
  }

  getPlaytime() {
    return this.playtime;
  }

  serialise(): string {
    return JSON.stringify({
      playtime: this.playtime,
    });
  }

  static deserialise(str?: string) {
    if (str === undefined) {
      return new this();
    }

    const obj = JSON.parse(str);

    return new this().setPlaytime(obj.playtime);
  }
}

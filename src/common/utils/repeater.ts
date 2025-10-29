export class Repeater<T> {
  private current = 0;

  private isFinished = false;

  private onNextHandlers: Array<[number, () => void]> = [];

  constructor(
    private items: T[],
    private mode: 'once' | 'repeat' | 'repeat last'
  ) {}

  public next(): Repeater<T> {
    this.current += 1;

    this.onNextHandlers.filter(([index]) => index === this.current).forEach(([, fn]) => fn());

    if (this.current === this.items.length) {
      if (this.mode === 'once') {
        this.isFinished = true;
      } else if (this.mode === 'repeat') {
        this.current = 0;
      } else if (this.mode === 'repeat last') {
        this.current = this.items.length - 1;
      }
    }

    return this;
  }

  public reset(): Repeater<T> {
    this.current = 0;
    this.isFinished = false;

    return this;
  }

  public currentItem(): null | T {
    if (this.isFinished) {
      return null;
    }

    return this.items[this.current];
  }

  public onNext(index: number, fn: () => void): Repeater<T> {
    this.onNextHandlers.push([index, fn]);

    return this;
  }
}

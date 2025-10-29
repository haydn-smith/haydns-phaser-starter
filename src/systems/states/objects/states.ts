export type StateFn<T> = ({
  delta,
  change,
}: {
  delta: number;
  timeInState: number;
  change: (state: T) => void;
}) => void;

export class States<T extends string, U extends T> extends Phaser.GameObjects.GameObject {
  private states: Partial<Record<T, StateFn<T>>> = {};

  private currentState: T;

  private timeInState = 0;

  constructor(scene: Phaser.Scene, initialState: U) {
    super(scene, 'States');

    this.renderFlags = 0;

    this.currentState = initialState;
  }

  public add(state: T, callback: StateFn<T>): States<T, U> {
    this.states[state] = callback;

    return this;
  }

  public preUpdate(_time: number, delta: number) {
    if (this.states[this.currentState] !== undefined) {
      this.states[this.currentState]?.({
        delta,
        timeInState: this.timeInState,
        change: (state: T) => this.change(state),
      });
    }

    this.timeInState += delta;
  }

  public current(): T {
    return this.currentState;
  }

  public change(state: T): States<T, U> {
    this.timeInState = 0;

    this.currentState = state;

    return this;
  }
}

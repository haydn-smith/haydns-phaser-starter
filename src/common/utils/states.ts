import { Scene } from 'common/scene';

export type StateFn<T> = ({
  delta,
  change,
}: {
  delta: number;
  timeInState: number;
  change: (state: T) => void;
}) => void;

export class States<T extends string, U extends T> {
  private states: Partial<Record<T, StateFn<T>>> = {};

  private currentState: T;

  private timeInState = 0;

  constructor(
    public scene: Scene,
    initialState: U
  ) {
    this.currentState = initialState;
  }

  add(state: T, callback: StateFn<T>) {
    this.states[state] = callback;

    return this;
  }

  step(delta: number) {
    if (this.states[this.currentState] !== undefined) {
      this.states[this.currentState]?.({
        delta,
        timeInState: this.timeInState,
        change: (state: T) => this.change(state),
      });
    }

    this.timeInState += delta;

    return this;
  }

  current() {
    return this.currentState;
  }

  change(state: T) {
    this.timeInState = 0;

    this.currentState = state;

    return this;
  }
}

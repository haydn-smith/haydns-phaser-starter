import { StateFn, States as StatesObject } from 'systems/states/objects/states';

export class States<TState extends string, TInitialState extends TState> {
  constructor(private states: StatesObject<TState, TInitialState>) {}

  public add(state: TState, callback: StateFn<TState>): States<TState, TInitialState> {
    this.states.add(state, callback);

    return this;
  }

  public current(): TState {
    return this.states.current();
  }

  public change(state: TState): States<TState, TInitialState> {
    this.states.change(state);

    return this;
  }

  public destroy(): void {
    this.states.destroy();
  }
}

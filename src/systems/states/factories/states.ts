import { States } from 'systems/states/decorators/states';
import { States as StatesObject } from 'systems/states/objects/states';

export function states<TState extends string, TInitialState extends TState>(
  scene: Phaser.Scene,
  initialState: TInitialState
): States<TState, TInitialState> {
  return new States(new StatesObject<TState, TInitialState>(scene, initialState).addToUpdateList());
}

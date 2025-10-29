export interface Sequenceable {
  reset(): void;

  update(delta: number): void;

  isComplete(): boolean;
}

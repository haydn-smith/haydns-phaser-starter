export const Gamepad = {
  One: 'One',
  Two: 'Two',
  Three: 'Three',
  Four: 'Four',
} as const;
export type KeyOfGamepad = keyof typeof Gamepad;
export type TypeOfGamepad = (typeof Gamepad)[KeyOfGamepad];

export const GamepadButton = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  L1: 4,
  R1: 5,
  L2: 6,
  R2: 7,
  Select: 8,
  Start: 9,
  StickLeft: 10,
  StickRight: 11,
  Up: 12,
  Down: 13,
  Left: 14,
  Right: 15,
  Vendor1: 16, // The 'PS Button' or 'Xbox Home' button.
  Vendor2: 17, // The Dualshock's touch panel thing.
  StickLeftUp: 18,
  StickLeftDown: 19,
  StickLeftLeft: 20,
  StickLeftRight: 21,
  StickRightUp: 22,
  StickRightDown: 23,
  StickRightLeft: 24,
  StickRightRight: 25,
} as const;
export type KeyOfGamepadButton = keyof typeof GamepadButton;
export type TypeOfGamepadButton = (typeof GamepadButton)[KeyOfGamepadButton];

export const GamepadStick = {
  Left: 'Left',
  Right: 'Right',
} as const;
export type KeyOfGamepadStick = keyof typeof GamepadStick;
export type TypeOfGamepadStick = (typeof GamepadStick)[KeyOfGamepadStick];

export const GamepadStickAxis = {
  LeftX: 0,
  LeftY: 1,
  RightX: 2,
  RightY: 3,
} as const;
export type KeyOfGamepadStickAxis = keyof typeof GamepadStickAxis;
export type TypeOfGamepadStickAxis = (typeof GamepadStickAxis)[KeyOfGamepadStickAxis];

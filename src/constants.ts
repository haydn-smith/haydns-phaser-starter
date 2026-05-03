export const DEPTH = {
  Background: 1000,
  Main: 2000,
  Foreground: 3000,
  UI: 4000,
  Debug: 9999,
} as const;
export type KeyOfDepth = keyof typeof DEPTH;
export type TypeOfDepth = (typeof DEPTH)[KeyOfDepth];

export const ACTION = {
  Up: 'up',
  Down: 'down',
  Left: 'left',
  Right: 'right',
  Action: 'action',
} as const;
export type KeyOfAction = keyof typeof ACTION;
export type TypeOfAction = (typeof ACTION)[KeyOfAction];

export const SCENE = {
  Boot: 'Boot',
  Preloader: 'Preloader',
  MainMenu: 'Main Menu',
  UserInterface: 'User Interface',
  Debug: 'Debug',
  SoundManager: 'Sound Manager',
} as const;
export type KeyOfScene = keyof typeof SCENE;
export type TypeOfScene = (typeof SCENE)[KeyOfScene];

export const TILEMAP = {
  Debug: 'tilemaps/debug/debug.json',
} as const;
export type KeyOfTilemap = keyof typeof TILEMAP;
export type TypeOfTilemap = (typeof TILEMAP)[KeyOfTilemap];

export const TILESET = {
  Debug: 'tilemaps/debug.png',
} as const;
export type KeyOfTileset = keyof typeof TILESET;
export type TypeOfTileset = (typeof TILESET)[KeyOfTileset];

export const SPRITE = {
  Black1px: 'sprites/black_pixel.png',
  White1px: 'sprites/white_pixel.png',
  DebugPlayer: 'sprites/debug_player.png',
  ZButton: 'sprites/z_button.png',
} as const;
export type KeyOfSprite = keyof typeof SPRITE;
export type TypeOfSprite = (typeof SPRITE)[KeyOfSprite];

export const FONT = {
  MonogramWhite: 'fonts/monogram-white.png',
  MonogramBlack: 'fonts/monogram-black.png',
  MonogramXml: 'fonts/monogram.xml',
  SourGummyWhite: 'fonts/sour-gummy-white.png',
  SourGummyBlack: 'fonts/sour-gummy-black.png',
  SourGummyXml: 'fonts/sour-gummy.xml',
} as const;
export type KeyOfFont = keyof typeof FONT;
export type TypeOfFont = (typeof FONT)[KeyOfFont];

export const ANIMATION = {
  DebugPlayer: 'Debug Player',
  ZButton: 'Z Button',
} as const;
export type KeyOfAnimation = keyof typeof ANIMATION;
export type TypeOfAnimation = (typeof ANIMATION)[KeyOfAnimation];

export const COLLISION_TAG = {
  Player: 'player',
  Pushable: 'pushable',
  PushesObjects: 'pushes_objects',
  Slideable: 'slideable',
  SlidesOnObjects: 'slides_on_objects',
} as const;
export type KeyOfCollisionTag = keyof typeof COLLISION_TAG;
export type TypeOfCollisionTag = (typeof COLLISION_TAG)[KeyOfCollisionTag];

export const COLLISION_MASK = {
  Default: 0x1111,
} as const;
export type KeyOfCollisionMask = keyof typeof COLLISION_MASK;
export type TypeOfCollisionMask = (typeof COLLISION_MASK)[KeyOfCollisionMask];

export const GLOBAL_SCALE = 1;

export const FLAG = {
  SkipMainMenu: 'skip_main_menu',
} as const;
export type KeyOfFlag = keyof typeof FLAG;
export type TypeOfFlag = (typeof FLAG)[KeyOfFlag];

export const SOUND = {
  Activate: 'audio/activate.mp3',
  Music: 'audio/music_mainloop.ogg',
} as const;
export type KeyOfSound = keyof typeof SOUND;
export type TypeOfSound = (typeof SOUND)[KeyOfSound];

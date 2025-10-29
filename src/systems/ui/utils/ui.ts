import { sceneKey } from 'systems/ui/constants';
import { UserInterface as UserInterfaceDecorator } from 'systems/ui/decorators/user_interface';
import { UserInterface } from 'systems/ui/scenes/user_interface';

export function ui(scene: Phaser.Scene): UserInterfaceDecorator {
  return new UserInterfaceDecorator(scene.scene.get<UserInterface>(sceneKey));
}

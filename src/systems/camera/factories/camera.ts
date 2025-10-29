import { Camera } from 'systems/camera/decorators/camera';
import { Camera as CameraObject } from 'systems/camera/objects/camera';

export function camera(scene: Phaser.Scene): Camera {
  return new Camera(new CameraObject(scene).addToUpdateList());
}

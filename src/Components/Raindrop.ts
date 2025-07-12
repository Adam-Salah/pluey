import type { Vector2 } from '../interfaces';
import PhysicsObject from './PhysicsObject';

export default class Raindrop extends PhysicsObject {
    private static spriteList: HTMLImageElement[] = [];
    private static gravity: number = 980;

    static {
        Raindrop.spritePath = 'assets/raindrops/';
        let image = new Image();
        image.src = Raindrop.spritePath + 'raindrop-1.png';
        Raindrop.spriteList.push(image);
    }

    constructor(position: Vector2, velocity: Vector2, scale?: Vector2) {
        super(position, velocity, scale);

        // set sprite
        this._sprite = Raindrop.spriteList[0];

        this.initUtilVars();
    }

    public update(dt: number) {
        // update position
        let positionY = this._position.y + this._velocity.y * dt;
        this.position = { x: this._position.x, y: positionY };

        // update velocity
        this._velocity.y += Raindrop.gravity * dt;
    }
}

import type { Vector2 } from '../interfaces';
import WorldObject from './WorldObject';

export default class Ground extends WorldObject {
    protected static sprite: HTMLImageElement;

    static {
        Ground.spritePath = 'assets/';
        let image = new Image();
        image.src = Ground.spritePath + 'ground.png';
        Ground.sprite = image;
    }

    constructor(position: Vector2, scale?: Vector2) {
        super(position, scale);

        // set sprite
        this._sprite = Ground.sprite;
        this.initUtilVars();
    }
}

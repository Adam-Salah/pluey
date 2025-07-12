import type { Vector2 } from '../interfaces';

export default abstract class WorldObject {
    protected static spritePath: string;

    protected _position!: Vector2;
    protected _scale: Vector2 = { x: 1, y: 1 };
    protected _sprite!: HTMLImageElement;
    protected _positionTopLeft!: Vector2;
    protected _size!: Vector2;

    constructor(position: Vector2, scale?: Vector2) {
        // set params
        this._position = position;
        this._scale = scale || this._scale;
    }

    protected initUtilVars() {
        // set util variables
        this._size = { x: this.sprite.width * this._scale.x, y: this.sprite.height * this._scale.y };
        this._positionTopLeft = { x: this._position.x - this.size.x / 2, y: this._position.y - this.size.y / 2 };
    }

    public get position() {
        return this._position;
    }
    
    public get scale() {
        return this._scale;
    }

    public get sprite() {
        return this._sprite;
    }

    public get positionTopLeft() {
        return this._positionTopLeft;
    }
    
    public get size() {
        return this._size;
    }

    protected set position(position: Vector2) {
        this._position = position;
        this._positionTopLeft = { x: this._position.x - this._scale.x / 2, y: this._position.y - this._scale.y / 2 };
    }
}

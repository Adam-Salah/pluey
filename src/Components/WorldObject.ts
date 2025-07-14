import type { Vector2 } from '../interfaces';

export default abstract class WorldObject {
    protected static spritePath: string;

    protected _position!: Vector2;
    protected _sprite!: HTMLImageElement;
    protected _positionTopLeft!: Vector2;
    protected _size!: Vector2;

    constructor(position: Vector2) {
        // set params
        this._position = position;
    }

    public abstract draw(context: CanvasRenderingContext2D): void;

    public abstract resize(newFrameSize: Vector2, oldFrameSize: Vector2): void;

    protected initUtilVars() {
        // set util variables
        this._size = { x: this.sprite.width, y: this.sprite.height };
        this._positionTopLeft = { x: this._position.x - this.size.x / 2, y: this._position.y - this.size.y / 2 };
    }

    public get position() {
        return this._position;
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
        this._positionTopLeft = { x: this._position.x - this._size.x / 2, y: this._position.y - this._size.y / 2 };
    }
}

import type { Vector2 } from "../interfaces";

export default class Raindrop {
    private static spritePath: string = 'assets/raindrops/'
    private static spriteList: HTMLImageElement[] = [];
    private static gravity: number = 980;

    private _position!: Vector2;
    private _scale: Vector2 = { x: 1, y: 1 };
    private _velocity!: Vector2;
    private _sprite!: HTMLImageElement;
    private _positionTopLeft!: Vector2;
    private _size!: Vector2;

    static {
        let image = new Image();
        image.src = Raindrop.spritePath + 'raindrop-1.png';
        Raindrop.spriteList.push(image);
    }

    constructor(position: Vector2, velocity: Vector2, scale?: Vector2) {
        // set params
        this._position = position;
        this._velocity = velocity;
        this._scale = scale || this._scale;

        // set sprite
        this._sprite = Raindrop.spriteList[0];

        // set util variables
        this._size = { x: this.sprite.width * this._scale.x, y: this.sprite.height * this._scale.y };
        this._positionTopLeft = { x: this._position.x - this._scale.x / 2, y: this._position.y - this._scale.y / 2 };
    }

    public update(dt: number) {
        // update position
        let positionY = this._position.y + this._velocity.y * dt;
        this.position = { x: this._position.x, y: positionY };

        // update velocity
        this._velocity.y += Raindrop.gravity * dt;
    }

    public get position() { return this._position }
    public get scale() { return this._scale }
    public get velocity() { return this._velocity }
    public get sprite() { return this._sprite }
    public get positionTopLeft() { return this._positionTopLeft }
    public get size() { return this._size }

    private set position(position: Vector2) {
        this._position = position;
        this._positionTopLeft = { x: this._position.x - this._scale.x / 2, y: this._position.y - this._scale.y / 2 };
    }

}
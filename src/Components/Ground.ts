import type { Vector2 } from '../interfaces';
import WorldObject from './WorldObject';

export default class Ground extends WorldObject {
    protected static sprite: HTMLImageElement;

    private _offset: number;

    static {
        Ground.spritePath = 'assets/';
        let image = new Image();
        image.src = Ground.spritePath + 'ground.png';
        Ground.sprite = image;
    }

    constructor(position: Vector2, size: Vector2, offset: number) {
        super(position);

        this._size = size;
        this._offset = offset;

        // set sprite
        this._sprite = Ground.sprite;
        this.initUtilVars();
    }

    public draw(context: CanvasRenderingContext2D) {
        console.log(this.position.x)
        context.strokeStyle = '#ffffff';
        context.beginPath();
        context.moveTo(0, this.position.y);
        context.lineTo(this._size.x, this.position.y);
        context.stroke();
    }

    public resize(newFrameSize: Vector2, oldFrameSize: Vector2): void {
        this.position = { x: this._position.x, y: newFrameSize.y - this._offset}
        this._size.x = newFrameSize.x
    }
}

import type { Vector2 } from '../interfaces';
import PhysicsObject from './PhysicsObject';
import * as Tone from 'tone';
import type Audible from './Interfaces/Audible';
import { middleCmaj } from '../notes-frequencies';

export default class Raindrop extends PhysicsObject implements Audible {
    private static spriteList: HTMLImageElement[] = [];
    private static gravity: number = 980;
    private static synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;

    private _note: number;

    static {
        // sprite
        Raindrop.spritePath = 'assets/raindrops/';
        let image = new Image();
        image.src = Raindrop.spritePath + 'raindrop-1.png';
        Raindrop.spriteList.push(image);

        // synth
        Raindrop.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    }

    constructor(position: Vector2, velocity: Vector2, note: number) {
        super(position, velocity);

        // set sprite
        this._sprite = Raindrop.spriteList[0];

        // set note ()
        this._note = note;

        this.initUtilVars();
    }

    public update(dt: number) {
        // update position
        let positionY = this._position.y + this._velocity.y * dt;
        this.position = { x: this._position.x, y: positionY };

        // update velocity
        this._velocity.y += Raindrop.gravity * dt;
    }

    public draw(context: CanvasRenderingContext2D) {
        context.drawImage(
            this._sprite,
            Math.floor(this._positionTopLeft.x),
            Math.floor(this._positionTopLeft.y),
            Math.floor(this._size.x),
            Math.floor(this._size.y)
        );
    }

    public resize(newFrameSize: Vector2, oldFrameSize: Vector2): void {
        let resizeRatio = newFrameSize.x / oldFrameSize.x;
        this.position = { x: this._position.x * resizeRatio, y: this._position.y };
    }

    public playSound(): void {
        Raindrop.synth.triggerAttackRelease(middleCmaj[this._note], '16n');
    }
}

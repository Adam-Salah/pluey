import type { Vector2 } from '../interfaces';
import WorldObject from './WorldObject';

export default abstract class PhysicsObject extends WorldObject {
    protected _velocity!: Vector2;

    constructor(position: Vector2, velocity: Vector2, scale?: Vector2) {
        super(position, scale);
        this._velocity = velocity;
    }

    public abstract update(dt: number): void;

    public get velocity() {
        return this._velocity;
    }
}

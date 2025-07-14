import { useEffect, useRef, useState } from 'react';
import './App.css';
import Raindrop from './Components/Raindrop';
import Ground from './Components/Ground';
import { middleCmaj } from './notes-frequencies';
import type { Vector2 } from './interfaces';
import WorldObject from './Components/WorldObject';

const fps = 60;
const raindropCooldownMin = 0.1;
const raindropCooldownMax = 0.3;
const raindropStartVelocityMin = 20;
const raindropStartVelocityMax = 80;

export default function App() {
    // start stop
    const [start, setStart] = useState<boolean>(false);

    // window size
    const frameSize = useRef<Vector2>({ x: 0, y: 0 });
    const previousFrameSize = useRef<Vector2>({ x: 0, y: 0 });

    // raindrops
    const [raindrops] = useState<Raindrop[]>([]);

    // ground
    const ground = useRef<Ground>(null);

    // world objects
    const [everything] = useState<Set<WorldObject[]>>(new Set());

    // canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const frameResize = () => {
        // store previous window size
        previousFrameSize.current = frameSize.current;

        // set window size
        frameSize.current = { x: window.innerWidth, y: window.innerHeight };

        // set canvas size
        canvasRef.current!.width = window.innerWidth;
        canvasRef.current!.height = window.innerHeight;
    };

    // window size handling setup
    const resize = () => {
        frameResize();

        //reposition every object
        everything.forEach((array) => {
            array.forEach((worldObject) => {
                worldObject.resize(frameSize.current, previousFrameSize.current);
            });
        });
    };

    useEffect(() => {
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    // canvas setup
    useEffect(() => {
        frameResize();

        // spawn ground
        ground.current = new Ground({ x: frameSize.current.x / 2, y: frameSize.current.y - 100 }, {x: frameSize.current.x, y: 1}, 100);
        everything.add([ground.current]);

        // render once
        render();
    }, [start]);

    // spawn raindrops on start
    useEffect(() => {
        everything.add(raindrops);

        let timeAtFrame = Date.now();
        function frameOperations() {
            let cooldown = (Math.random() * (raindropCooldownMax - raindropCooldownMin) + raindropCooldownMin) * 1000;
            let dt = (Date.now() - timeAtFrame) / 1000;
            if (dt > cooldown / 1000) {
                let positionX = Math.random() * frameSize.current.x;
                let positionY = Math.min(ground.current!.position.y - 1000, -100);
                let velocityY = Math.random() * (raindropStartVelocityMax - raindropStartVelocityMin) + raindropStartVelocityMin;
                let note = Math.floor((positionX / frameSize.current.x) * middleCmaj.length);
                raindrops.push(new Raindrop({ x: positionX, y: positionY}, { x: 0, y: velocityY }, note));
                timeAtFrame = Date.now();
            }
            requestAnimationFrame(frameOperations);
        }
        if (!start) return;
        requestAnimationFrame(frameOperations);
    }, [start]);

    function logic(dt: number) {
        // update raindrops
        raindrops.forEach((raindrop) => {
            raindrop.update(dt);
        });

        // destroy raindrops
        raindrops.forEach((raindrop, i) => {
            if (raindrop.positionTopLeft.y > ground.current!.positionTopLeft.y) {
                raindrop.playSound();
                raindrops.splice(i, 1);
            }
        });
    }

    function render() {
        // get canvas
        const canvas = canvasRef.current;
        if (!canvas) return;

        // get context
        const context = canvas.getContext('2d');
        if (!context) return;

        // fill background
        context.fillStyle = '#000000';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        // draw ground
        if (ground.current) {
            ground.current.draw(context);
        }

        // draw raindrops
        raindrops.forEach((raindrop) => {
            raindrop.draw(context);
        });
    }

    // call physics and render graphics every frame
    useEffect(() => {
        let timeAtFrame = Date.now();
        function frameOperations() {
            let dt = (Date.now() - timeAtFrame) / 1000;
            if (dt > 1 / fps) {
                logic(dt);
                render();
                timeAtFrame = Date.now();
            }
            requestAnimationFrame(frameOperations);
        }
        if (!start) return;
        requestAnimationFrame(frameOperations);
    }, [start]);

    // return canvas
    return (
        <canvas
            ref={canvasRef}
            className='canvas'
            onClick={() => {
                setStart(true);
            }}
        />
    );
}

import { useEffect, useRef, useState } from 'react';
import './App.css';
import Raindrop from './Components/Raindrop';
import Ground from './Components/Ground';
import * as Tone from 'tone';
import frequencies from './notes-frequencies';

const fps = 60;
const raindropCooldownMin = 0.1;
const raindropCooldownMax = 0.4;

export default function App() {
    // start stop
    const [start, setStart] = useState<boolean>(false);

    // raindrops
    const [raindrops] = useState<Raindrop[]>([]);

    // ground
    const ground = useRef<Ground>(null);

    // canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // synth
    const synthRef = useRef<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>>(new Tone.PolySynth(Tone.Synth).toDestination());

    // on first render
    useEffect(() => {
        // set canvas size
        canvasRef.current!.width = window.innerWidth;
        canvasRef.current!.height = window.innerHeight;

        // render once
        render();

        // spawn ground
        ground.current = new Ground({ x: canvasRef.current!.width / 2, y: canvasRef.current!.height - 100 });

        // spawn raindrops based on cooldown range
        let timeAtFrame = Date.now();
        function frameOperations() {
            let cooldown = (Math.random() * (raindropCooldownMax - raindropCooldownMin) + raindropCooldownMin) * 1000;
            let dt = (Date.now() - timeAtFrame) / 1000;
            if (dt > cooldown / 1000) {
                let positionX = Math.random() * canvasRef!.current!.width;
                let velocityY = Math.random() * (80 - 20) + 20;
                raindrops.push(new Raindrop({ x: positionX, y: -100 }, { x: 0, y: velocityY }, { x: 20, y: 20 }));
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
                let note = Math.round((raindrop.position.x / canvasRef.current!.width) * frequencies.length);
                synthRef.current.triggerAttackRelease(frequencies[note], '8n');
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
            context.drawImage(ground.current.sprite, Math.floor(ground.current.positionTopLeft.x), Math.floor(ground.current.positionTopLeft.y));
        }

        // draw raindrops
        raindrops.forEach((raindrop) => {
            context.drawImage(raindrop.sprite, Math.floor(raindrop.positionTopLeft.x), Math.floor(raindrop.positionTopLeft.y));
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
    return <canvas ref={canvasRef} className='canvas' onClick={() => {setStart(true)}} />;
}

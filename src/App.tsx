import { useEffect, useRef, useState } from 'react'
import './App.css'
import Raindrop from './doohickeys/Raindrop';

const fps = 60;
const raindropCooldownMin = 0.1;
const raindropCooldownMax = 0.4;

export default function App() {
    // delta time tracker
    const timeAtFrame = useRef<number>(0);

    // raindrops
    const [raindrops] = useState<Raindrop[]>([]);

    // reference to canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // animation request id
    const animationRef = useRef<number>(0);

    // on first render
    useEffect(() => {
        // set canvas size
        canvasRef.current!.width = window.innerWidth;
        canvasRef.current!.height = window.innerHeight;

        // spawn raindrops based on cooldown range
        const interval = setInterval(() => {
            let positionX = Math.random() * canvasRef!.current!.width;
            let velocityY = Math.random() * (80 - 20) + 20;
            raindrops.push(new Raindrop({ x: positionX, y: -100 }, { x: 0, y: velocityY }, { x: 20, y: 20 }))
        }, Math.random() * (raindropCooldownMax - raindropCooldownMin) + raindropCooldownMin * 1000);
        return () => clearInterval(interval);
    }, []);

    function logic(dt: number) {
        // update raindrops
        raindrops.forEach(raindrop => {
            raindrop.update(dt);
        });

        // destroy raindrops
        raindrops.forEach((raindrop, i) => {
            if (raindrop.positionTopLeft.y > canvasRef.current!.height) {
                raindrops.splice(i, 1);
            }
        })
    }

    function render() {
        // get canvas
        const canvas = canvasRef.current
        if (!canvas) return;

        // get context
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) return

        // fill background
        context.fillStyle = '#000000'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)

        // draw raindrops
        raindrops.forEach(raindrop => {
            context.drawImage(
                raindrop.sprite,
                Math.floor(raindrop.positionTopLeft.x),
                Math.floor(raindrop.positionTopLeft.y)
            )
        });
    }

    // call physics and render graphics every frame
    useEffect(() => {
        timeAtFrame.current = Date.now();

        function frameOperations() {
            let dt = (Date.now() - timeAtFrame.current) / 1000;
            console.log(dt);
            if (dt > 1 / fps) {
                logic(dt);
                render();
                timeAtFrame.current = Date.now();
            }
            animationRef.current = requestAnimationFrame(frameOperations);
        }
        requestAnimationFrame(frameOperations);
    }, []);

    // return canvas
    return (
        <canvas ref={canvasRef} className='canvas-main' />
    )
}


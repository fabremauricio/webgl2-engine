import {init} from './renderer/renderer';

window.onload = main;

function main() {
    const gl = getContext("canvas");

    if(gl) {
        init(gl);
    } else {
        console.error("Cannot find gl context");
    }
}

function getContext(canvasId: string) : WebGL2RenderingContext | null{
    const canvas: HTMLCanvasElement | null = document.querySelector(`#${canvasId}`);
    
    if(canvas) {
        const gl: WebGL2RenderingContext | null= canvas.getContext("webgl2");
        if(gl) {
            return gl;
        }
    }
    
    return null;
}
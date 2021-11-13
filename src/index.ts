import Scene from "./engine/core/Scene";
import SampleScene from "./engine/SampleScene";

window.onload = main;

function main() {
    const gl = getContext("canvas");

    if(gl) {
        const scene: Scene = new SampleScene();

        scene.init(gl);
        scene.render(gl);
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
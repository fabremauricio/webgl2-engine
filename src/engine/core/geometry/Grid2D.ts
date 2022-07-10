import Geometry from "../Geometry";

export default class Grid2D extends Geometry {
    private vao: WebGLVertexArrayObject | null = null;
    private vertexBuffer: WebGLBuffer | null = null;
    private indexBuffer: WebGLBuffer | null = null;
    private indexCount: number = 0;

    initCallback(gl: WebGL2RenderingContext): void {
        const f = 1.0; // Scale factor
        const c = 10; // Cuts

        // Create in the range of 0-1 then adapt to Normal Cube

        throw new Error("Method not implemented.");
    }
    disposeCallback(gl: WebGL2RenderingContext): void {
        throw new Error("Method not implemented.");
    }
    drawCallback(gl: WebGL2RenderingContext): void {
        throw new Error("Method not implemented.");
    }

}
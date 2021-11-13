export default abstract class Geometry {
    protected gl: WebGL2RenderingContext | null;

    constructor() {
        this.gl = null;
    }

    init(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.initCallback(gl);
    }

    abstract initCallback(gl: WebGL2RenderingContext): void;

    abstract bind(vertexPositionLocation: number) : void;

    abstract vertexOffset(): number;
    abstract vertexCount(): number;
}
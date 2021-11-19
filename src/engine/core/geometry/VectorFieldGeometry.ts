import Geometry from "../Geometry";
import Scene from "../Scene";

export default class VectorFieldGeometry extends Geometry {
  private vertexBuffer: WebGLBuffer | null = null;
  private vertices: Array<[number, number, number]>;
  private vectors: Array<[number, number, number]>;
  private size: number;

  constructor(
    scene: Scene,
    vertices: Array<[number, number, number]>,
    vectors: Array<[number, number, number]>,
    size: number
  ) {
    super(scene);
    this.vectors = vectors;
    this.vertices = vertices;
    this.size = size;
  }

  initCallback(gl: WebGL2RenderingContext): void {
    const data = [];

    for (let i = 0; i < this.vertices.length; i++) {
      const vx = this.vertices[i][0] + this.vectors[i][0] * this.size;
      const vy = this.vertices[i][1] + this.vectors[i][1] * this.size;
      const vz = this.vertices[i][2] + this.vectors[i][2] * this.size;

      data.push(this.vertices[i]);
      data.push([vx, vy, vz]);
    }

    const vertices = new Float32Array(data.flat());
    this.vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  }

  disposeCallback(gl: WebGL2RenderingContext): void {
    gl.deleteBuffer(this.vertexBuffer);
  }

  drawCallback(gl: WebGL2RenderingContext): void {
    const cnt = this.vertices.length * 2 * 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.lineWidth(0.5);
    gl.drawArrays(gl.LINES, 0, cnt);
  }
}

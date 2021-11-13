import Geometry from "./Geometry";

export default class Plane extends Geometry {
  private vertexPosition: WebGLBuffer | null;

  constructor() {
    super();
    this.vertexPosition = null;
  }

  initCallback(gl: WebGL2RenderingContext): void {
    this.vertexPosition = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosition);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0]),
      gl.STATIC_DRAW
    );
  }

  bind(gl: WebGL2RenderingContext, vertexPositionLocation: number): void {
    gl.bindBuffer(vertexPositionLocation, this.vertexPosition);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionLocation);
  }

  drawCallback(gl: WebGL2RenderingContext): void {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

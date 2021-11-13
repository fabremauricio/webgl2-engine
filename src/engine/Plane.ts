import Geometry from "./core/Geometry";
import Scene from "./core/Scene";

export default class Plane extends Geometry {
  private vertexPosition: WebGLBuffer | null;

  constructor(scene: Scene) {
    super(scene);
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

  disposeCallback(gl: WebGL2RenderingContext): void {
    // Remove the data
  }
  
  drawCallback(gl: WebGL2RenderingContext): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosition);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

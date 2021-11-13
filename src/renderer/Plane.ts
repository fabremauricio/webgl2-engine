import Geometry from "./Geometry";

export default class Plane extends Geometry {
  private position: WebGLBuffer | null;

  constructor() {
    super();
    this.position = null;
  }

  initCallback(gl: WebGL2RenderingContext): void {
    this.position = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0]),
      gl.STATIC_DRAW
    );
  }

  bind(vertexPositionLocation: number): void {
    this.gl?.bindBuffer(vertexPositionLocation, this.position);
    this.gl?.vertexAttribPointer(
      vertexPositionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl?.enableVertexAttribArray(vertexPositionLocation);
  }

  vertexCount(): number {
    return 4;
  }
  
  vertexOffset(): number {
    return 0;
  }
}

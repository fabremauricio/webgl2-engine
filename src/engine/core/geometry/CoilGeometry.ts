import Geometry from "../Geometry";

export default class CoilGeometry extends Geometry {
  private vao: WebGLVertexArrayObject | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;

  private indexCount: number = 0;
  private verticesCount: number = 0;

  initCallback(gl: WebGL2RenderingContext): void {
    const poloidalCuts = 24;
    const toroidalCuts = 32;
    const poloidalRadius = 0.06;
    const toroidalRadius = 0.2;
    const loops = 40;

    // Create the geometry
    const poloidalGeom = new Array(poloidalCuts * 2);
    const ringGeom = new Array(poloidalCuts * toroidalCuts * 3); // x y z

    const vertices = new Array(poloidalCuts * toroidalCuts * loops * 4); // x y z l)
    const indices = new Array(3 * poloidalCuts * 2 * (toroidalCuts - 1));

    let i = 0;
    let j = 0;

    for (let p = 0; p < poloidalCuts; p++) {
      const angle = (2 * Math.PI * p) / poloidalCuts;
      poloidalGeom[i++] = poloidalRadius * Math.cos(angle); // x value
      poloidalGeom[i++] = poloidalRadius * Math.sin(angle); // y value
    }

    i = 0;
    for (let t = 0; t < toroidalCuts; t++) {
      const angle = (2 * Math.PI * t) / toroidalCuts;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      for (let p = 0; p < poloidalCuts; p++) {
        ringGeom[i++] = cos * (poloidalGeom[p * 2 + 0] + toroidalRadius); // x
        ringGeom[i++] = poloidalGeom[p * 2 + 1]; // y
        ringGeom[i++] = sin * (poloidalGeom[p * 2 + 0] + toroidalRadius); // z
      }
    }

    i = 0;
    for (let l = 0; l < loops; l++) {
      // This might be removable later
      j = 0;
      for (let t = 0; t < toroidalCuts; t++) {
        // This might be removable later
        const y = 0;
        //l * poloidalRadius * 3 + (poloidalRadius * 3 * t) / toroidalCuts;
        for (let p = 0; p < poloidalCuts; p++) {
          vertices[i++] = ringGeom[j++]; // x
          vertices[i++] = ringGeom[j++] + y; // y
          vertices[i++] = ringGeom[j++]; // z
          vertices[i++] = (l * toroidalCuts + t) / (loops * toroidalCuts); // For the shader
        }
      }
    }

    i = 0;
    for (let e = 0; e < toroidalCuts * loops - 1; e++) {
      for (let p = 0; p < poloidalCuts; p++) {
        const a0 = e * poloidalCuts + (p % poloidalCuts);
        const a1 = e * poloidalCuts + ((p + 1) % poloidalCuts);
        const b0 = poloidalCuts + a0;
        const b1 = poloidalCuts + a1;

        indices[i++] = a0;
        indices[i++] = b0;
        indices[i++] = b1;

        indices[i++] = a0;
        indices[i++] = b1;
        indices[i++] = a1;
      }
    }

    const verticesData = new Float32Array(vertices);
    const indicesData = new Uint16Array(indices);

    this.indexBuffer = gl.createBuffer();
    this.vertexBuffer = gl.createBuffer();
    this.vao = gl.createVertexArray();

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesData, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesData, gl.STATIC_DRAW);

    const stride = 4 * (3 + 1);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0); // Pos
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, stride, 4 * 3); // Polodial Index

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.indexCount = indices.length;
    this.verticesCount = vertices.length / 4;
  }

  disposeCallback(gl: WebGL2RenderingContext): void {
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.indexBuffer);
    gl.deleteBuffer(this.vertexBuffer);
  }

  drawCallback(gl: WebGL2RenderingContext): void {
    gl.bindVertexArray(this.vao);
    //gl.drawArrays(gl.POINTS, 0, this.verticesCount);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}

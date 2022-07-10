import BasicShaderProgram from "../../shaders/basic/BasicShaderProgram";
import Geometry from "../Geometry";
import Scene from "../Scene";
import VectorFieldGeometry from "./VectorFieldGeometry";

export default class VAOGeometry extends Geometry {
  public vertices: Array<[number, number, number]> = [];
  public normals: Array<[number, number, number]> = [];
  public tangents: Array<[number, number, number]> = [];
  public textures: Array<[number, number]> = [];
  public indices: Array<[number, number, number]> = [];

  private vao: WebGLVertexArrayObject | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;

  private indexCount: number = 0;

  protected setup(
    vertices: Array<[number, number, number]>,
    normals: Array<[number, number, number]>,
    textures: Array<[number, number]>,
    indices: Array<[number, number, number]>
  ) {
    this.vertices = vertices;
    this.normals = normals;
    this.textures = textures;
    this.indices = indices;

    this.computeTangents();
  }

  private computeTangents() {
    this.tangents = this.normals.map((e) => [0, 0, 0]);
    // Iterate over the vertices
    for (let i = 0; i < this.indices.length; i++) {
      const [ia, ib, ic] = this.indices[i];

      this.computeTangentFor(ia, ib, ic);
      this.computeTangentFor(ib, ic, ia);
      this.computeTangentFor(ic, ia, ib);
    }

    // Normalize
    for (let i = 0; i < this.tangents.length; i++) {
      const [tx, ty, tz] = this.tangents[i];
      const mod = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
      this.tangents[i][0] = tx / mod;
      this.tangents[i][1] = ty / mod;
      this.tangents[i][2] = tz / mod;
    }

    console.log(this.tangents);
  }

  /**
   * Ponderates the tanget for ia th vertex with the ib th,ic th adjacents
   * @param ia index a
   * @param ib index b
   * @param ic index c
   */
  private computeTangentFor(ia: number, ib: number, ic: number) {
    const v0 = this.vertices[ia];
    const v1 = this.vertices[ib];
    const v2 = this.vertices[ic];

    const t0 = this.textures[ia];
    const t1 = this.textures[ib];
    const t2 = this.textures[ic];

    // Edges Positions
    const dax = v1[0] - v0[0];
    const day = v1[1] - v0[1];
    const daz = v1[2] - v0[2];

    const dbx = v2[0] - v0[0];
    const dby = v2[1] - v0[1];
    const dbz = v2[2] - v0[2];
    // Edges UV
    const tax = t1[0] - t0[0];
    const tay = t1[1] - t0[1];

    const tbx = t2[0] - t0[0];
    const tby = t2[1] - t0[1];

    const r = 1 / (tax * tby - tay * tbx);

    const tx = r * (dax * tby - dbx * tay);
    const ty = r * (day * tby - dby * tay);
    const tz = r * (daz * tby - dbz * tay);

    const [ox, oy, oz] = this.tangents[ia];

    this.tangents[ia][0] = tx + ox;
    this.tangents[ia][1] = ty + oy;
    this.tangents[ia][2] = tz + oz;
  }

  initCallback(gl: WebGL2RenderingContext): void {
    const array = [];

    for (let i = 0; i < this.vertices.length; i++) {
      array.push(this.vertices[i]);
      array.push(this.normals[i]);
      array.push(this.textures[i]);
      array.push(this.tangents[i]);
    }

    const indices = new Uint16Array(this.indices.flat());
    const vertices = new Float32Array(array.flat());

    this.indexBuffer = gl.createBuffer();
    this.vertexBuffer = gl.createBuffer();
    this.vao = gl.createVertexArray();

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const sizePosition = this.vertices.length ? 3 : 0;
    const sizeNormal = this.normals.length ? 3 : 0;
    const sizeUV = this.textures.length ? 2 : 0;
    const sizeTangent = this.tangents.length ? 3 : 0;

    const stride = 4 * (sizePosition + sizeNormal + sizeUV + sizeTangent);
    const offsetPosition = 4 * 0;
    const offsetNormal = 4 * sizePosition;
    const offsetUV = 4 * (sizePosition + sizeNormal);
    const offsetTangent = 4 * (sizePosition + sizeNormal + sizeUV);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, offsetPosition);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, offsetNormal);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, offsetUV);
    gl.vertexAttribPointer(3, 3, gl.FLOAT, false, stride, offsetTangent);

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.indexCount = this.indices.length * 3;
  }

  disposeCallback(gl: WebGL2RenderingContext): void {
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.indexBuffer);
    gl.deleteBuffer(this.vertexBuffer);
  }

  drawCallback(gl: WebGL2RenderingContext): void {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}

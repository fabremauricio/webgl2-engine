import Geometry from "../Geometry";
import Scene from "../Scene";

export default class VAOGeometry extends Geometry {
  private vertices: Array<[number, number, number]> = [];
  private normals: Array<[number, number, number]> = [];
  private textures: Array<[number, number]> = [];
  private indices: Array<[number, number, number]> = [];

  private vao: WebGLVertexArrayObject | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;

  private indexCount: number = 0;

  constructor(scene: Scene) {
    super(scene);
  }

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
  }

  initCallback(gl: WebGL2RenderingContext): void {
    const array = [];

    for (let i = 0; i < this.vertices.length; i++) {
      array.push(this.vertices[i]);
      array.push(this.normals[i]);
      array.push(this.textures[i]);
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

    const stride = 4 * (sizePosition + sizeNormal + sizeUV);
    const offsetPosition = 4 * 0;
    const offsetNormal = 4 * sizePosition;
    const offsetUV = 4 * (sizePosition + sizeNormal);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, offsetPosition);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, offsetNormal);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, offsetUV);

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);

    gl.bindVertexArray(null);

    this.indexCount = this.indices.length * 3;

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.textures = [];
  }

  disposeCallback(gl: WebGL2RenderingContext): void {
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.indexBuffer);
    gl.deleteBuffer(this.vertexBuffer);
  }

  drawCallback(gl: WebGL2RenderingContext): void {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}

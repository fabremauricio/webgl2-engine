import Geometry from "../Geometry";
import Scene from "../Scene";

export default class OBJGeometry extends Geometry {
  private vertices: Array<[number, number, number]> = [];
  private normals: Array<[number, number, number]> = [];
  private textures: Array<[number, number]> = [];
  private indices: Array<[number, number, number]> = [];

  private vertexBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;

  private indexCount: number = 0;

  constructor(scene: Scene, source: string) {
    super(scene);

    const faces: Array<[string, string, string]> = [];

    source
      .split("\n")
      .map((e) => e.trim())
      .forEach((line) => {
        const [letter, ...rest] = line.split(" ");

        if (letter === "v") {
          const data = rest.map((e) => parseFloat(e));
          this.vertices.push(data as [number, number, number]);
        } else if (letter === "vt") {
          const data = rest.map((e) => parseFloat(e));
          this.textures.push(data as [number, number]);
        } else if (letter === "vn") {
          const data = rest.map((e) => parseFloat(e));
          this.normals.push(data as [number, number, number]);
        } else if (letter === "f") {
          faces.push(rest as [string, string, string]);
        }
      });

    const newNormals: Array<[number, number, number]> = this.vertices.map(
      () => [0, 0, 0]
    );
    const newTextures: Array<[number, number]> = this.vertices.map(() => [
      0, 0,
    ]);

    faces.forEach((f) => {
      const index = [];

      for (let i = 0; i < 3; i++) {
        const [vi, ti, ni]: [number, number, number] = !f[i].includes("/")
          ? [parseFloat(f[i]), 0, 0]
          : (f[i].split("/").map((e) => (e === "" ? -1 : parseInt(e))) as [
              number,
              number,
              number
            ]);

        if (ti !== -1) {
          newTextures[vi - 1] = this.textures[ti - 1];
        }

        if (ni !== -1) {
          newNormals[vi - 1] = this.normals[ni - 1];
        }

        index.push(vi-1);
      }
      this.indices.push(index as [number, number, number]);
    });

    
    this.textures = newTextures;
    this.normals = newNormals;
    
    this.indexCount = this.indices.length * 3;
  }

  initCallback(gl: WebGL2RenderingContext): void {
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    /// Pack everything

    const array = [];

    for(let i =0; i < this.vertices.length; i++) {
      array.push(this.vertices[i]);
      array.push(this.normals[i]);
      array.push(this.textures[i]);
    }

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(array.flat()),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.indices.flat()),
      gl.STATIC_DRAW
    );
  }

  disposeCallback(gl: WebGL2RenderingContext): void {}

  drawCallback(gl: WebGL2RenderingContext): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    const stride = 4 * (3 + 3 + 2);
    const offsetPosition = 4 * 0;
    const offsetNormal = 4* 3;
    const offsetUV = 4 * 6;

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, offsetPosition);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, offsetNormal);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, offsetUV);

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);

    gl.drawElements(gl.TRIANGLES, this.indices.flat().length, gl.UNSIGNED_SHORT, 0);
  }
}

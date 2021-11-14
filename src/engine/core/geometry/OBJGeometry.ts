import Scene from "../Scene";
import VAOGeometry from "./VAOGeometry";

export default class OBJGeometry extends VAOGeometry {
  constructor(scene: Scene, source: string) {
    super(scene);

    const vertices: Array<[number, number, number]> = [];
    const normals: Array<[number, number, number]> = [];
    const textures: Array<[number, number]> = [];
    const faces: Array<[string, string, string]> = [];

    const _st = performance.now();

    source
      .split("\n")
      .map((e) => e.trim())
      .forEach((line) => {
        const [letter, ...rest] = line.split(" ");

        if (letter === "v") {
          const data = rest.map((e) => parseFloat(e));
          vertices.push(data as [number, number, number]);
        } else if (letter === "vt") {
          const data = rest.map((e,i) => i==1? 1 - parseFloat(e) : parseFloat(e));
          textures.push(data as [number, number]);
        } else if (letter === "vn") {
          const data = rest.map((e) => parseFloat(e));
          normals.push(data as [number, number, number]);
        } else if (letter === "f") {
          faces.push(rest as [string, string, string]);
        }
      });

    const newVertices: Array<[number,number,number]> = [];
    const newNormals: Array<[number, number, number]> = [];
    const newTextures: Array<[number, number]> = [];

    const indices: Array<[number, number, number]> = [];
    const hash: Map<string,number> = new Map<string,number>();
    
    let cnt = 0;
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
        
        const key = `${vi}_${ti}_${ni}`;

        if(!hash.has(key)) {
          hash.set(key, cnt);
          newVertices.push(vertices[vi-1])
          newNormals.push(normals[ni-1]|| [0,0,0]);
          newTextures.push(textures[ti-1]||[0,0]);
          index.push(cnt);
          cnt++;
        } else {
          const existing = hash.get(key);
          index.push(existing);
        }
      }
      indices.push(index as [number, number, number]);
    });

    this.setup(newVertices, newNormals, newTextures, indices);

    const _et = performance.now();

    console.info('Performance: ', _et-_st);
  }
}

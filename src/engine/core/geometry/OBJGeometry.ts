import Scene from "../Scene";
import VAOGeometry from "./VAOGeometry";

export default class OBJGeometry extends VAOGeometry {
  constructor(scene: Scene, source: string) {
    super(scene);

    const vertices: Array<[number, number, number]> = [];
    const normals: Array<[number, number, number]> = [];
    const textures: Array<[number, number]> = [];
    const indices: Array<[number, number, number]> = [];
    const faces: Array<[string, string, string]> = [];

    source
      .split("\n")
      .map((e) => e.trim())
      .forEach((line) => {
        const [letter, ...rest] = line.split(" ");

        if (letter === "v") {
          const data = rest.map((e) => parseFloat(e));
          vertices.push(data as [number, number, number]);
        } else if (letter === "vt") {
          const data = rest.map((e) => parseFloat(e));
          textures.push(data as [number, number]);
        } else if (letter === "vn") {
          const data = rest.map((e) => parseFloat(e));
          normals.push(data as [number, number, number]);
        } else if (letter === "f") {
          faces.push(rest as [string, string, string]);
        }
      });

    const newNormals: Array<[number, number, number]> = vertices.map(() => [
      0, 0, 0,
    ]);
    const newTextures: Array<[number, number]> = vertices.map(() => [0, 0]);

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
          newTextures[vi - 1] = textures[ti - 1];
        }

        if (ni !== -1) {
          newNormals[vi - 1] = normals[ni - 1];
        }

        index.push(vi - 1);
      }
      indices.push(index as [number, number, number]);
    });

    this.setup(vertices, newNormals, newTextures, indices);
  }
}

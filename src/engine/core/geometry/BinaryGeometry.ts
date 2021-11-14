import Scene from "../Scene";
import VAOGeometry from "./VAOGeometry";

export default class BinaryGeometry extends VAOGeometry {
  constructor(scene: Scene, data: string) {
    super(scene);

    const bytes = atob(data.split(',')[1]);
    const buffer = new ArrayBuffer(bytes.length);
    const view = new Uint8Array(buffer);

    for (var i = 0; i < bytes.length; i++) {
      view[i] = bytes.charCodeAt(i);
    }

    const intView = new Int32Array(buffer);
    const floatView = new Float32Array(buffer);
    let pos = 0;
  
    const verticesLenght = intView[pos++];
    const indicesLenght = intView[pos++];

    console.log(verticesLenght);
  
    const vertices: Array<[number,number,number]> = [];
    const normals: Array<[number,number,number]> = [];
    const textures: Array<[number,number]> = [];
    const indices: Array<[number,number,number]> = [];
  
    for (let i = 0; i < verticesLenght; i++) {
      vertices.push([floatView[pos++], floatView[pos++], floatView[pos++]]);
    }
  
    for (let i = 0; i < verticesLenght; i++) {
      normals.push([floatView[pos++], floatView[pos++], floatView[pos++]]);
    }
  
    for (let i = 0; i < verticesLenght; i++) {
      textures.push([floatView[pos++], floatView[pos++]]);
    }
  
    for (let i = 0; i < indicesLenght; i++) {
      indices.push([intView[pos++], intView[pos++], intView[pos++]]);
    }
    this.setup(vertices, normals, textures, indices);
  }
}

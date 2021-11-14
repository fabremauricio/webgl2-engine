function objToBinary(source) {
  const vertices = [];
  const normals = [];
  const textures = [];
  const faces = [];

  source
    .split("\n")
    .map((e) => e.trim())
    .forEach((line) => {
      const [letter, ...rest] = line.split(" ");

      if (letter === "v") {
        const data = rest.map((e) => parseFloat(e));
        vertices.push(data);
      } else if (letter === "vt") {
        // Invert Y coordinate
        const data = rest.map((e, i) =>
          i == 1 ? 1 - parseFloat(e) : parseFloat(e)
        );
        textures.push(data);
      } else if (letter === "vn") {
        const data = rest.map((e) => parseFloat(e));
        normals.push(data);
      } else if (letter === "f") {
        faces.push(rest);
      }
    });

  let newVertices = [];
  let newNormals = [];
  let newTextures = [];
  let indices = [];

  const hash = new Map();

  // We have to "cut" the model into independent triangles if uv or normals are splited
  let cnt = 0;
  faces.forEach((f) => {
    const index = [];

    for (let i = 0; i < 3; i++) {
      const [vi, ti, ni] = !f[i].includes("/")
        ? [parseFloat(f[i]), 0, 0]
        : f[i].split("/").map((e) => (e === "" ? -1 : parseInt(e)));

      const key = `${vi}_${ti}_${ni}`;

      if (!hash.has(key)) {
        hash.set(key, cnt);
        newVertices.push(vertices[vi - 1]);
        newNormals.push(normals[ni - 1] || [0, 0, 0]);
        newTextures.push(textures[ti - 1] || [0, 0]);
        index.push(cnt);
        cnt++;
      } else {
        const existing = hash.get(key);
        index.push(existing);
      }
    }
    indices.push(index);
  });

  newVertices = newVertices.flat();
  newNormals = newNormals.flat();
  newTextures = newTextures.flat();
  indices = indices.flat();
  // How much memory we need 32bits per array entry
  const total =
    4 *
    (newVertices.length +
      newNormals.length +
      newTextures.length +
      indices.length +
      1 + // vertices length
      1); // indices lenght

  const buffer = new ArrayBuffer(total);

  const intView = new Int32Array(buffer);
  const floatView = new Float32Array(buffer);

  let pos = 0;

  intView[pos++] = newVertices.length / 3; // pos 0
  intView[pos++] = indices.length / 3; // pos 1

  for (let i = 0; i < newVertices.length; i++) {
    floatView[pos++] = newVertices[i];
  }

  for (let i = 0; i < newNormals.length; i++) {
    floatView[pos++] = newNormals[i];
  }

  for (let i = 0; i < newTextures.length; i++) {
    floatView[pos++] = newTextures[i];
  }

  for (let i = 0; i < indices.length; i++) {
    intView[pos++] = indices[i];
  }

  console.log(newVertices.length / 3, indices.length / 3);

  return buffer;
}

var fs = require("fs");
var stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
const input = stdinBuffer.toString();


const res = objToBinary(input);
fs.writeFile("output.bin", Buffer.from(res), "binary", (e) =>
   e ? console.error(e) : console.log("Saved")
 );

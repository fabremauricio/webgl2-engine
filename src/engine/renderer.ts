import BasicShaderProgram from "./BasicShaderProgram";
import Plane from "./Plane";
import { mat4 } from "gl-matrix";

export function init(gl: WebGL2RenderingContext) {
  const basic = new BasicShaderProgram();
  const plane = new Plane();

  const projection = mat4.create();
  const modelView = mat4.create();

  const vec3: [number,number,number] = [0.0, 0.0, -4.0];
  mat4.translate(modelView, modelView, vec3);
  mat4.perspective(
    projection,
    (45 * Math.PI) / 180,
    gl.canvas.clientWidth / gl.canvas.clientHeight,
    0.1,
    100.0
  );

  basic.init(gl);
  plane.init(gl);

  gl.clearColor(1.0, 0.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  basic.render(
    gl,
    plane,
    new Float32Array(modelView),
    new Float32Array(projection)
  );
}

import { mat4 } from "gl-matrix";
import Scene from "./core/Scene";
import Plane from "./Plane";
import BasicShaderProgram from "./shaders/basic/BasicShaderProgram";

export default class SampleScene extends Scene {
  private plane: Plane;
  private shader: BasicShaderProgram;

  constructor() {
    super();

    this.plane = new Plane(this);
    this.shader = new BasicShaderProgram(this);
  }

  render(gl: WebGL2RenderingContext): void {
    const projection = mat4.create();
    const modelView = mat4.create();

    const vec3: [number, number, number] = [0.0, 0.0, -4.0];
    mat4.translate(modelView, modelView, vec3);
    mat4.perspective(
      projection,
      (45 * Math.PI) / 180,
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      0.1,
      100.0
    );

    gl.clearColor(1.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.shader.run(
      gl,
      this.plane,
      new Float32Array(modelView),
      new Float32Array(projection)
    );
  }
}

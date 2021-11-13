import PerspectiveCamera from "./core/camera/PerspectiveCamera";
import OBJGeometry from "./core/geometry/OBJGeometry";
import Scene from "./core/Scene";

import suzanneSource from '../engine/models/suzanne.obj';
import NormalsColorsProgram from "./shaders/normals-colors/NormalsColorsProgram";

export default class SampleScene extends Scene {
  private shader: NormalsColorsProgram;
  private camera: PerspectiveCamera;
  private suzanne: OBJGeometry;

  constructor() {
    super();

    this.shader = new NormalsColorsProgram(this);
    this.camera = new PerspectiveCamera();

    this.suzanne = new OBJGeometry(this,suzanneSource);
  }

  render(gl: WebGL2RenderingContext): void {
    this.camera.update(gl.canvas.clientWidth, gl.canvas.clientHeight);

    gl.clearColor(1.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    this.shader.run(
      gl,
      this.suzanne,
      this.camera.viewMatrix(),
      this.camera.projectionMatrix()
    );
  }
}

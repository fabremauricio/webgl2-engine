import PerspectiveCamera from "./core/camera/PerspectiveCamera";
import OBJGeometry from "./core/geometry/OBJGeometry";
import Scene from "./core/Scene";

import suzanneSource from "../engine/models/suzanne.obj";
import NormalsColorsProgram from "./shaders/normals-colors/NormalsColorsProgram";
import OrbitControls from "./core/utils/OrbitControls";

export default class SampleScene extends Scene {
  private shader: NormalsColorsProgram;
  private camera: PerspectiveCamera;
  private orbit: OrbitControls;
  private suzanne: OBJGeometry;

  constructor() {
    super();

    this.shader = new NormalsColorsProgram(this);
    this.camera = new PerspectiveCamera();

    this.suzanne = new OBJGeometry(this, suzanneSource);
    this.orbit = new OrbitControls(this, this.camera);
  }

  initCallback(gl: WebGL2RenderingContext): void {}

  disposeCallback(gl: WebGL2RenderingContext): void {}

  render(gl: WebGL2RenderingContext): void {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.camera.resize(gl.canvas.clientWidth, gl.canvas.clientHeight);

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

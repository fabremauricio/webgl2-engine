import PerspectiveCamera from "./core/camera/PerspectiveCamera";
import Scene from "./core/Scene";

import OrbitControls from "./core/utils/OrbitControls";

import CoilShaderProgram from "./shaders/coil/CoildShaderProgram";
import CoilGeometry from "./core/geometry/CoilGeometry";
import { RigidBody } from "./core/RigidBody";

export default class CoildScene extends Scene {
  private basicShader: CoilShaderProgram;
  private camera: PerspectiveCamera;

  private coil: CoilGeometry;
  private object: RigidBody;

  constructor() {
    super();

    this.basicShader = new CoilShaderProgram(this);
    this.camera = new PerspectiveCamera();
    this.coil = new CoilGeometry(this);
    this.object = new RigidBody();

    new OrbitControls(this, this.camera);
  }

  initCallback(gl: WebGL2RenderingContext): void {}

  disposeCallback(gl: WebGL2RenderingContext): void {}

  render(gl: WebGL2RenderingContext): void {
    this.camera.resize(gl.canvas.clientWidth, gl.canvas.clientHeight);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    this.basicShader.run(
      gl,
      this.coil,
      this.camera.modelViewMatrix(this.object.modelMatrix()),
      this.camera.projectionMatrix(),
      [0, 1, 0, 1]
    );
  }
}

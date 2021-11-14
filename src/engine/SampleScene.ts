import PerspectiveCamera from "./core/camera/PerspectiveCamera";
import OBJGeometry from "./core/geometry/OBJGeometry";
import Scene from "./core/Scene";

import suzanneSource from "../engine/models/cube.obj";
import NormalsColorsProgram from "./shaders/normals-colors/NormalsColorsProgram";
import OrbitControls from "./core/utils/OrbitControls";
import TextureProgram from "./shaders/texture/TextureProgram";
import ImageTexture from "./core/ImageTexture";

import img from './assets/checker.png';

export default class SampleScene extends Scene {
  private shader: TextureProgram;
  private camera: PerspectiveCamera;
  private suzanne: OBJGeometry;
  private texture: ImageTexture;

  constructor() {
    super();

    this.shader = new TextureProgram(this);
    this.camera = new PerspectiveCamera();

    this.suzanne = new OBJGeometry(this, suzanneSource);

    console.log(img);
    this.texture = new ImageTexture(this, img);

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

    this.shader.run(
      gl,
      this.suzanne,
      this.texture,
      this.camera.viewMatrix(),
      this.camera.projectionMatrix(),
      [Math.abs(Math.sin(Date.now() /1000)),1.0,1.0,1.0],
    );
  }
}

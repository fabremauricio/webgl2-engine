import PerspectiveCamera from "./core/camera/PerspectiveCamera";
import OBJGeometry from "./core/geometry/OBJGeometry";
import Scene from "./core/Scene";

import suzanneSource from "../engine/models/output.bin";
import NormalsColorsProgram from "./shaders/normals-colors/NormalsColorsProgram";
import OrbitControls from "./core/utils/OrbitControls";
import TextureProgram from "./shaders/texture/TextureProgram";
import ImageTexture from "./core/ImageTexture";

import img from "./assets/checker.png";
import BinaryGeometry from "./core/geometry/BinaryGeometry";
import SphericalEnvironmentProgram from "./shaders/shperical-environment/SphericalEnvironmentProgram";
import { mat4 } from "gl-matrix";
import { RigidBody } from "./core/RigidBody";
import BasicShaderProgram from "./shaders/basic/BasicShaderProgram";
import VAOGeometry from "./core/geometry/VAOGeometry";
import VectorFieldGeometry from "./core/geometry/VectorFieldGeometry";

export default class SampleScene extends Scene {
  private shader: SphericalEnvironmentProgram;
  private textureShader: TextureProgram;
  private basicShader: BasicShaderProgram;
  private camera: PerspectiveCamera;
  private suzanne: VAOGeometry;
  private normalsField: VectorFieldGeometry;
  private tangentsField: VectorFieldGeometry;
  private texture: ImageTexture;

  private rb1: RigidBody;
  private rb2: RigidBody;

  constructor() {
    super();

    this.shader = new SphericalEnvironmentProgram(this);

    this.basicShader = new BasicShaderProgram(this);
    this.camera = new PerspectiveCamera();

    this.suzanne = new BinaryGeometry(this, suzanneSource);
    this.normalsField = new VectorFieldGeometry(
      this,
      this.suzanne.vertices,
      this.suzanne.normals,
      0.05
    );
    this.tangentsField = new VectorFieldGeometry(
      this,
      this.suzanne.vertices,
      this.suzanne.tangents,
      0.05
    );
    this.texture = new ImageTexture(this, img);

    this.textureShader = new TextureProgram(this);
    this.rb1 = new RigidBody();
    this.rb2 = new RigidBody();

    this.rb2.x = 1;

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
      this.camera.modelViewMatrix(this.rb1.modelMatrix()),
      this.camera.projectionMatrix(),
      this.camera.normalMatrix(this.rb1.modelMatrix())
    );

    this.shader.run(
      gl,
      this.suzanne,
      this.texture,
      this.camera.modelViewMatrix(this.rb2.modelMatrix()),
      this.camera.projectionMatrix(),
      this.camera.normalMatrix(this.rb2.modelMatrix())
    );

    // this.textureShader.run(
    //   gl,
    //   this.suzanne,
    //   this.texture,
    //   this.camera.modelViewMatrix(this.rb2.modelMatrix()),
    //   this.camera.projectionMatrix()
    // );

    this.basicShader.run(
      gl,
      this.normalsField,
      this.camera.modelViewMatrix(this.rb2.modelMatrix()),
      this.camera.projectionMatrix(),
      [0, 0, 1, 1]
    );

    this.basicShader.run(
      gl,
      this.tangentsField,
      this.camera.modelViewMatrix(this.rb2.modelMatrix()),
      this.camera.projectionMatrix(),
      [1, 0, 0, 1]
    );

    this.rb2.ry += 0.01;
  }
}

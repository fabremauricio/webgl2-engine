import vertexSource from "./vertex.glsl";
import fragmentSource from "./fragment.glsl";

import Scene from "../../core/Scene";
import Geometry from "../../core/Geometry";
import ShaderProgram from "../../core/ShaderProgram";
import ImageTexture from "../../core/ImageTexture";

export default class SphericalEnvironmentProgram extends ShaderProgram {
  private projectionMatrix: WebGLUniformLocation | null = null;
  private modelViewMatrix: WebGLUniformLocation | null = null;
  private normalMatrix: WebGLUniformLocation | null = null;

  constructor(scene: Scene) {
    super(scene, vertexSource, fragmentSource);
  }

  initCallback(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    this.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
    this.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    this.normalMatrix = gl.getUniformLocation(program, "normalMatrix");
  }

  disposeCallback(gl: WebGLRenderingContext, program: WebGLProgram): void {}

  run(
    gl: WebGL2RenderingContext,
    geometry: Geometry,
    texture: ImageTexture,
    modelViewMatrix: Float32Array,
    projectionMatrix: Float32Array,
    normalMatrix: Float32Array
  ) {
    gl.useProgram(this.program);

    gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(this.modelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix3fv(this.normalMatrix, false, normalMatrix);

    texture.bind(gl);
    geometry.draw(gl);
  }
}

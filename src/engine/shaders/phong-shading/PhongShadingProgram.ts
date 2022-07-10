import ShaderProgram from "../../core/ShaderProgram";

import vertexSource from "./vertex.glsl";
import fragmentSource from "./fragment.glsl";
import Scene from "../../core/Scene";
import Geometry from "../../core/Geometry";

export default class PhongShadingProgram extends ShaderProgram {
  private projectionMatrix: WebGLUniformLocation | null = null;
  private modelViewMatrix: WebGLUniformLocation | null = null;
  private normalMatrix: WebGLUniformLocation | null = null;

  constructor(scene: Scene) {
    super(scene, vertexSource, fragmentSource);
  }

  initCallback(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    throw new Error("Method not implemented.");
  }

  disposeCallback(gl: WebGLRenderingContext, program: WebGLProgram): void {
    throw new Error("Method not implemented.");
  }

  run(
    gl: WebGL2RenderingContext,
    geometry: Geometry,
    modelViewMatrix: Float32Array,
    projectionMatrix: Float32Array,
    normalMatrix: Float32Array
  ) {
    gl.useProgram(this.program);

    gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(this.modelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix3fv(this.normalMatrix, false, normalMatrix);

    geometry.draw(gl);
  }
}

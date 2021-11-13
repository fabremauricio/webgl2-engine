
import vertexSource from "./vertex.glsl";
import fragmentSource from "./fragment.glsl";

import Scene from "../../core/Scene";
import Geometry from "../../core/Geometry";
import ShaderProgram from "../../core/ShaderProgram";

export default class NormalsColorsProgram extends ShaderProgram {
  private projectionMatrix: WebGLUniformLocation | null = null;
  private modelViewMatrix: WebGLUniformLocation | null = null;

  constructor(scene: Scene) {
    super(scene,vertexSource, fragmentSource);
  }

  initCallback(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    this.projectionMatrix = gl.getUniformLocation(program, 'projection');
    this.modelViewMatrix = gl.getUniformLocation(program, 'modelView');
  }

  disposeCallback(gl: WebGLRenderingContext, program: WebGLProgram): void {}

  run(
    gl: WebGL2RenderingContext,
    geometry: Geometry,
    modelView: Float32Array,
    projection: Float32Array
  ) {
    gl.useProgram(this.program);
    
    gl.uniformMatrix4fv(this.projectionMatrix, false, projection);
    gl.uniformMatrix4fv(this.modelViewMatrix, false, modelView);
    
    geometry.draw(gl);
  }
}

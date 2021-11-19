
import vertexSource from "./vertex.glsl";
import fragmentSource from "./fragment.glsl";

import Scene from "../../core/Scene";
import Geometry from "../../core/Geometry";
import ShaderProgram from "../../core/ShaderProgram";

export default class BasicShaderProgram extends ShaderProgram {
  private projectionMatrix: WebGLUniformLocation | null = null;
  private modelViewMatrix: WebGLUniformLocation | null = null;
  private colorLocation: WebGLUniformLocation | null = null;

  constructor(scene: Scene) {
    super(scene,vertexSource, fragmentSource);
  }

  initCallback(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    this.projectionMatrix = gl.getUniformLocation(program, 'projection');
    this.modelViewMatrix = gl.getUniformLocation(program, 'modelView');
    this.colorLocation = gl.getUniformLocation(program, 'color');
  }

  disposeCallback(gl: WebGLRenderingContext, program: WebGLProgram): void {
    // Todo remove data
  }

  run(
    gl: WebGL2RenderingContext,
    geometry: Geometry,
    modelView: Float32Array,
    projection: Float32Array,
    color: [number,number,number,number] = [0.5,0.5,1.0,1.0]
  ) {
    gl.useProgram(this.program);
    
    gl.uniformMatrix4fv(this.projectionMatrix, false, projection);
    gl.uniformMatrix4fv(this.modelViewMatrix, false, modelView);
    gl.uniform4fv(this.colorLocation, color);
    
    geometry.draw(gl);
  }
}

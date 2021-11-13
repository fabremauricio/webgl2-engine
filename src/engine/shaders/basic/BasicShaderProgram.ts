
import vertexSource from "./vertex.glsl";
import fragmentSource from "./fragment.glsl";

import Scene from "../../core/Scene";
import Geometry from "../../core/Geometry";
import ShaderProgram from "../../core/ShaderProgram";

export default class BasicShaderProgram extends ShaderProgram {

  private vertexPosition: number;
  private projectionMatrix: WebGLUniformLocation | null;
  private modelViewMatrix: WebGLUniformLocation | null;

  constructor(scene: Scene) {
    super(scene,vertexSource, fragmentSource);
    this.vertexPosition = -1;
    this.projectionMatrix = null;
    this.modelViewMatrix = null;
  }

  initCallback(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    this.vertexPosition = gl.getAttribLocation(program, 'position');
    this.projectionMatrix = gl.getUniformLocation(program, 'projection');
    this.modelViewMatrix = gl.getUniformLocation(program, 'modelView');

    console.log(this.modelViewMatrix);
  }

  disposeCallback(gl: WebGLRenderingContext, program: WebGLProgram): void {
    // Todo remove data
  }

  run(
    gl: WebGL2RenderingContext,
    geometry: Geometry,
    modelView: Float32Array,
    projection: Float32Array
  ) {
    geometry.bind(gl, this.vertexPosition);
    
    gl.useProgram(this.program);
    
    gl.uniformMatrix4fv(this.projectionMatrix, false, projection);
    gl.uniformMatrix4fv(this.modelViewMatrix, false, modelView);

    geometry.draw(gl);
  }
}

import ShaderProgram from "./ShaderProgram";

import vertexSource from "../shaders/vertex.glsl";
import fragmentSource from "../shaders/fragment.glsl";
import Geometry from "./Geometry";

export default class BasicShaderProgram extends ShaderProgram {
  private vertexPosition: number;
  private projectionMatrix: WebGLUniformLocation | null;
  private modelViewMatrix: WebGLUniformLocation | null;

  constructor() {
    super(vertexSource, fragmentSource);
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

  render(
    geometry: Geometry,
    modelView: Float32Array,
    projection: Float32Array
  ) {
    geometry.bind(this.vertexPosition);
    console.log(modelView);
    
    this.gl?.useProgram(this.program);
    this.gl?.uniformMatrix4fv(this.projectionMatrix, false, projection);
    this.gl?.uniformMatrix4fv(this.modelViewMatrix, false, modelView);

    this.gl?.drawArrays(
      this.gl.TRIANGLE_STRIP,
      geometry.vertexOffset(),
      geometry.vertexCount()
    );
  }
}

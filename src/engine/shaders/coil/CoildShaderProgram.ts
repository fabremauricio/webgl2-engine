import vertexSource from "./vertex.glsl";
import fragmentSource from "./fragment.glsl";

import Scene from "../../core/Scene";
import Geometry from "../../core/Geometry";
import ShaderProgram from "../../core/ShaderProgram";

let a = 0;

export default class CoilShaderProgram extends ShaderProgram {
  private projectionMatrix: WebGLUniformLocation | null = null;
  private modelViewMatrix: WebGLUniformLocation | null = null;
  private colorLocation: WebGLUniformLocation | null = null;

  private p0Location: WebGLUniformLocation | null = null;
  private p1Location: WebGLUniformLocation | null = null;
  private p2Location: WebGLUniformLocation | null = null;
  private p3Location: WebGLUniformLocation | null = null;

  constructor(scene: Scene) {
    super(scene, vertexSource, fragmentSource);
  }

  initCallback(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    this.projectionMatrix = gl.getUniformLocation(program, "projection");
    this.modelViewMatrix = gl.getUniformLocation(program, "modelView");
    this.colorLocation = gl.getUniformLocation(program, "color");

    this.p0Location = gl.getUniformLocation(program, "p0");
    this.p1Location = gl.getUniformLocation(program, "p1");
    this.p2Location = gl.getUniformLocation(program, "p2");
    this.p3Location = gl.getUniformLocation(program, "p3");
  }

  disposeCallback(gl: WebGLRenderingContext, program: WebGLProgram): void {
    // Todo remove data
  }

  run(
    gl: WebGL2RenderingContext,
    geometry: Geometry,
    modelView: Float32Array,
    projection: Float32Array,
    color: [number, number, number, number] = [0.5, 0.5, 1.0, 1.0]
  ) {
    gl.useProgram(this.program);

    gl.uniformMatrix4fv(this.projectionMatrix, false, projection);
    gl.uniformMatrix4fv(this.modelViewMatrix, false, modelView);
    gl.uniform4fv(this.colorLocation, color);

    const e = 3;
    gl.uniform3fv(this.p0Location, [0, -e, 0]);
    gl.uniform3fv(this.p1Location, [0, e, e * Math.cos(a)]);
    gl.uniform3fv(this.p2Location, [e, e * Math.sin(a), e * -Math.cos(a)]);
    gl.uniform3fv(this.p3Location, [e, 0, e]);

    a += 0.01;
    geometry.draw(gl);
  }
}

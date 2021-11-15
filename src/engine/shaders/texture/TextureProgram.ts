
import vertexSource from "./vertex.glsl";
import fragmentSource from "./fragment.glsl";

import Scene from "../../core/Scene";
import Geometry from "../../core/Geometry";
import ShaderProgram from "../../core/ShaderProgram";
import ImageTexture from "../../core/ImageTexture";

export default class TextureProgram extends ShaderProgram {
  private projectionMatrix: WebGLUniformLocation | null = null;
  private modelViewMatrix: WebGLUniformLocation | null = null;
  private multiplyColor: WebGLUniformLocation | null = null;

  constructor(scene: Scene) {
    super(scene,vertexSource, fragmentSource);
  }

  initCallback(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    this.projectionMatrix = gl.getUniformLocation(program, 'projection');
    this.modelViewMatrix = gl.getUniformLocation(program, 'modelView');
    this.multiplyColor = gl.getUniformLocation(program, 'multiplyColor');
  }

  disposeCallback(gl: WebGLRenderingContext, program: WebGLProgram): void {}

  run(
    gl: WebGL2RenderingContext,
    geometry: Geometry,
    texture: ImageTexture,
    modelView: Float32Array,
    projection: Float32Array,
    color: [number,number,number,number] = [1.0,1.0,1.0,1.0],
  ) {
    gl.useProgram(this.program);
    
    gl.uniformMatrix4fv(this.projectionMatrix, false, projection);
    gl.uniformMatrix4fv(this.modelViewMatrix, false, modelView);
    gl.uniform4fv(this.multiplyColor, color, 0, 4);
    
    texture.bind(gl);
    geometry.draw(gl);
  }
}

import { mat3, mat4 } from "gl-matrix";

export default abstract class Camera {
  protected width = 1;
  protected height = 1;

  abstract projectionMatrix(): Float32Array;
  abstract viewMatrix(): Float32Array;

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
  /// TODO add inverse matrix operations

  modelViewMatrix(modelMatrix: Float32Array): Float32Array {
    /// FIXME
    const matrix = mat4.create();
    mat4.multiply(matrix, this.viewMatrix(),modelMatrix);
    return new Float32Array(matrix);
  }

  normalMatrix(modelMatrix: Float32Array): Float32Array {
    const matrix = mat3.create();
    mat3.fromMat4(matrix, modelMatrix);
    mat3.invert(matrix, matrix);
    mat3.transpose(matrix, matrix);
    return new Float32Array(matrix);
  }

  get screenWidth() {
    return this.width;
  }

  get screenHeight() {
    return this.height;
  }
}

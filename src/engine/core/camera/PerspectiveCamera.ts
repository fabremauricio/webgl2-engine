import { mat4 } from "gl-matrix";
import Camera from "../Camera";

export default class PerspectiveCamera extends Camera {
  private position: [number, number, number] = [0, 0, -5];
  private rotation: [number, number, number] = [0, 0, 0];

  private delta = 0;
  private theta = 0;

  projectionMatrix(): Float32Array {
    const matrix = mat4.create();
    mat4.perspective(
      matrix,
      (45 * Math.PI) / 180,
      this.width / this.height,
      0.1,
      100.0
    );
    return new Float32Array(matrix);
  }

  viewMatrix(): Float32Array {
    const matrix = mat4.create();
    mat4.translate(matrix, matrix, this.position);
    mat4.rotateY(matrix, matrix, this.delta);
    mat4.rotateY(matrix, matrix, this.theta);
    this.delta += 0.01;
    this.theta += 0.00;
    return new Float32Array(matrix);
  }
}

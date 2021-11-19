import { mat4 } from "gl-matrix";
import Camera from "../Camera";

export default class PerspectiveCamera extends Camera {
  private position: [number, number, number] = [0, 0, 0];
  private rotation: [number, number, number] = [0, 0, 0];

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
    mat4.rotateX(matrix, matrix, this.rotation[0]);
    mat4.rotateY(matrix, matrix, this.rotation[1]);
    mat4.rotateZ(matrix, matrix, this.rotation[2]);
    mat4.translate(matrix, matrix, this.position);
    return new Float32Array(matrix);
  }

  updatePosition(px: number, py: number, pz: number) {
    this.position[0] = -px;
    this.position[1] = -py;
    this.position[2] = -pz;
  }

  updateRotation(rx: number, ry: number, rz: number) {
    this.rotation[0] = -rx;
    this.rotation[1] = -ry;
    this.rotation[2] = -rz;
  }

  get pos(): [number, number, number] {
    return this.position;
  }
  
  get x(): number {
    return this.position[0];
  }

  get y(): number {
    return this.position[1];
  }

  get z(): number {
    return this.position[2];
  }

  get rx(): number {
    return this.rotation[0];
  }

  get ry(): number {
    return this.rotation[1];
  }

  get rz(): number {
    return this.rotation[2];
  }

  set x(value: number) {
    this.position[0] = value;
  }

  set y(value: number) {
    this.position[1] = value;
  }

  set z(value: number) {
    this.position[2] = value;
  }

  set rx(value: number) {
    this.rotation[0] = value;
  }

  set ry(value: number) {
    this.rotation[1] = value;
  }

  set rz(value: number) {
    this.rotation[2] = value;
  }
}

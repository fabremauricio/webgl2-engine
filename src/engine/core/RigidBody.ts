import { mat4 } from "gl-matrix";

export class RigidBody {
  private _parent: RigidBody | null = null;
  private position: [number, number, number] = [0, 0, 0];
  private rotation: [number, number, number] = [0, 0, 0];

  modelMatrix(): Float32Array {
    const matrix = mat4.create();

    mat4.translate(matrix, matrix, this.position);
    mat4.rotateX(matrix, matrix, this.rotation[0]);
    mat4.rotateY(matrix, matrix, this.rotation[1]);
    mat4.rotateZ(matrix, matrix, this.rotation[2]);

    if (this._parent) {
      mat4.multiply(matrix, this._parent.modelMatrix(), matrix);
    }
    return new Float32Array(matrix);
  }

  updatePosition(px: number, py: number, pz: number) {
    this.position[0] = px;
    this.position[1] = py;
    this.position[2] = pz;
  }

  updateRotation(rx: number, ry: number, rz: number) {
    this.rotation[0] = rx;
    this.rotation[1] = ry;
    this.rotation[2] = rz;
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

  get parent(): RigidBody | null {
    return this._parent;
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

  set parent(value: RigidBody | null) {
    if (value) {
      this.position[0] -= value.position[0];
      this.position[1] -= value.position[1];
      this.position[2] -= value.position[2];
    }

    this._parent = value;
  }

  static distance(a: RigidBody, b: RigidBody): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
  }
}

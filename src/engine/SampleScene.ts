import PerspectiveCamera from "./core/camera/PerspectiveCamera";
import Scene from "./core/Scene";

import clawSource from "../engine/models/claw.bin";
import pistonSource from "../engine/models/piston.bin";
import headSource from "../engine/models/head.bin";
import rodSource from "../engine/models/rod.bin";
import guideSource from "../engine/models/guide.bin";

import OrbitControls from "./core/utils/OrbitControls";

import BinaryGeometry from "./core/geometry/BinaryGeometry";

import { RigidBody } from "./core/RigidBody";
import BasicShaderProgram from "./shaders/basic/BasicShaderProgram";
import VAOGeometry from "./core/geometry/VAOGeometry";

function oneZero(value: number) {
  return -(Math.cos(value) - 1) * 0.5;
}

function lawOfCosinesRad(a: number, b: number, c: number) {
  return Math.acos(
    (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b)
  );
}

function intersection(
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number
): null | [number, number, number, number] {
  var a, dx, dy, d, h, rx, ry;
  var x2, y2;

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0;
  dy = y1 - y0;

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt(dy * dy + dx * dx);

  /* Check for solvability. */
  if (d > r0 + r1) {
    /* no solution. circles do not intersect. */
    return null;
  }
  if (d < Math.abs(r0 - r1)) {
    /* no solution. one circle is contained in the other */
    return null;
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.
   */

  /* Determine the distance from point 0 to point 2. */
  a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d);

  /* Determine the coordinates of point 2. */
  x2 = x0 + (dx * a) / d;
  y2 = y0 + (dy * a) / d;

  /* Determine the distance from point 2 to either of the
   * intersection points.
   */
  h = Math.sqrt(r0 * r0 - a * a);

  /* Now determine the offsets of the intersection points from
   * point 2.
   */
  rx = -dy * (h / d);
  ry = dx * (h / d);

  /* Determine the absolute intersection points. */
  var xi = x2 + rx;
  var xi_prime = x2 - rx;
  var yi = y2 + ry;
  var yi_prime = y2 - ry;

  return [xi, xi_prime, yi, yi_prime];
}

function rad(deg: number) {
  return (deg * Math.PI) / 180;
}

const RADIUS_CLAW = 0.7;
const RADIUS_ROD = 0.93109;

const CLAW_X = 0.16;
const ROD_X = 0.558772;

export default class SampleScene extends Scene {
  private basicShader: BasicShaderProgram;
  private camera: PerspectiveCamera;

  private claw: VAOGeometry;
  private piston: VAOGeometry;
  private head: VAOGeometry;
  private rod: VAOGeometry;

  private guide: VAOGeometry;

  private clawRO: RigidBody;
  private pistonRO: RigidBody;
  private headRO: RigidBody;
  private rodRO: RigidBody;
  private g1RO: RigidBody;
  private g2RO: RigidBody;

  private hRO: RigidBody;

  private a: number = 0;

  

  constructor() {
    super();

    this.basicShader = new BasicShaderProgram(this);
    this.camera = new PerspectiveCamera();

    this.claw = new BinaryGeometry(this, clawSource);
    this.piston = new BinaryGeometry(this, pistonSource);
    this.head = new BinaryGeometry(this, headSource);
    this.rod = new BinaryGeometry(this, rodSource);
    this.guide = new BinaryGeometry(this, guideSource);

    this.clawRO = new RigidBody();
    this.pistonRO = new RigidBody();
    this.headRO = new RigidBody();
    this.rodRO = new RigidBody();

    this.g1RO = new RigidBody();
    this.g2RO = new RigidBody();

    this.hRO = new RigidBody();

    new OrbitControls(this, this.camera);

    const h = 0.6;
    this.g1RO.y = Math.sqrt(
      Math.pow(RADIUS_ROD, 2) - Math.pow(CLAW_X + RADIUS_CLAW - ROD_X, 2)
    );
    this.g1RO.x = ROD_X;

    this.g2RO.x = CLAW_X + RADIUS_CLAW;
    this.g2RO.y = 0;

    this.clawRO.x = CLAW_X;

    this.rodRO.x = this.g1RO.x;
    this.rodRO.y = this.g1RO.y;
    this.headRO.y = this.g1RO.y;

    // This removes the offset
    this.g2RO.parent = this.clawRO;
    this.g1RO.parent = this.hRO;
    this.clawRO.parent = this.hRO;
    this.rodRO.parent = this.hRO;
    // Initial setup
  }

  initCallback(gl: WebGL2RenderingContext): void {}

  disposeCallback(gl: WebGL2RenderingContext): void {}

  render(gl: WebGL2RenderingContext): void {
    const a = this.a;

    this.camera.resize(gl.canvas.clientWidth, gl.canvas.clientHeight);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    this.pistonRO.y = -0.1 + oneZero(a) * 0.4;
    this.clawRO.y = this.pistonRO.y;

    this.hRO.ry = 0;

    {
      const dx = Math.abs(this.clawRO.x - this.g1RO.x);
      const dy = Math.abs(this.clawRO.y - this.g1RO.y);
      const alfa = Math.atan(dy / dx);

      const r1 = RADIUS_CLAW;
      const r2 = RADIUS_ROD;
      const d = RigidBody.distance(this.clawRO, this.g1RO);

      const a = (Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(d, 2)) / (2 * d);
      const beta = Math.acos(a / r1);
      const theta = Math.PI / 2 - alfa;
      const gamma = Math.acos((d - a) / r2);

      this.clawRO.rz = alfa - beta;
      this.rodRO.rz = gamma - theta;
    }

    {
      // Claw1
      this.basicShader.run(
        gl,
        this.claw,
        this.camera.modelViewMatrix(this.clawRO.modelMatrix()),
        this.camera.projectionMatrix(),
        [1, 0.5, 0.5, 1]
      );
      this.basicShader.run(
        gl,
        this.guide,
        this.camera.modelViewMatrix(this.g1RO.modelMatrix()),
        this.camera.projectionMatrix(),
        [0.01, 0.01, 0.01, 1]
      );

      this.basicShader.run(
        gl,
        this.guide,
        this.camera.modelViewMatrix(this.g2RO.modelMatrix()),
        this.camera.projectionMatrix(),
        [0.01, 0.01, 0.01, 1]
      );

      this.basicShader.run(
        gl,
        this.rod,
        this.camera.modelViewMatrix(this.rodRO.modelMatrix()),
        this.camera.projectionMatrix(),
        [0, 0, 1, 1]
      );

      // Claw2
      this.hRO.ry = (Math.PI * 2) / 3;

      this.basicShader.run(
        gl,
        this.claw,
        this.camera.modelViewMatrix(this.clawRO.modelMatrix()),
        this.camera.projectionMatrix(),
        [1, 0.5, 0.5, 1]
      );
      this.basicShader.run(
        gl,
        this.guide,
        this.camera.modelViewMatrix(this.g1RO.modelMatrix()),
        this.camera.projectionMatrix(),
        [0.01, 0.01, 0.01, 1]
      );

      this.basicShader.run(
        gl,
        this.guide,
        this.camera.modelViewMatrix(this.g2RO.modelMatrix()),
        this.camera.projectionMatrix(),
        [0.01, 0.01, 0.01, 1]
      );
      this.basicShader.run(
        gl,
        this.rod,
        this.camera.modelViewMatrix(this.rodRO.modelMatrix()),
        this.camera.projectionMatrix(),
        [0, 0, 1, 1]
      );

      // Claw3
      this.hRO.ry = (Math.PI * 4) / 3;

      this.basicShader.run(
        gl,
        this.claw,
        this.camera.modelViewMatrix(this.clawRO.modelMatrix()),
        this.camera.projectionMatrix(),
        [1, 0.5, 0.5, 1]
      );
      this.basicShader.run(
        gl,
        this.guide,
        this.camera.modelViewMatrix(this.g1RO.modelMatrix()),
        this.camera.projectionMatrix(),
        [0.01, 0.01, 0.01, 1]
      );
      this.basicShader.run(
        gl,
        this.rod,
        this.camera.modelViewMatrix(this.rodRO.modelMatrix()),
        this.camera.projectionMatrix(),
        [0, 0, 1, 1]
      );
    }
    this.basicShader.run(
      gl,
      this.guide,
      this.camera.modelViewMatrix(this.g2RO.modelMatrix()),
      this.camera.projectionMatrix(),
      [0.01, 0.01, 0.01, 1]
    );

    this.basicShader.run(
      gl,
      this.piston,
      this.camera.modelViewMatrix(this.pistonRO.modelMatrix()),
      this.camera.projectionMatrix(),
      [1, 1, 0, 1]
    );

    this.basicShader.run(
      gl,
      this.head,
      this.camera.modelViewMatrix(this.headRO.modelMatrix()),
      this.camera.projectionMatrix(),
      [0, 1, 0, 1]
    );

    this.a += 0.04;
  }
}

import PerspectiveCamera from "../camera/PerspectiveCamera";
import Scene from "../Scene";
import SceneNode from "../SceneNode";

export default class OrbitControls extends SceneNode {
  private camera: PerspectiveCamera;
  private radius = 5;

  private free = false;

  private downX = 0;
  private downY = 0;

  private phi = 0;
  private theta = 0;

  private startPhi = 0;
  private startTheta = 0;

  constructor(scene: Scene, camera: PerspectiveCamera) {
    super(scene);
    this.camera = camera;
  }

  init(gl: WebGL2RenderingContext): void {
    // Prevent losing 'this'
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    // TODO add support for mobile
    gl.canvas.addEventListener("mousedown", this.onMouseDown);
    gl.canvas.addEventListener("mouseup", this.onMouseUp);
    gl.canvas.addEventListener("mouseout", this.onMouseUp);
    gl.canvas.addEventListener("mousemove", this.onMouseMove);

    this.recalculate();
  }

  private recalculate() {
    const sp = Math.sin(this.phi);
    const cp = Math.cos(this.phi);
    const st = Math.sin(this.theta);
    const ct = Math.cos(this.theta);
    const r = this.radius;

    const x = r * sp * ct;
    const y = -r * st;
    const z = r * cp * ct;

    this.camera.updatePosition(x, y, z);
    this.camera.updateRotation(this.theta, this.phi, 0);
  }

  dispose(gl: WebGL2RenderingContext): void {
    gl.canvas.removeEventListener("mousedown", this.onMouseDown);
    gl.canvas.removeEventListener("mouseup", this.onMouseUp);
    gl.canvas.removeEventListener("mouseout", this.onMouseUp);
    gl.canvas.removeEventListener("mousemove", this.onMouseMove);
  }

  private onMouseDown(ev: MouseEvent) {
    const { x, y } = this.getPos(ev);
    this.free = true;

    this.downX = x;
    this.downY = y;

    this.startPhi = this.phi;
    this.startTheta = this.theta;
  }

  private getPos(ev: MouseEvent): { x: number; y: number } {
    const max = Math.max(this.camera.screenWidth, this.camera.screenHeight);

    const sx = this.camera.screenWidth / max;
    const sy = this.camera.screenHeight / max;

    const x = 2 * sx * (ev.clientX / this.camera.screenWidth - 0.5);
    const y = -2 * sy * (ev.clientY / this.camera.screenHeight - 0.5);

    return { x, y };
  }

  private getAngle(a: number) {
    if (a === 0) return 0;

    const opp = a * this.radius;
    const adj = this.radius;

    return Math.atan(opp / adj);
  }

  private onMouseUp(ev: MouseEvent) {
    this.free = false;
  }

  private onMouseMove(ev: MouseEvent) {
    if (this.free) {
      const { x, y } = this.getPos(ev);

      const iPhi = this.getAngle(this.downX);
      const fPhi = this.getAngle(x);

      const iTheta = this.getAngle(this.downY);
      const fTheta = this.getAngle(y);

      const deltaPhi = fPhi - iPhi;
      const deltaTheta = fTheta - iTheta;

      this.phi = this.startPhi - deltaPhi;
      this.theta = this.startTheta + deltaTheta;

      this.recalculate();
    }
  }
}

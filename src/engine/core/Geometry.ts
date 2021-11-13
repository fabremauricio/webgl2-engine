import SceneNode from "./SceneNode";

export default abstract class Geometry extends SceneNode{
  init(gl: WebGL2RenderingContext) {
    this.initCallback(gl);
  }

  dispose(gl: WebGL2RenderingContext) {
    this.disposeCallback(gl);
  }

  draw(gl: WebGL2RenderingContext) {
    this.drawCallback(gl);
  }

  abstract initCallback(gl: WebGL2RenderingContext): void;
  abstract disposeCallback(gl: WebGL2RenderingContext): void;
  abstract drawCallback(gl: WebGL2RenderingContext): void;
}

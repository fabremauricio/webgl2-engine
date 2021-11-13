export default abstract class Geometry {
  init(gl: WebGL2RenderingContext) {
    this.initCallback(gl);
  }

  draw(gl: WebGL2RenderingContext) {
    this.drawCallback(gl);
  }

  abstract initCallback(gl: WebGL2RenderingContext): void;
  abstract drawCallback(gl: WebGL2RenderingContext): void;
  
  abstract bind(
    gl: WebGL2RenderingContext,
    vertexPositionLocation: number
  ): void;
}

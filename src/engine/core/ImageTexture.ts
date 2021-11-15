import Scene from "./Scene";
import SceneNode from "./SceneNode";

export default class ImageTexture extends SceneNode {
  private image: HTMLImageElement;
  private texture: WebGLTexture | null = null;

  constructor(
    scene: Scene,
    src: string = "https://us.v-cdn.net/5021068/uploads/editor/ha/7frj09nru4zu.png"
  ) {
    super(scene);
    this.image = new Image();
    this.image.src = src;
  }

  init(gl: WebGL2RenderingContext): void {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 255, 255])
    );

    this.image.addEventListener("load", () => {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.image
      );
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }

  dispose(gl: WebGL2RenderingContext): void {
    throw new Error("Method not implemented.");
  }

  bind(gl: WebGL2RenderingContext): void {
    // TODO Active texture?
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }
}

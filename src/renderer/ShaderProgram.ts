export default abstract class ShaderProgram {
  private vertexSource: string;
  private fragmentSource: string;
  protected program: WebGLProgram | null;
  protected gl: WebGL2RenderingContext | null;

  constructor(vertexSource: string, fragmentSource: string) {
    this.vertexSource = vertexSource;
    this.fragmentSource = fragmentSource;
    this.program = null;
    this.gl = null;
  }

  public init(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = this.initShaderProgram(
      gl,
      this.vertexSource,
      this.fragmentSource
    );
    
    if(this.gl && this.program) {
      this.initCallback(this.gl,this.program);
    }
  }

  abstract initCallback(gl: WebGL2RenderingContext, program: WebGLProgram): void;

  private loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);

    if (shader) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.error('Shader Error', error);
        gl.deleteShader(shader);
        return null;
      }


      return shader;
    }

    return null;
  }

  private initShaderProgram(
    gl: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string
  ): WebGLProgram | null {
    const vertex = this.loadShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (vertex && fragment) {
      const program = gl.createProgram();

      if (program) {
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const error = gl.getProgramInfoLog(program);
          console.error('Program Error', error);
          return null;
        }


        return program;
      }
    }

    return null;
  }
}

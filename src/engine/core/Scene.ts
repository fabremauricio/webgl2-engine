import SceneNode from "./SceneNode";

export default abstract class Scene {
    private nodes: Array<SceneNode>;

    constructor() {
        this.nodes = [];
    }

    registerNode(node: SceneNode) {
        this.nodes.push(node);
    }

    removeNode(node: SceneNode) {
        this.nodes = this.nodes.filter(e => e !== node);
    }

    init(gl: WebGL2RenderingContext) {
        this.nodes.forEach(n => n.init(gl));
        this.initCallback(gl);
    }

    dispose(gl: WebGL2RenderingContext) {
        this.nodes.forEach(n => n.dispose(gl));
        this.disposeCallback(gl);
    }

    abstract initCallback(gl: WebGL2RenderingContext): void;
    abstract disposeCallback(gl: WebGL2RenderingContext): void;
    abstract render(gl: WebGL2RenderingContext): void;
}
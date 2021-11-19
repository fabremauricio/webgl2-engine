import Scene from "./Scene";

export default abstract class SceneNode {
    protected scene: Scene;
    /// TODO add an id
    
    constructor(scene: Scene) {
        this.scene = scene;
        scene.registerNode(this);
    }

    abstract init(gl: WebGL2RenderingContext): void;
    abstract dispose(gl: WebGL2RenderingContext): void;
}
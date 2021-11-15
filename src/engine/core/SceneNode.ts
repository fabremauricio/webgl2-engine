import Scene from "./Scene";

export default abstract class SceneNode {
    /// TODO add an id
    
    constructor(scene: Scene) {
        scene.registerNode(this);
    }

    abstract init(gl: WebGL2RenderingContext): void;
    abstract dispose(gl: WebGL2RenderingContext): void;
}
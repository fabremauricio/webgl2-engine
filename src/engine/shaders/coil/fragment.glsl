#version 300 es
precision mediump float;

in vec3 mapped;

out vec4 c;

void main() {
    c = vec4(mapped, 1.0);
}
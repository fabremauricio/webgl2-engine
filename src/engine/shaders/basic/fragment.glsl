#version 300 es
precision mediump float;

uniform vec4 color;
out vec4 c;

void main() {
    c = color;
}
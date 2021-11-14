#version 300 es

precision mediump float;

in vec4 interpolated;
out vec4 color;

void main() {
    color = vec4(sqrt(abs(interpolated).zzz), 1.0);
}
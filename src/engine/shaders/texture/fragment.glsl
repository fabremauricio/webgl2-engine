#version 300 es

precision mediump float;

uniform sampler2D uvSampler;
uniform vec4 multiplyColor;

in vec2 uv;
out vec4 color;

void main() {
    color = texture(uvSampler, uv) * multiplyColor;
}
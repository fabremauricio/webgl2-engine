#version 300 es

layout (location = 0) in vec4 position;
layout (location = 1) in vec4 normal;
layout (location = 2) in vec2 texture;

uniform mat4 modelView;
uniform mat4 projection;

out vec4 interpolated;
out vec2 uv;

void main() {
   gl_Position = projection * modelView * position;
   interpolated = normal;
   uv = texture;
}
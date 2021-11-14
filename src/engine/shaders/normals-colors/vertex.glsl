#version 300 es

layout (location = 0) in vec4 position;
layout (location = 1) in vec4 normal;

uniform mat4 modelView;
uniform mat4 projection;

out vec4 interpolated;

void main() {
   gl_Position = projection * modelView * position;
   interpolated = normal;
}
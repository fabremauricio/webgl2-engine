#version 300 es

in vec4 position; // 0
in vec4 normal; // 1

uniform mat4 modelView;
uniform mat4 projection;

out vec4 interpolated;

void main() {
   gl_Position = projection * modelView * position;
   interpolated = normal;
}
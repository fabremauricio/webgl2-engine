#version 300 es

in vec4 position;

uniform mat4 modelView;
uniform mat4 projection;

void main() {
   gl_Position = projection * modelView * position;
}
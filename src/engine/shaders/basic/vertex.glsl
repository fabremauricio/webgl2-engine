#version 300 es

layout (location = 0) in vec4 position;

uniform mat4 modelView;
uniform mat4 projection;

void main() {
   gl_PointSize = 3.0;
   gl_Position = projection * modelView * position;
}
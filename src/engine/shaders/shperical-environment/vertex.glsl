#version 300 es

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 3) in vec3 tangent;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 e;
out vec3 n;

void main() {
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

   e = (modelViewMatrix * vec4(position, 1.0)).xyz;
   n = tangent *0.5 + vec3(0.5);
}
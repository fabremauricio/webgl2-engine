#version 300 es

layout(location = 0) in vec4 position;
layout(location = 1) in float t;

uniform mat4 modelView;
uniform mat4 projection;

uniform vec4 color;

uniform vec3 p0;
uniform vec3 p1;
uniform vec3 p2;
uniform vec3 p3;

out vec3 mapped;

float rand(vec2 n) {
   return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 bezier(float t, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {
   return p0 * (-pow(t, 3.0) + 3.0 * pow(t, 2.0) - 3.0 * t + 1.0) + p1 * (3.0 * pow(t, 3.0) - 6.0 * pow(t, 2.0) + 3.0 * t) + p2 * (-3.0 * pow(t, 3.0) + 3.0 * pow(t, 2.0)) + p3 * pow(t, 3.0);
}

vec3 bezierTangent(float t, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {
   return p0 * (-3.0 * pow(t, 2.0) + 6.0 * t - 3.0) + p1 * (9.0 * pow(t, 2.0) - 12.0 * t + 3.0) + p2 * (-9.0 * pow(t, 2.0) + 6.0 * t) + p3 * (3.0 * pow(t, 2.0));
}

vec4 quat_from_axis_angle(vec3 axis, float angle) {
   return vec4(axis.xyz * sin(angle * 0.5), cos(angle * 0.5));
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) {
   vec4 q = quat_from_axis_angle(axis, angle);
   vec3 v = position.xyz;
   return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
   vec3 o = bezierTangent(t, p0, p1, p2, p3);
   vec3 p = bezier(t, p0, p1, p2, p3);

   vec3 axis = normalize(cross(vec3(0.0, 1.0, 0.0), normalize(o)));
   float angle = acos(dot(vec3(0.0, 1.0, 0.0), normalize(o)));

   vec3 cp = rotate_vertex_position(position.xyz, axis, angle);

   vec3 mixcolor = vec3(rand(position.xy), rand(position.yz), rand(position.xz));
   mapped = mixcolor * .5 + vec3(color) * .5;
   mapped = normalize(o);

   gl_PointSize = 3.0;
   gl_Position = projection * modelView * (vec4(p + cp, 1.0)); //position;
}
#version 300 es

precision mediump float;

uniform sampler2D uvSampler;

in vec3 e;
in vec3 n;

out vec4 color;

void main() {
    vec3 r =  normalize(reflect(e, n));
    float m = 2. * sqrt(pow(r.x, 2.) + pow(r.y, 2.) + pow(r.z + 1., 2.));
    vec2 uv = r.xy / m + .5;

    color = vec4(normalize(r), 1.0);
    color = texture(uvSampler, uv);
    color = vec4(normalize(n).xy, 1.0, 1.0);
}
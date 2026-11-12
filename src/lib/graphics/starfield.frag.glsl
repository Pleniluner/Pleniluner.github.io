precision highp float;

uniform float u_pixel_ratio;

float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    // Work in CSS pixels so star spacing is stable across display densities.
    vec2 point = gl_FragCoord.xy / u_pixel_ratio;
    vec2 cell = floor(point / 64.0);
    vec2 local = fract(point / 64.0) * 64.0;
    vec2 center = (vec2(hash(cell), hash(cell + 7.0)) * 0.65 + 0.175) * 64.0;
    float radius = mix(0.45, 1.05, hash(cell + 3.0));
    float star = 1.0 - smoothstep(radius * 0.25, radius + 0.8 / u_pixel_ratio, distance(local, center));
    float alpha = star * step(0.84, hash(cell + 11.0)) * 0.32;
    // The browser composites a premultiplied-alpha canvas over the artwork.
    gl_FragColor = vec4(vec3(0.72, 0.78, 0.75) * alpha, alpha);
}

/**
 * Draw only on mount, resize and context restoration. No animation loop.
 * @param {HTMLCanvasElement} canvas
 * @param {string} vertexSource
 * @param {string} fragmentSource
 * @returns {() => void}
 */
export function mountStarfield(canvas, vertexSource, fragmentSource) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
  if (!gl) return () => {};

  /** @type {WebGLProgram | null} */
  let program = null;
  /** @type {WebGLBuffer | null} */
  let buffer = null;
  /** @type {WebGLUniformLocation | null} */
  let ratioLocation = null;
  /** @type {WebGLShader[]} */
  const shaders = [];
  let frame = 0;

  const release = () => {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach(shader => gl.deleteShader(shader));
    shaders.length = 0;
    buffer = program = ratioLocation = null;
  };

  const draw = () => {
    frame = 0;
    if (!program || gl.isContextLost()) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    // A bounded buffer keeps this decorative layer inexpensive on high-DPI screens.
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 1600 / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(ratioLocation, ratio);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(draw);
  };

  const initialize = () => {
    release();
    try {
      for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
        const shader = gl.createShader(Number(type));
        if (!shader) throw new Error("Shader allocation failed");
        shaders.push(shader);
        gl.shaderSource(shader, String(source));
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Shader compilation failed");
      }
      program = gl.createProgram();
      if (!program) throw new Error("Program allocation failed");
      shaders.forEach(shader => gl.attachShader(program, shader));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader linking failed");
      gl.useProgram(program);
      buffer = gl.createBuffer();
      if (!buffer) throw new Error("Buffer allocation failed");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      ratioLocation = gl.getUniformLocation(program, "u_pixel_ratio");
      canvas.dataset.renderer = "webgl";
      schedule();
    } catch {
      release();
      delete canvas.dataset.renderer;
    }
  };

  /** @param {Event} event */
  const lost = event => {
    event.preventDefault();
    window.cancelAnimationFrame(frame);
    frame = 0;
    // Context loss has already released these GPU objects.
    buffer = program = ratioLocation = null;
    shaders.length = 0;
    delete canvas.dataset.renderer;
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(canvas);
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", initialize);
  window.addEventListener("resize", schedule, { passive: true });
  initialize();

  return () => {
    observer.disconnect();
    window.cancelAnimationFrame(frame);
    window.removeEventListener("resize", schedule);
    canvas.removeEventListener("webglcontextlost", lost);
    canvas.removeEventListener("webglcontextrestored", initialize);
    delete canvas.dataset.renderer;
    release();
  };
}

// "use client"
// import { useEffect, useRef } from 'react';
// import {
//   Timer,
//   Mesh,
//   OrthographicCamera,
//   PlaneGeometry,
//   Scene,
//   ShaderMaterial,
//   Vector2,
//   Vector3,
//   WebGLRenderer
// } from 'three';

// const vertexShader = `
// precision highp float;

// void main() {
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// const fragmentShader = `
// precision highp float;

// uniform float iTime;
// uniform vec3  iResolution;
// uniform float animationSpeed;

// uniform bool enableTop;
// uniform bool enableMiddle;
// uniform bool enableBottom;

// uniform int topLineCount;
// uniform int middleLineCount;
// uniform int bottomLineCount;

// uniform float topLineDistance;
// uniform float middleLineDistance;
// uniform float bottomLineDistance;

// uniform vec3 topWavePosition;
// uniform vec3 middleWavePosition;
// uniform vec3 bottomWavePosition;

// uniform vec2 iMouse;
// uniform bool interactive;
// uniform float bendRadius;
// uniform float bendStrength;
// uniform float bendInfluence;

// uniform bool parallax;
// uniform float parallaxStrength;
// uniform vec2 parallaxOffset;

// uniform vec3 lineGradient[8];
// uniform int lineGradientCount;

// uniform vec3 bgColor;
// uniform bool lightMode;

// const vec3 BLACK = vec3(0.0);
// const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
// const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

// mat2 rotate(float r) {
//   return mat2(cos(r), sin(r), -sin(r), cos(r));
// }

// vec3 background_color(vec2 uv) {
//   vec3 col = vec3(0.0);

//   float y = sin(uv.x - 0.2) * 0.3 - 0.1;
//   float m = uv.y - y;

//   col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
//   col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
//   return col * 0.5;
// }

// vec3 getLineColor(float t, vec3 baseColor) {
//   if (lineGradientCount <= 0) {
//     return baseColor;
//   }

//   vec3 gradientColor;

//   if (lineGradientCount == 1) {
//     gradientColor = lineGradient[0];
//   } else {
//     float clampedT = clamp(t, 0.0, 0.9999);
//     float scaled = clampedT * float(lineGradientCount - 1);
//     int idx = int(floor(scaled));
//     float f = fract(scaled);
//     int idx2 = min(idx + 1, lineGradientCount - 1);

//     vec3 c1 = lineGradient[idx];
//     vec3 c2 = lineGradient[idx2];

//     gradientColor = mix(c1, c2, f);
//   }

//   return gradientColor * 0.5;
// }

//   float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
//   float time = iTime * animationSpeed;

//   float x_offset   = offset;
//   float x_movement = time * 0.1;
//   float amp        = sin(offset + time * 0.2) * 0.3;
//   float y          = sin(uv.x + x_offset + x_movement) * amp;

//   if (shouldBend) {
//     vec2 d = screenUv - mouseUv;
//     float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
//     float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
//     y += bendOffset;
//   }

//   float m = uv.y - y;
//   return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
// }

// void mainImage(out vec4 fragColor, in vec2 fragCoord) {
//   vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
//   baseUv.y *= -1.0;

//   if (parallax) {
//     baseUv += parallaxOffset;
//   }

//   vec3 col = vec3(0.0);

//   vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

//   vec2 mouseUv = vec2(0.0);
//   if (interactive) {
//     mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
//     mouseUv.y *= -1.0;
//   }

//   if (enableBottom) {
//     for (int i = 0; i < bottomLineCount; ++i) {
//       float fi = float(i);
//       float t = fi / max(float(bottomLineCount - 1), 1.0);
//       vec3 lineCol = getLineColor(t, b);

//       float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
//       vec2 ruv = baseUv * rotate(angle);
//       col += lineCol * wave(
//         ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
//         1.5 + 0.2 * fi,
//         baseUv,
//         mouseUv,
//         interactive
//       ) * 0.2;
//     }
//   }

//   if (enableMiddle) {
//     for (int i = 0; i < middleLineCount; ++i) {
//       float fi = float(i);
//       float t = fi / max(float(middleLineCount - 1), 1.0);
//       vec3 lineCol = getLineColor(t, b);

//       float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
//       vec2 ruv = baseUv * rotate(angle);
//       col += lineCol * wave(
//         ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
//         2.0 + 0.15 * fi,
//         baseUv,
//         mouseUv,
//         interactive
//       );
//     }
//   }

//   if (enableTop) {
//     for (int i = 0; i < topLineCount; ++i) {
//       float fi = float(i);
//       float t = fi / max(float(topLineCount - 1), 1.0);
//       vec3 lineCol = getLineColor(t, b);

//       float angle = topWavePosition.z * log(length(baseUv) + 1.0);
//       vec2 ruv = baseUv * rotate(angle);
//       ruv.x *= -1.0;
//       col += lineCol * wave(
//         ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
//         1.0 + 0.2 * fi,
//         baseUv,
//         mouseUv,
//         interactive
//       ) * 0.1;
//     }
//   }

//   if (lightMode) {
//     float lineBright = max(col.r, max(col.g, col.b));

//     // Wide soft mask — preserves the beautiful glow falloff like dark mode
//     float mask = smoothstep(0.03, 0.5, lineBright);

//     // Boost the raw accumulated color
//     vec3 boosted = col * 2.5;
//     // Tone-map: prevents overlap areas from blowing out to white
//     // Single lines stay vivid; overlaps compress into deeper saturated color
//     boosted = boosted / (boosted + vec3(0.35));

//     // Subtle cool-white ambient in the glow zone
//     vec3 ambient = vec3(0.93, 0.96, 1.0);
//     vec3 base = mix(bgColor, ambient, mask * 0.1);

//     vec3 finalColor = mix(base, boosted, mask);
//     fragColor = vec4(finalColor, 1.0);
//   } else {
//     // Dark mode: keep additive glow (works with screen blend)
//     fragColor = vec4(col, 1.0);
//   }
// }

// void main() {
//   vec4 color = vec4(0.0);
//   mainImage(color, gl_FragCoord.xy);
//   gl_FragColor = color;
// }
// `;

// const MAX_GRADIENT_STOPS = 8;

// function hexToVec3(hex) {
//   let value = hex.trim();

//   if (value.startsWith('#')) {
//     value = value.slice(1);
//   }

//   let r = 255;
//   let g = 255;
//   let b = 255;

//   if (value.length === 3) {
//     r = parseInt(value[0] + value[0], 16);
//     g = parseInt(value[1] + value[1], 16);
//     b = parseInt(value[2] + value[2], 16);
//   } else if (value.length === 6) {
//     r = parseInt(value.slice(0, 2), 16);
//     g = parseInt(value.slice(2, 4), 16);
//     b = parseInt(value.slice(4, 6), 16);
//   }

//   return new Vector3(r / 255, g / 255, b / 255);
// }

// export default function FloatingLines({
//   linesGradient,
//   enabledWaves = ['top', 'middle', 'bottom'],
//   lineCount = [6],
//   lineDistance = [5],
//   topWavePosition,
//   middleWavePosition,
//   bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
//   animationSpeed = 1,
//   interactive = true,
//   bendRadius = 5.0,
//   bendStrength = -0.5,
//   mouseDamping = 0.05,
//   parallax = true,
//   parallaxStrength = 0.2,
//   mixBlendMode = 'screen',
//   backgroundColor = '#000000'
// }) {
//   const containerRef = useRef(null);
//   const targetMouseRef = useRef(new Vector2(-1000, -1000));
//   const currentMouseRef = useRef(new Vector2(-1000, -1000));
//   const targetInfluenceRef = useRef(0);
//   const currentInfluenceRef = useRef(0);
//   const targetParallaxRef = useRef(new Vector2(0, 0));
//   const currentParallaxRef = useRef(new Vector2(0, 0));

//   const getLineCount = waveType => {
//     if (typeof lineCount === 'number') return lineCount;
//     if (!enabledWaves.includes(waveType)) return 0;
//     const index = enabledWaves.indexOf(waveType);
//     return lineCount[index] ?? 6;
//   };

//   const getLineDistance = waveType => {
//     if (typeof lineDistance === 'number') return lineDistance;
//     if (!enabledWaves.includes(waveType)) return 0.1;
//     const index = enabledWaves.indexOf(waveType);
//     return lineDistance[index] ?? 0.1;
//   };

//   const topLineCount = enabledWaves.includes('top') ? getLineCount('top') : 0;
//   const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0;
//   const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;

//   const topLineDistance = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;
//   const middleLineDistance = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
//   const bottomLineDistance = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     let active = true;

//     const scene = new Scene();

//     const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
//     camera.position.z = 1;

//     const renderer = new WebGLRenderer({ antialias: true, alpha: false });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
//     renderer.domElement.style.width = '100%';
//     renderer.domElement.style.height = '100%';
//     container.appendChild(renderer.domElement);

//     const uniforms = {
//       iTime: { value: 0 },
//       iResolution: { value: new Vector3(1, 1, 1) },
//       animationSpeed: { value: animationSpeed },

//       enableTop: { value: enabledWaves.includes('top') },
//       enableMiddle: { value: enabledWaves.includes('middle') },
//       enableBottom: { value: enabledWaves.includes('bottom') },

//       topLineCount: { value: topLineCount },
//       middleLineCount: { value: middleLineCount },
//       bottomLineCount: { value: bottomLineCount },

//       topLineDistance: { value: topLineDistance },
//       middleLineDistance: { value: middleLineDistance },
//       bottomLineDistance: { value: bottomLineDistance },

//       topWavePosition: {
//         value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4)
//       },
//       middleWavePosition: {
//         value: new Vector3(
//           middleWavePosition?.x ?? 5.0,
//           middleWavePosition?.y ?? 0.0,
//           middleWavePosition?.rotate ?? 0.2
//         )
//       },
//       bottomWavePosition: {
//         value: new Vector3(
//           bottomWavePosition?.x ?? 2.0,
//           bottomWavePosition?.y ?? -0.7,
//           bottomWavePosition?.rotate ?? 0.4
//         )
//       },

//       iMouse: { value: new Vector2(-1000, -1000) },
//       interactive: { value: interactive },
//       bendRadius: { value: bendRadius },
//       bendStrength: { value: bendStrength },
//       bendInfluence: { value: 0 },

//       parallax: { value: parallax },
//       parallaxStrength: { value: parallaxStrength },
//       parallaxOffset: { value: new Vector2(0, 0) },

//       lineGradient: {
//         value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))
//       },
//       lineGradientCount: { value: 0 },

//       bgColor: { value: hexToVec3(backgroundColor) },
//       lightMode: { value: backgroundColor !== '#000000' }
//     };

//     if (linesGradient && linesGradient.length > 0) {
//       const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
//       uniforms.lineGradientCount.value = stops.length;

//       stops.forEach((hex, i) => {
//         const color = hexToVec3(hex);
//         uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
//       });
//     }

//     const material = new ShaderMaterial({
//       uniforms,
//       vertexShader,
//       fragmentShader
//     });

//     const geometry = new PlaneGeometry(2, 2);
//     const mesh = new Mesh(geometry, material);
//     scene.add(mesh);

//     const clock = new Timer();

//     const setSize = () => {
//       if (!active) return;
//       const width = container.clientWidth || 1;
//       const height = container.clientHeight || 1;

//       renderer.setSize(width, height, false);

//       const canvasWidth = renderer.domElement.width;
//       const canvasHeight = renderer.domElement.height;
//       uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);
//     };

//     setSize();

//     const ro =
//       typeof ResizeObserver !== 'undefined'
//         ? new ResizeObserver(() => {
//           if (!active) return;
//           setSize();
//         })
//         : null;

//     if (ro) ro.observe(container);

//     const handlePointerMove = event => {
//       const rect = renderer.domElement.getBoundingClientRect();
//       const x = event.clientX - rect.left;
//       const y = event.clientY - rect.top;
//       const dpr = renderer.getPixelRatio();

//       targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
//       targetInfluenceRef.current = 1.0;

//       if (parallax) {
//         const centerX = rect.width / 2;
//         const centerY = rect.height / 2;
//         const offsetX = (x - centerX) / rect.width;
//         const offsetY = -(y - centerY) / rect.height;
//         targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
//       }
//     };

//     const handlePointerLeave = () => {
//       targetInfluenceRef.current = 0.0;
//     };

//     if (interactive) {
//       renderer.domElement.addEventListener('pointermove', handlePointerMove);
//       renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
//     }

//     let raf = 0;
//     const renderLoop = () => {
//       if (!active) return;

//       clock.update();
//       uniforms.iTime.value = clock.getElapsed();

//       if (interactive) {
//         currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
//         uniforms.iMouse.value.copy(currentMouseRef.current);

//         currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
//         uniforms.bendInfluence.value = currentInfluenceRef.current;
//       }

//       if (parallax) {
//         currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
//         uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
//       }

//       renderer.render(scene, camera);
//       raf = requestAnimationFrame(renderLoop);
//     };
//     renderLoop();

//     return () => {
//       active = false;

//       cancelAnimationFrame(raf);

//       if (ro) ro.disconnect();

//       if (interactive) {
//         renderer.domElement.removeEventListener('pointermove', handlePointerMove);
//         renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
//       }

//       geometry.dispose();
//       material.dispose();
//       renderer.dispose();
//       renderer.forceContextLoss();
//       if (renderer.domElement.parentElement) {
//         renderer.domElement.parentElement.removeChild(renderer.domElement);
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     linesGradient,
//     enabledWaves,
//     lineCount,
//     lineDistance,
//     topWavePosition,
//     middleWavePosition,
//     bottomWavePosition,
//     animationSpeed,
//     interactive,
//     bendRadius,
//     bendStrength,
//     mouseDamping,
//     parallax,
//     parallaxStrength,
//     backgroundColor
//   ]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-full overflow-hidden floating-lines-container"
//       style={{
//         mixBlendMode: mixBlendMode
//       }}
//     />
//   );
// }

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const MAX_COLORS = 8;

const hexToRGB = hex => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const prepColors = input => {
  const base = (input && input.length ? input : ['#A6C8FF', '#5227FF', '#FF9FFC']).slice(0, MAX_COLORS);
  const count = base.length;
  const arr = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  const avg = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 39; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(O * O));
    z += d;
  }
  return vec2(O.x, atan(O.z, O.y));
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  vec2 uv0 = (C + C - r) / r.x;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
  vec4 O = vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  for (int m = 0; m < 16; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
    C.x += Y.x / 8.0;
  }

  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
  o = vec4(colr, uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

const FloatingLines = ({
  className,
  dpr,
  paused = false,
  colors = ['#0d316b', '#1e0387', '#330032'],
  backgroundColor = '#0A29FF',
  speed = 0.5,
  streakCount = 3,
  streakWidth = 1,
  streakLength = 0.9,
  glow = 0.7,
  density = 0.6,
  twinkle = 1,
  zoom = 1,
  backgroundGlow = 0.4,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.5,
  mouseRadius = 1,
  mouseDampening = 0.15,
  mixBlendMode
}) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseTargetRef = useRef([0, 0]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const { arr, count, avg } = prepColors(colors);

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uBgColor: { value: hexToRGB(backgroundColor) },
      uMouseColor: { value: avg },
      uSpeed: { value: speed },
      uStreakCount: { value: Math.max(1, Math.min(16, Math.round(streakCount))) },
      uStreakWidth: { value: streakWidth },
      uStreakLength: { value: streakLength },
      uGlow: { value: glow },
      uDensity: { value: density },
      uTwinkle: { value: twinkle },
      uZoom: { value: zoom },
      uBgGlow: { value: backgroundGlow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius }
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = e => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    if (mouseInteraction) {
      canvas.addEventListener('pointermove', onPointerMove);
    }

    const loop = t => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mouseInteraction) canvas.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj, key) => {
        if (obj && typeof obj[key] === 'function') {
          obj[key].call(obj);
        }
      };
      callIfFn(programRef.current, 'remove');
      callIfFn(geometryRef.current, 'remove');
      callIfFn(meshRef.current, 'remove');
      callIfFn(rendererRef.current, 'destroy');
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    paused,
    colors,
    backgroundColor,
    speed,
    streakCount,
    streakWidth,
    streakLength,
    glow,
    density,
    twinkle,
    zoom,
    backgroundGlow,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    mouseDampening
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden relative ${className ?? ''}`}
      style={{
        ...(mixBlendMode && { mixBlendMode })
      }}
    />
  );
};

export default FloatingLines;

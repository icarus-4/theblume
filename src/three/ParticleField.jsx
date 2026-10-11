import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { tree, neuralSphere, cube, wave, helix, logoShape } from './shapes'

// One fixed, full-screen point cloud that morphs between shapes as the page
// scrolls. Sections opt in with data-shape="<index>" (and optional data-dim).
// Shape order: 0 tree · 1 neural sphere · 2 cube · 3 wave · 4 helix · 5 logo.

const vertex = /* glsl */ `
  attribute vec3 p0; attribute vec3 p1; attribute vec3 p2;
  attribute vec3 p3; attribute vec3 p4; attribute vec3 p5;
  attribute vec4 aRand;
  attribute vec3 aLogoCol;

  uniform float uShape;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3  uOffset[6];
  uniform float uScale[6];
  uniform vec3  uMouse;
  uniform float uMouseOn;

  varying vec3 vColor;
  varying float vAlpha;

  float eq(float a, float b) { return 1.0 - step(0.5, abs(a - b)); }

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }

  vec3 shapeAt(float k) {
    vec3 a = p0;
    // ripple rings at the base of the tree
    float ring = step(p0.y, -2.3);
    a.y += ring * sin(length(p0.xz) * 3.2 - uTime * 2.2) * 0.07;
    vec3 c = rotY(p2, uTime * 0.25);
    vec3 d = p3;
    d.y += sin(p3.x * 0.9 + uTime * 0.9) * 0.35 + cos(p3.z * 1.3 + uTime * 0.7) * 0.22;
    vec3 e = rotY(p4, uTime * 0.35);
    vec3 b = rotY(p1, uTime * 0.12);
    vec3 p = a * eq(k, 0.0) + b * eq(k, 1.0) + c * eq(k, 2.0)
           + d * eq(k, 3.0) + e * eq(k, 4.0) + p5 * eq(k, 5.0);
    vec3 off = uOffset[0] * eq(k, 0.0) + uOffset[1] * eq(k, 1.0) + uOffset[2] * eq(k, 2.0)
             + uOffset[3] * eq(k, 3.0) + uOffset[4] * eq(k, 4.0) + uOffset[5] * eq(k, 5.0);
    float sc = uScale[0] * eq(k, 0.0) + uScale[1] * eq(k, 1.0) + uScale[2] * eq(k, 2.0)
             + uScale[3] * eq(k, 3.0) + uScale[4] * eq(k, 4.0) + uScale[5] * eq(k, 5.0);
    return p * sc + off;
  }

  vec3 shapeColor(float k, vec3 p) {
    vec3 deep = vec3(0.07, 0.42, 0.20);
    vec3 leaf = vec3(0.50, 0.84, 0.42);
    vec3 mint = vec3(0.62, 1.0, 0.84);
    float h = clamp(p.y * 0.18 + 0.5, 0.0, 1.0);
    vec3 col = mix(deep, leaf, h);
    col = mix(col, mint, smoothstep(0.75, 1.0, aRand.z) * 0.6);
    // white sparks, like the logo's white strokes
    col = mix(col, vec3(1.0), step(0.93, aRand.x));
    return mix(col, aLogoCol * 1.1 + 0.05, eq(k, 5.0));
  }

  void main() {
    float base = floor(uShape);
    float f = uShape - base;
    // per-particle stagger so the morph ripples through the cloud
    float local = clamp((f - aRand.x * 0.35) / 0.65, 0.0, 1.0);
    local = local * local * (3.0 - 2.0 * local);
    float nextK = min(base + 1.0, 5.0);

    vec3 from = shapeAt(base);
    vec3 to = shapeAt(nextK);
    vec3 pos = mix(from, to, local);

    // burst outward mid-morph, then re-form
    vec3 dir = normalize(aRand.yzw - 0.5 + 0.0001);
    pos += dir * sin(local * 3.14159) * (0.6 + aRand.w * 0.9);

    // ambient drift
    pos += vec3(
      sin(uTime * 0.6 + aRand.y * 6.283),
      cos(uTime * 0.5 + aRand.z * 6.283),
      sin(uTime * 0.4 + aRand.w * 6.283)
    ) * 0.025;

    // cursor repulsion on the z=0 plane
    vec2 dm = pos.xy - uMouse.xy;
    float d = length(dm);
    pos.xy += normalize(dm + 0.0001) * smoothstep(1.3, 0.0, d) * 0.55 * uMouseOn;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = uSize * (0.45 + aRand.y * 0.9);
    size *= 1.0 + step(0.93, aRand.x) * 0.6;
    gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);

    vColor = mix(shapeColor(base, from), shapeColor(nextK, to), local);
    float twinkle = 0.75 + 0.25 * sin(uTime * 2.0 + aRand.z * 40.0);
    vAlpha = twinkle;
  }
`

const fragment = /* glsl */ `
  uniform float uDim;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    // bright core + soft halo reads as bloom without a post-process pass
    float core = smoothstep(0.18, 0.0, d);
    float halo = pow(smoothstep(0.5, 0.0, d), 2.2) * 0.55;
    float a = core + halo;
    vec3 col = mix(vColor, vec3(1.0), core * 0.35);
    gl_FragColor = vec4(col, a * vAlpha * uDim);
  }
`

// Where each shape sits on screen [x, y, z] and its scale, per breakpoint.
function layoutFor(width) {
  if (width < 760) {
    return {
      offsets: [[0, -0.9, 0], [0, 0.2, -1], [0, 1.2, -1], [0, 0, 0], [0, 0, -1], [0, 1.5, 0]],
      scales: [0.78, 0.8, 0.7, 0.6, 0.75, 0.5],
    }
  }
  return {
    offsets: [[2.2, -0.2, 0], [3.4, 0, -1], [3.0, 0.1, -0.5], [0, -0.4, 0], [-3.6, -2.0, -0.5], [0, 1.6, 0]],
    scales: [1, 1, 1.35, 1, 0.6, 0.55],
  }
}

export default function ParticleField({ reducedMotion }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const isSmall = window.innerWidth < 760
    const count = isSmall ? 9000 : 22000

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    const dpr = Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(window.innerWidth, window.innerHeight)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 10)

    const geo = new THREE.BufferGeometry()
    const shapes = [tree(count), neuralSphere(count), cube(count), wave(count), helix(count), neuralSphere(count)]
    shapes.forEach((arr, i) => geo.setAttribute(`p${i}`, new THREE.BufferAttribute(arr, 3)))
    geo.setAttribute('position', new THREE.BufferAttribute(shapes[0].slice(), 3))
    const rand = new Float32Array(count * 4)
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random()
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 4))
    geo.setAttribute('aLogoCol', new THREE.BufferAttribute(new Float32Array(count * 3).fill(0.5), 3))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50)

    const layout = layoutFor(window.innerWidth)
    const uniforms = {
      uShape: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: isSmall ? 3.2 : 3.4 },
      uPixelRatio: { value: dpr },
      uOffset: { value: layout.offsets.map((o) => new THREE.Vector3(...o)) },
      uScale: { value: layout.scales },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseOn: { value: 0 },
      uDim: { value: 1 },
    }
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Swap the placeholder last shape for the real logo once it loads.
    let disposed = false
    logoShape(count, `${import.meta.env.BASE_URL}logo.png`)
      .then((res) => {
        if (!res || disposed) return
        geo.setAttribute('p5', new THREE.BufferAttribute(res.positions, 3))
        geo.setAttribute('aLogoCol', new THREE.BufferAttribute(res.colors, 3))
      })
      .catch(() => {})

    // --- scroll → shape mapping -------------------------------------------
    let anchors = []
    const measure = () => {
      anchors = [...document.querySelectorAll('[data-shape]')].map((el) => {
        const r = el.getBoundingClientRect()
        return {
          c: r.top + window.scrollY + r.height / 2,
          s: Number(el.dataset.shape),
          dim: el.dataset.dim ? Number(el.dataset.dim) : 1,
        }
      })
    }
    const smooth = (a, b, x) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
      return t * t * (3 - 2 * t)
    }
    const target = () => {
      if (!anchors.length) return { s: 0, dim: 1 }
      const v = window.scrollY + window.innerHeight / 2
      if (v <= anchors[0].c) return anchors[0]
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i]
        const b = anchors[i + 1]
        if (v < b.c) {
          const t = smooth(0.3, 0.7, (v - a.c) / (b.c - a.c))
          return { s: a.s + (b.s - a.s) * t, dim: a.dim + (b.dim - a.dim) * t }
        }
      }
      return anchors[anchors.length - 1]
    }

    // --- input ------------------------------------------------------------
    const mouseNdc = new THREE.Vector2(9, 9)
    let mouseActive = false
    const onMove = (e) => {
      mouseNdc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      mouseActive = true
    }
    const onLeave = () => (mouseActive = false)
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (finePointer && !reducedMotion) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const l = layoutFor(w)
      l.offsets.forEach((o, i) => uniforms.uOffset.value[i].set(...o))
      uniforms.uScale.value = l.scales
      measure()
    }
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    measure()

    // --- loop -------------------------------------------------------------
    // frame-delta timer (seconds since the previous call)
    let last = performance.now()
    const delta = () => {
      const now = performance.now()
      const d = (now - last) / 1000
      last = now
      return d
    }
    const ray = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const hit = new THREE.Vector3()
    let shape = target().s
    let dim = 1
    let raf = 0
    let tilt = 0

    const frame = () => {
      const dt = Math.min(delta(), 0.05)
      const t = target()
      shape += (t.s - shape) * Math.min(1, dt * 4)
      dim += (t.dim - dim) * Math.min(1, dt * 4)
      uniforms.uShape.value = shape
      uniforms.uDim.value = dim
      uniforms.uTime.value += dt

      if (mouseActive) {
        ray.setFromCamera(mouseNdc, camera)
        if (ray.ray.intersectPlane(plane, hit)) uniforms.uMouse.value.copy(hit)
      }
      uniforms.uMouseOn.value += ((mouseActive ? 1 : 0) - uniforms.uMouseOn.value) * Math.min(1, dt * 3)

      // gentle parallax tilt toward the cursor
      const tx = mouseActive ? mouseNdc.y * 0.08 : 0
      tilt += (tx - tilt) * Math.min(1, dt * 2)
      points.rotation.x = tilt
      points.rotation.y += ((mouseActive ? mouseNdc.x * 0.15 : 0) - points.rotation.y) * Math.min(1, dt * 2)

      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }

    const renderStatic = () => {
      uniforms.uShape.value = Math.round(target().s)
      uniforms.uDim.value = 0.7
      renderer.render(scene, camera)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reducedMotion) {
        delta()
        raf = requestAnimationFrame(frame)
      }
    }

    if (reducedMotion) {
      renderStatic()
      window.addEventListener('scroll', renderStatic, { passive: true })
    } else {
      raf = requestAnimationFrame(frame)
      document.addEventListener('visibilitychange', onVisibility)
    }

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', renderStatic)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [reducedMotion])

  return <div ref={hostRef} className="particle-field" aria-hidden="true" />
}

'use client';

// ============================================================
// Roblox Asset AI - 3D WebGL Viewport (Three.js)
// Full Roblox primitive rendering, Studio grid, Orbit controls,
// dynamic animation playback, and camera auto-framing.
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RobloxModelIR,
  RobloxAnimationIR,
  RobloxPartIR,
  RobloxInstanceIR,
  RobloxShape,
  RobloxMaterial,
} from '@/lib/types/roblox';
import { ROBLOX_MATERIALS, normalizeColor } from '@/lib/roblox/materials';
import {
  Camera,
  RotateCcw,
  Grid,
  Sun,
  Play,
  Pause,
  Repeat,
  Eye,
  Maximize2,
} from 'lucide-react';

interface Viewport3DProps {
  modelIR?: RobloxModelIR | null;
  animationIR?: RobloxAnimationIR | null;
  onCaptureSnapshot?: (dataUrl: string) => void;
  className?: string;
}

export default function Viewport3D({
  modelIR,
  animationIR,
  onCaptureSnapshot,
  className = '',
}: Viewport3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js State Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Bone/Part Map for Animations
  const partsMeshMap = useRef<Map<string, THREE.Mesh>>(new Map());

  // Mouse Interaction / Orbit Controls state
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const cameraSpherical = useRef({ radius: 12, theta: Math.PI / 4, phi: Math.PI / 3 });
  const cameraTarget = useRef(new THREE.Vector3(0, 1.5, 0));

  // Viewport Settings
  const [showGrid, setShowGrid] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'outdoor' | 'neon'>('studio');

  // Animation Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loopAnimation, setLoopAnimation] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const animTimeRef = useRef(0);
  const animDurationRef = useRef(2.0);

  // Create Wedge Geometry (Right-angled triangular prism matching Roblox WedgePart)
  const createWedgeGeometry = useCallback((sx: number, sy: number, sz: number) => {
    const geometry = new THREE.BufferGeometry();
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;

    // 6 Vertices of a right-angled prism
    const v = [
      -hx, -hy,  hz, // 0: bottom front left
       hx, -hy,  hz, // 1: bottom front right
      -hx, -hy, -hz, // 2: bottom back left
       hx, -hy, -hz, // 3: bottom back right
      -hx,  hy, -hz, // 4: top back left
       hx,  hy, -hz, // 5: top back right
    ];

    const indices = [
      // Bottom face
      0, 1, 3,  0, 3, 2,
      // Back vertical face
      2, 3, 5,  2, 5, 4,
      // Slanted front face
      0, 5, 1,  0, 4, 5,
      // Left triangular face
      0, 2, 4,
      // Right triangular face
      1, 5, 3,
    ];

    const vertices: number[] = [];
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      vertices.push(v[idx * 3], v[idx * 3 + 1], v[idx * 3 + 2]);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1117);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true, // Needed for capturing snapshots
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.2);
    dirLight.position.set(12, 20, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    const d = 15;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const fillLight = new THREE.DirectionalLight(0x7590b8, 0.5);
    fillLight.position.set(-12, 10, -12);
    scene.add(fillLight);

    // Studio Grid (Roblox Studs: 1 grid unit = 1 stud)
    const gridHelper = new THREE.GridHelper(40, 40, 0x00A2FF, 0x222a38);
    gridHelper.position.y = 0;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // Ground plane for shadows
    const shadowPlaneGeo = new THREE.PlaneGeometry(60, 60);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Model Container Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Update Camera Position
    const updateCamera = () => {
      const { radius, theta, phi } = cameraSpherical.current;
      const x = cameraTarget.current.x + radius * Math.sin(phi) * Math.sin(theta);
      const y = cameraTarget.current.y + radius * Math.cos(phi);
      const z = cameraTarget.current.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.position.set(x, y, z);
      camera.lookAt(cameraTarget.current);
    };
    updateCamera();

    // Render loop
    let reqId: number;
    let lastTimestamp = performance.now();

    const animate = (timestamp: number) => {
      reqId = requestAnimationFrame(animate);
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Handle Animation Playback
      if (animationIR && animationIR.keyframes && animationIR.keyframes.length > 0) {
        if (animDurationRef.current <= 0) {
          animDurationRef.current = animationIR.length || 2.0;
        }

        if (isPlaying) {
          animTimeRef.current += delta * playbackSpeed;
          if (animTimeRef.current > animDurationRef.current) {
            if (loopAnimation) {
              animTimeRef.current = 0;
            } else {
              animTimeRef.current = animDurationRef.current;
              setIsPlaying(false);
            }
          }
          setCurrentTime(animTimeRef.current);
          applyAnimationAtTime(animTimeRef.current, animationIR);
        }
      }

      renderer.render(scene, camera);
    };
    reqId = requestAnimationFrame(animate);

    // Resize Observer
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Grid & Wireframe Visibility
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) mat.wireframe = wireframe;
      }
    });
  }, [wireframe]);

  // Interpolate and apply animation poses
  const applyAnimationAtTime = (time: number, anim: RobloxAnimationIR) => {
    if (!anim.keyframes || anim.keyframes.length === 0) return;

    // Find surrounding keyframes
    let kf0 = anim.keyframes[0];
    let kf1 = anim.keyframes[anim.keyframes.length - 1];

    for (let i = 0; i < anim.keyframes.length - 1; i++) {
      if (time >= anim.keyframes[i].time && time <= anim.keyframes[i + 1].time) {
        kf0 = anim.keyframes[i];
        kf1 = anim.keyframes[i + 1];
        break;
      }
    }

    const tSpan = Math.max(0.0001, kf1.time - kf0.time);
    const alpha = Math.min(1, Math.max(0, (time - kf0.time) / tSpan));

    // Map poses in kf0
    const pose0Map = new Map(kf0.poses.map((p) => [p.boneName, p]));
    const pose1Map = new Map(kf1.poses.map((p) => [p.boneName, p]));

    partsMeshMap.current.forEach((mesh, partName) => {
      const p0 = pose0Map.get(partName);
      const p1 = pose1Map.get(partName);

      if (p0 && p1) {
        const r0 = p0.rotation || [0, 0, 0];
        const r1 = p1.rotation || [0, 0, 0];
        const rad = Math.PI / 180;

        const rx = (r0[0] + (r1[0] - r0[0]) * alpha) * rad;
        const ry = (r0[1] + (r1[1] - r0[1]) * alpha) * rad;
        const rz = (r0[2] + (r1[2] - r0[2]) * alpha) * rad;

        // Apply rotation relative to original rest rotation stored in userData
        const restRot = mesh.userData.restRotation || new THREE.Euler();
        mesh.rotation.set(restRot.x + rx, restRot.y + ry, restRot.z + rz);

        const pos0 = p0.position || [0, 0, 0];
        const pos1 = p1.position || [0, 0, 0];
        const restPos = mesh.userData.restPosition || new THREE.Vector3();
        mesh.position.set(
          restPos.x + (pos0[0] + (pos1[0] - pos0[0]) * alpha),
          restPos.y + (pos0[1] + (pos1[1] - pos0[1]) * alpha),
          restPos.z + (pos0[2] + (pos1[2] - pos0[2]) * alpha)
        );
      }
    });
  };

  // Build Roblox 3D Meshes from Model IR
  useEffect(() => {
    if (!modelGroupRef.current || !sceneRef.current) return;
    const group = modelGroupRef.current;

    // Clear previous objects
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    }
    partsMeshMap.current.clear();

    if (!modelIR || !modelIR.instances || modelIR.instances.length === 0) return;

    // Collect all parts
    const parts: RobloxPartIR[] = [];
    const traverse = (inst: RobloxInstanceIR) => {
      if (inst.className === 'Part' || inst.className === 'WedgePart' || inst.className === 'MeshPart') {
        parts.push(inst as RobloxPartIR);
      }
      if (inst.children) {
        inst.children.forEach(traverse);
      }
    };
    modelIR.instances.forEach(traverse);

    // Build Meshes
    for (const part of parts) {
      const [sx, sy, sz] = part.size || [2, 2, 2];
      const shape: RobloxShape = part.shape || (part.className === 'WedgePart' ? 'Wedge' : 'Block');

      let geometry: THREE.BufferGeometry;
      if (shape === 'Wedge' || part.className === 'WedgePart') {
        geometry = createWedgeGeometry(sx, sy, sz);
      } else if (shape === 'Cylinder') {
        // Roblox cylinders are oriented along X/Z axis depending on orientation
        geometry = new THREE.CylinderGeometry(sy / 2, sy / 2, sx, 32);
        geometry.rotateZ(Math.PI / 2); // align to Roblox standard Part cylinder orientation
      } else if (shape === 'Ball') {
        geometry = new THREE.SphereGeometry(Math.max(sx, sy, sz) / 2, 32, 24);
      } else {
        // Standard Block
        geometry = new THREE.BoxGeometry(sx, sy, sz);
      }

      // Material
      const [r, g, b] = normalizeColor(part.color || [160, 160, 160]);
      const matProps = ROBLOX_MATERIALS[part.material] || ROBLOX_MATERIALS.SmoothPlastic;
      const isNeon = part.material === 'Neon' || matProps.emissive;

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(r, g, b),
        roughness: matProps.roughness ?? 0.5,
        metalness: matProps.metalness ?? 0.0,
        wireframe,
        transparent: (part.transparency || 0) > 0 || matProps.transparentDefault !== undefined,
        opacity: 1.0 - (part.transparency ?? 0),
        emissive: isNeon ? new THREE.Color(r, g, b) : new THREE.Color(0, 0, 0),
        emissiveIntensity: isNeon ? 0.9 : 0.0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const [px, py, pz] = part.position || [0, 0, 0];
      const [rx, ry, rz] = part.rotation || [0, 0, 0];
      const rad = Math.PI / 180;

      mesh.position.set(px, py, pz);
      mesh.rotation.set(rx * rad, ry * rad, rz * rad);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Store initial rest transform for animation interpolation
      mesh.userData = {
        name: part.name,
        restPosition: mesh.position.clone(),
        restRotation: mesh.rotation.clone(),
      };

      partsMeshMap.current.set(part.name, mesh);
      group.add(mesh);
    }

    // Auto-frame Camera to fit Model
    const box = new THREE.Box3().setFromObject(group);
    if (!box.isEmpty()) {
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      cameraTarget.current.copy(center);
      const maxDim = Math.max(size.x, size.y, size.z, 2);
      cameraSpherical.current.radius = Math.max(maxDim * 2.4, 6);

      const { radius, theta, phi } = cameraSpherical.current;
      if (cameraRef.current) {
        cameraRef.current.position.set(
          center.x + radius * Math.sin(phi) * Math.sin(theta),
          center.y + radius * Math.cos(phi),
          center.z + radius * Math.sin(phi) * Math.cos(theta)
        );
        cameraRef.current.lookAt(center);
      }
    }
  }, [modelIR, createWedgeGeometry, wireframe]);

  // Reset Camera View
  const handleResetCamera = () => {
    cameraSpherical.current = { radius: 10, theta: Math.PI / 4, phi: Math.PI / 3 };
    cameraTarget.current.set(0, 1.5, 0);
    if (cameraRef.current) {
      const { radius, theta, phi } = cameraSpherical.current;
      cameraRef.current.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        1.5 + radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      cameraRef.current.lookAt(cameraTarget.current);
    }
  };

  // Capture Canvas Screenshot
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    if (onCaptureSnapshot) {
      onCaptureSnapshot(dataUrl);
    }
    return dataUrl;
  };

  // 1-Click Download Render Screenshot PNG
  const handleDownloadSnapshot = () => {
    const dataUrl = handleCaptureSnapshot();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${modelIR?.name || 'RobloxAsset'}-render.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Quick Camera Angles
  const setCameraAngle = (type: 'iso' | 'front' | 'top') => {
    if (!cameraRef.current) return;
    if (type === 'iso') {
      cameraSpherical.current.theta = Math.PI / 4;
      cameraSpherical.current.phi = Math.PI / 3;
    } else if (type === 'front') {
      cameraSpherical.current.theta = 0;
      cameraSpherical.current.phi = Math.PI / 2.2;
    } else if (type === 'top') {
      cameraSpherical.current.theta = 0;
      cameraSpherical.current.phi = 0.08;
    }
    const { radius, theta, phi } = cameraSpherical.current;
    const target = cameraTarget.current;
    cameraRef.current.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta)
    );
    cameraRef.current.lookAt(target);
  };

  // Cycle Lighting Presets
  const cycleLighting = () => {
    const presets: ('studio' | 'outdoor' | 'neon')[] = ['studio', 'outdoor', 'neon'];
    const nextIdx = (presets.indexOf(lightingPreset) + 1) % presets.length;
    setLightingPreset(presets[nextIdx]);
  };

  // Mouse Interaction handlers (Orbit, Pan, Zoom)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) isDraggingRef.current = true;
    if (e.button === 2) isRightDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = e.clientX - prevMousePos.current.x;
    const dy = e.clientY - prevMousePos.current.y;
    prevMousePos.current = { x: e.clientX, y: e.clientY };

    if (isDraggingRef.current && cameraRef.current) {
      // Left click orbit
      cameraSpherical.current.theta -= dx * 0.008;
      cameraSpherical.current.phi = Math.max(
        0.05,
        Math.min(Math.PI / 2 - 0.02, cameraSpherical.current.phi - dy * 0.008)
      );

      const { radius, theta, phi } = cameraSpherical.current;
      const target = cameraTarget.current;
      cameraRef.current.position.set(
        target.x + radius * Math.sin(phi) * Math.sin(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.cos(theta)
      );
      cameraRef.current.lookAt(target);
    } else if (isRightDraggingRef.current && cameraRef.current) {
      // Right click pan
      const panSpeed = 0.015;
      const forward = new THREE.Vector3();
      cameraRef.current.getWorldDirection(forward);
      const right = new THREE.Vector3().crossVectors(forward, cameraRef.current.up).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();

      cameraTarget.current.addScaledVector(right, -dx * panSpeed);
      cameraTarget.current.addScaledVector(up, dy * panSpeed);

      const { radius, theta, phi } = cameraSpherical.current;
      const target = cameraTarget.current;
      cameraRef.current.position.set(
        target.x + radius * Math.sin(phi) * Math.sin(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.cos(theta)
      );
      cameraRef.current.lookAt(target);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isRightDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.01;
    cameraSpherical.current.radius = Math.max(1.5, Math.min(60, cameraSpherical.current.radius + zoomDelta));

    const { radius, theta, phi } = cameraSpherical.current;
    const target = cameraTarget.current;
    cameraRef.current.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta)
    );
    cameraRef.current.lookAt(target);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[420px] bg-studio-950 rounded-xl overflow-hidden border border-studio-800 select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Viewport Top Toolbar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 bg-studio-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-studio-800 pointer-events-auto shadow-lg text-xs text-studio-200">
          <span className="font-semibold text-roblox-blue uppercase tracking-wider text-[11px]">
            {modelIR?.name || 'Studio Viewport'}
          </span>
          {modelIR?.instances && (
            <span className="text-studio-400">
              • {modelIR.instances.length} Parts
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-studio-900/90 backdrop-blur-md p-1 rounded-lg border border-studio-800 pointer-events-auto shadow-lg text-xs">
          {/* Camera Angles */}
          <div className="flex items-center bg-studio-950/80 rounded p-0.5 border border-studio-800 text-[10px] font-mono">
            <button
              onClick={() => setCameraAngle('iso')}
              title="Isometric 3D View"
              className="px-1.5 py-0.5 rounded text-studio-300 hover:text-white hover:bg-studio-850 transition"
            >
              Iso
            </button>
            <button
              onClick={() => setCameraAngle('front')}
              title="Front Ortho View"
              className="px-1.5 py-0.5 rounded text-studio-300 hover:text-white hover:bg-studio-850 transition"
            >
              Front
            </button>
            <button
              onClick={() => setCameraAngle('top')}
              title="Top Ortho View"
              className="px-1.5 py-0.5 rounded text-studio-300 hover:text-white hover:bg-studio-850 transition"
            >
              Top
            </button>
          </div>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            title="Reset Camera Position"
            className="p-1.5 text-studio-400 hover:text-studio-100 hover:bg-studio-800 rounded transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Studio 1-Stud Grid"
            className={`p-1.5 rounded transition ${
              showGrid ? 'text-roblox-blue bg-studio-800' : 'text-studio-400 hover:text-studio-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Wireframe */}
          <button
            onClick={() => setWireframe(!wireframe)}
            title="Toggle Wireframe Mode"
            className={`p-1.5 rounded transition ${
              wireframe ? 'text-roblox-yellow bg-studio-800' : 'text-studio-400 hover:text-studio-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Lighting Mode */}
          <button
            onClick={cycleLighting}
            title={`Cycle Lighting Preset (Current: ${lightingPreset})`}
            className="p-1.5 text-studio-400 hover:text-amber-300 hover:bg-studio-800 rounded transition flex items-center gap-1"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="text-[10px] capitalize font-mono">{lightingPreset}</span>
          </button>

          {/* 1-Click Render PNG Download */}
          <button
            onClick={handleDownloadSnapshot}
            title="Download HD Viewport Render Screenshot (.png)"
            className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-studio-800 rounded transition flex items-center gap-1 font-mono text-[10px]"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Render</span>
          </button>
        </div>
      </div>

      {/* Animation Playback Bar (When viewing animations) */}
      {animationIR && (
        <div className="absolute bottom-3 left-3 right-3 bg-studio-900/95 backdrop-blur-md p-2.5 rounded-xl border border-studio-800 shadow-2xl flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center justify-between text-xs text-studio-300">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-roblox-blue hover:bg-roblox-blue/90 text-white transition shadow"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => setLoopAnimation(!loopAnimation)}
                className={`p-1.5 rounded transition ${
                  loopAnimation ? 'text-roblox-blue bg-studio-800' : 'text-studio-500'
                }`}
                title="Loop"
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-studio-200">
                {currentTime.toFixed(2)}s / {(animationIR.length || 2.0).toFixed(2)}s
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-studio-400 text-[11px]">Speed:</span>
              {[0.5, 1.0, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                    playbackSpeed === speed
                      ? 'bg-studio-750 text-white font-medium'
                      : 'text-studio-400 hover:text-studio-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Scrub Slider */}
          <input
            type="range"
            min={0}
            max={animationIR.length || 2.0}
            step={0.02}
            value={currentTime}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              animTimeRef.current = val;
              applyAnimationAtTime(val, animationIR);
            }}
            className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-roblox-blue"
          />
        </div>
      )}

      {/* Instructions Overlay Helper */}
      <div className="absolute bottom-3 left-4 pointer-events-none opacity-40 hover:opacity-100 transition text-[11px] text-studio-400">
        Left-drag: Orbit • Right-drag: Pan • Scroll: Zoom
      </div>
    </div>
  );
}

'use client';

// ============================================================
// Roblox Asset AI - 3D WebGL Viewport (Three.js)
// Roblox Studio Baseplate, Authentic R6 Character Rig & Animation Viewer,
// SelectionBox Highlighting, Keyframe Timeline, PBR Materials & Shaders
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RobloxModelIR,
  RobloxAnimationIR,
  RobloxPartIR,
  RobloxInstanceIR,
  RobloxShape,
  RobloxKeyframeIR,
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
  Maximize2,
  SkipBack,
  SkipForward,
  Box,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Viewport3DProps {
  modelIR?: RobloxModelIR | null;
  animationIR?: RobloxAnimationIR | null;
  onCaptureSnapshot?: (dataUrl: string) => void;
  className?: string;
}

// Normalize bone names across any casing, spacing, or naming styles
function normalizeBoneName(name: string): string {
  const clean = name.toLowerCase().replace(/[\s_\-]/g, '');
  if (clean.includes('rightarm') || clean.includes('rarm') || clean.includes('rightupperarm') || clean.includes('rhand')) return 'RightArm';
  if (clean.includes('leftarm') || clean.includes('larm') || clean.includes('leftupperarm') || clean.includes('lhand')) return 'LeftArm';
  if (clean.includes('head') || clean.includes('face') || clean.includes('neck')) return 'Head';
  if (clean.includes('torso') || clean.includes('root') || clean.includes('body') || clean.includes('waist') || clean.includes('humanoidrootpart')) return 'Torso';
  if (clean.includes('rightleg') || clean.includes('rleg') || clean.includes('rightupperleg') || clean.includes('rfoot')) return 'RightLeg';
  if (clean.includes('leftleg') || clean.includes('lleg') || clean.includes('leftupperleg') || clean.includes('lfoot')) return 'LeftLeg';
  return name;
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
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.Group | null>(null);
  const selectionBoxRef = useRef<THREE.BoxHelper | null>(null);

  // Maps for joint articulation & animation
  const rigPivotsMap = useRef<Map<string, THREE.Group>>(new Map());
  const partsMeshMap = useRef<Map<string, THREE.Mesh>>(new Map());

  // Mouse Interaction / Orbit Controls state
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const cameraSpherical = useRef({ radius: 14, theta: Math.PI / 4, phi: Math.PI / 3 });
  const cameraTarget = useRef(new THREE.Vector3(0, 2.5, 0));

  // Selection & HUD State
  const [selectedPart, setSelectedPart] = useState<RobloxPartIR | null>(null);

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

  // Synchronization refs for requestAnimationFrame render loop
  const isPlayingRef = useRef(false);
  const animationIRRef = useRef<RobloxAnimationIR | null | undefined>(animationIR);
  const playbackSpeedRef = useRef(1.0);
  const loopAnimationRef = useRef(true);

  // Keep refs in sync with props/state
  const togglePlay = useCallback(() => {
    const next = !isPlayingRef.current;
    isPlayingRef.current = next;
    setIsPlaying(next);
  }, []);

  const updatePlaybackSpeed = useCallback((speed: number) => {
    playbackSpeedRef.current = speed;
    setPlaybackSpeed(speed);
  }, []);

  const toggleLoop = useCallback(() => {
    const next = !loopAnimationRef.current;
    loopAnimationRef.current = next;
    setLoopAnimation(next);
  }, []);

  // Create Wedge Geometry (Right-angled triangular prism matching Roblox WedgePart)
  const createWedgeGeometry = useCallback((sx: number, sy: number, sz: number) => {
    const geometry = new THREE.BufferGeometry();
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;

    const v = [
      -hx, -hy,  hz, // 0: bottom front left
       hx, -hy,  hz, // 1: bottom front right
      -hx, -hy, -hz, // 2: bottom back left
       hx, -hy, -hz, // 3: bottom back right
      -hx,  hy, -hz, // 4: top back left
       hx,  hy, -hz, // 5: top back right
    ];

    const indices = [
      0, 1, 3,  0, 3, 2, // bottom
      2, 3, 5,  2, 5, 4, // back
      0, 5, 1,  0, 4, 5, // slope
      0, 2, 4,          // left
      1, 5, 3,          // right
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

  // Build authentic Roblox Studio Baseplate with stud grid
  const createRobloxBaseplate = useCallback(() => {
    const baseplateGroup = new THREE.Group();

    // Floor Plate
    const floorGeo = new THREE.BoxGeometry(64, 0.4, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x161922,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.2;
    floor.receiveShadow = true;
    baseplateGroup.add(floor);

    // Primary 1-stud grid
    const grid1Stud = new THREE.GridHelper(64, 64, 0x00a2ff, 0x222a38);
    grid1Stud.position.y = 0.01;
    (grid1Stud.material as THREE.Material).transparent = true;
    (grid1Stud.material as THREE.Material).opacity = 0.45;
    baseplateGroup.add(grid1Stud);

    // Major 4-stud grid
    const grid4Stud = new THREE.GridHelper(64, 16, 0x00d2ff, 0x334460);
    grid4Stud.position.y = 0.02;
    (grid4Stud.material as THREE.Material).transparent = true;
    (grid4Stud.material as THREE.Material).opacity = 0.75;
    baseplateGroup.add(grid4Stud);

    return baseplateGroup;
  }, []);

  // Construct Authentic Roblox R6 Avatar Mannequin Rig
  const buildRobloxMannequin = useCallback(() => {
    const rigRoot = new THREE.Group();
    rigRoot.name = 'RobloxMannequinR6';
    rigPivotsMap.current.clear();

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf5cd2f, // Roblox classic bright yellow
      roughness: 0.4,
      metalness: 0.05,
    });

    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x0d69ac, // Roblox classic bright blue torso
      roughness: 0.5,
      metalness: 0.05,
    });

    const legMat = new THREE.MeshStandardMaterial({
      color: 0xa4bd47, // Roblox classic lime/green legs
      roughness: 0.5,
      metalness: 0.05,
    });

    // 1. Torso Pivot (Root joint at waist level Y=2.0)
    const torsoPivot = new THREE.Group();
    torsoPivot.position.set(0, 2.0, 0);
    torsoPivot.userData = { restPos: torsoPivot.position.clone(), restRot: torsoPivot.rotation.clone() };
    rigRoot.add(torsoPivot);
    rigPivotsMap.current.set('Torso', torsoPivot);

    // Torso Mesh: size [2, 2, 1], centered at local Y=1.0 (world Y=3.0)
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), torsoMat);
    torsoMesh.position.set(0, 1.0, 0);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    torsoMesh.userData = { name: 'Torso' };
    torsoPivot.add(torsoMesh);
    partsMeshMap.current.set('Torso', torsoMesh);

    // 2. Head Pivot (Neck at Y=2.0 relative to torso pivot = world Y=4.0)
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 2.0, 0);
    headPivot.userData = { restPos: headPivot.position.clone(), restRot: headPivot.rotation.clone() };
    torsoPivot.add(headPivot);
    rigPivotsMap.current.set('Head', headPivot);

    // Head Mesh: size [1.2, 1.2, 1.2], centered at local Y=0.6 (world Y=4.6)
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), skinMat);
    headMesh.position.set(0, 0.6, 0);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headMesh.userData = { name: 'Head' };
    headPivot.add(headMesh);
    partsMeshMap.current.set('Head', headMesh);

    // Head top stud (classic Roblox stud detail on head)
    const studMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16),
      skinMat
    );
    studMesh.position.set(0, 1.25, 0);
    headMesh.add(studMesh);

    // 3. Left Shoulder Pivot: at X=-1.5, Y=1.8 (relative to torso pivot = world Y=3.8)
    const leftShoulderPivot = new THREE.Group();
    leftShoulderPivot.position.set(-1.5, 1.8, 0);
    leftShoulderPivot.userData = { restPos: leftShoulderPivot.position.clone(), restRot: leftShoulderPivot.rotation.clone() };
    torsoPivot.add(leftShoulderPivot);
    rigPivotsMap.current.set('LeftArm', leftShoulderPivot);

    // Left Arm Mesh: size [1, 2, 1], offset down by Y=-0.9 so it rotates around shoulder!
    const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), skinMat);
    leftArmMesh.position.set(0, -0.9, 0);
    leftArmMesh.castShadow = true;
    leftArmMesh.receiveShadow = true;
    leftArmMesh.userData = { name: 'LeftArm' };
    leftShoulderPivot.add(leftArmMesh);
    partsMeshMap.current.set('LeftArm', leftArmMesh);

    // 4. Right Shoulder Pivot: at X=1.5, Y=1.8
    const rightShoulderPivot = new THREE.Group();
    rightShoulderPivot.position.set(1.5, 1.8, 0);
    rightShoulderPivot.userData = { restPos: rightShoulderPivot.position.clone(), restRot: rightShoulderPivot.rotation.clone() };
    torsoPivot.add(rightShoulderPivot);
    rigPivotsMap.current.set('RightArm', rightShoulderPivot);

    // Right Arm Mesh: size [1, 2, 1], offset down by Y=-0.9
    const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), skinMat);
    rightArmMesh.position.set(0, -0.9, 0);
    rightArmMesh.castShadow = true;
    rightArmMesh.receiveShadow = true;
    rightArmMesh.userData = { name: 'RightArm' };
    rightShoulderPivot.add(rightArmMesh);
    partsMeshMap.current.set('RightArm', rightArmMesh);

    // 5. Left Hip Pivot: at X=-0.5, Y=2.0 (world hip level)
    const leftHipPivot = new THREE.Group();
    leftHipPivot.position.set(-0.5, 2.0, 0);
    leftHipPivot.userData = { restPos: leftHipPivot.position.clone(), restRot: leftHipPivot.rotation.clone() };
    rigRoot.add(leftHipPivot);
    rigPivotsMap.current.set('LeftLeg', leftHipPivot);

    // Left Leg Mesh: size [1, 2, 1], offset down by Y=-1.0 (rests on ground Y=0)
    const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), legMat);
    leftLegMesh.position.set(0, -1.0, 0);
    leftLegMesh.castShadow = true;
    leftLegMesh.receiveShadow = true;
    leftLegMesh.userData = { name: 'LeftLeg' };
    leftHipPivot.add(leftLegMesh);
    partsMeshMap.current.set('LeftLeg', leftLegMesh);

    // 6. Right Hip Pivot: at X=0.5, Y=2.0
    const rightHipPivot = new THREE.Group();
    rightHipPivot.position.set(0.5, 2.0, 0);
    rightHipPivot.userData = { restPos: rightHipPivot.position.clone(), restRot: rightHipPivot.rotation.clone() };
    rigRoot.add(rightHipPivot);
    rigPivotsMap.current.set('RightLeg', rightHipPivot);

    // Right Leg Mesh: size [1, 2, 1], offset down by Y=-1.0
    const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), legMat);
    rightLegMesh.position.set(0, -1.0, 0);
    rightLegMesh.castShadow = true;
    rightLegMesh.receiveShadow = true;
    rightLegMesh.userData = { name: 'RightLeg' };
    rightHipPivot.add(rightLegMesh);
    partsMeshMap.current.set('RightLeg', rightLegMesh);

    return rigRoot;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0e14);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xb0d8ff, 0x242832, 0.6);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff6ea, 1.4);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    const d = 20;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x70a0ff, 0.6);
    rimLight.position.set(-15, 10, -15);
    scene.add(rimLight);

    // Studio Baseplate Grid
    const baseplate = createRobloxBaseplate();
    scene.add(baseplate);
    gridHelperRef.current = baseplate;

    // Groups for models and mannequins
    const modelGroup = new THREE.Group();
    modelGroup.name = 'UserAssetModel';
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const mannequinGroup = new THREE.Group();
    mannequinGroup.name = 'MannequinRigGroup';
    scene.add(mannequinGroup);
    mannequinGroupRef.current = mannequinGroup;

    // Initial Camera Position
    cameraSpherical.current = { radius: 14, theta: Math.PI / 4, phi: Math.PI / 3 };
    cameraTarget.current.set(0, 2.5, 0);
    const { radius, theta, phi } = cameraSpherical.current;
    camera.position.set(
      radius * Math.sin(phi) * Math.sin(theta),
      2.5 + radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    );
    camera.lookAt(cameraTarget.current);

    // Render & Animation Loop
    let reqId: number;
    let lastTimestamp = performance.now();

    const animate = (timestamp: number) => {
      reqId = requestAnimationFrame(animate);
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Handle Animation Playback (Live ref-driven playback prevents stale closures)
      const currentAnim = animationIRRef.current;
      if (currentAnim && currentAnim.keyframes && currentAnim.keyframes.length > 0) {
        if (animDurationRef.current <= 0) {
          animDurationRef.current = currentAnim.length || 2.0;
        }

        if (isPlayingRef.current) {
          animTimeRef.current += delta * playbackSpeedRef.current;
          if (animTimeRef.current > animDurationRef.current) {
            if (loopAnimationRef.current) {
              animTimeRef.current = 0;
            } else {
              animTimeRef.current = animDurationRef.current;
              isPlayingRef.current = false;
              setIsPlaying(false);
            }
          }
          setCurrentTime(animTimeRef.current);
          applyAnimationAtTime(animTimeRef.current, currentAnim);
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
  }, [createRobloxBaseplate]);

  // Interpolate and apply animation poses to articulated joints
  const applyAnimationAtTime = useCallback((time: number, anim: RobloxAnimationIR) => {
    if (!anim.keyframes || anim.keyframes.length === 0) return;

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

    // Map poses in kf0 & kf1 by normalized bone name
    const pose0Map = new Map<string, any>();
    const pose1Map = new Map<string, any>();
    kf0.poses.forEach((p) => pose0Map.set(normalizeBoneName(p.boneName), p));
    kf1.poses.forEach((p) => pose1Map.set(normalizeBoneName(p.boneName), p));

    const rad = Math.PI / 180;

    // Apply to Rig Joint Pivots with Easing
    rigPivotsMap.current.forEach((pivotGroup, normalizedBone) => {
      const p0 = pose0Map.get(normalizedBone);
      const p1 = pose1Map.get(normalizedBone);

      const restRot = (pivotGroup.userData.restRot as THREE.Euler) || new THREE.Euler();
      const restPos = (pivotGroup.userData.restPos as THREE.Vector3) || new THREE.Vector3();

      if (p0 && p1) {
        // Calculate eased alpha based on pose easing style & direction
        let easedAlpha = alpha;
        const style = p0.easingStyle || 'Sine';
        const dir = p0.easingDirection || 'Out';

        if (style === 'Sine') {
          if (dir === 'In') easedAlpha = 1 - Math.cos((alpha * Math.PI) / 2);
          else if (dir === 'Out') easedAlpha = Math.sin((alpha * Math.PI) / 2);
          else easedAlpha = -(Math.cos(Math.PI * alpha) - 1) / 2;
        } else if (style === 'Quad') {
          if (dir === 'In') easedAlpha = alpha * alpha;
          else if (dir === 'Out') easedAlpha = 1 - (1 - alpha) * (1 - alpha);
          else easedAlpha = alpha < 0.5 ? 2 * alpha * alpha : 1 - Math.pow(-2 * alpha + 2, 2) / 2;
        } else if (style === 'Cubic') {
          if (dir === 'In') easedAlpha = alpha * alpha * alpha;
          else if (dir === 'Out') easedAlpha = 1 - Math.pow(1 - alpha, 3);
          else easedAlpha = alpha < 0.5 ? 4 * alpha * alpha * alpha : 1 - Math.pow(-2 * alpha + 2, 3) / 2;
        } else if (style === 'Bounce') {
          if (dir === 'Out') {
            const n1 = 7.5625, d1 = 2.75;
            let a = alpha;
            if (a < 1 / d1) easedAlpha = n1 * a * a;
            else if (a < 2 / d1) easedAlpha = n1 * (a -= 1.5 / d1) * a + 0.75;
            else if (a < 2.5 / d1) easedAlpha = n1 * (a -= 2.25 / d1) * a + 0.9375;
            else easedAlpha = n1 * (a -= 2.625 / d1) * a + 0.984375;
          }
        }

        const r0 = p0.rotation || [0, 0, 0];
        const r1 = p1.rotation || [0, 0, 0];

        const rx = (r0[0] + (r1[0] - r0[0]) * easedAlpha) * rad;
        const ry = (r0[1] + (r1[1] - r0[1]) * easedAlpha) * rad;
        const rz = (r0[2] + (r1[2] - r0[2]) * easedAlpha) * rad;
        pivotGroup.rotation.set(restRot.x + rx, restRot.y + ry, restRot.z + rz);

        const pos0 = p0.position || [0, 0, 0];
        const pos1 = p1.position || [0, 0, 0];
        pivotGroup.position.set(
          restPos.x + (pos0[0] + (pos1[0] - pos0[0]) * easedAlpha),
          restPos.y + (pos0[1] + (pos1[1] - pos0[1]) * easedAlpha),
          restPos.z + (pos0[2] + (pos1[2] - pos0[2]) * easedAlpha)
        );
      } else {
        pivotGroup.rotation.copy(restRot);
        pivotGroup.position.copy(restPos);
      }
    });

    // Also update any standalone model parts if matched
    partsMeshMap.current.forEach((mesh, partName) => {
      const norm = normalizeBoneName(partName);
      if (rigPivotsMap.current.has(norm)) return; // Already articulated via pivot group!

      const p0 = pose0Map.get(norm);
      const p1 = pose1Map.get(norm);
      if (p0 && p1) {
        const r0 = p0.rotation || [0, 0, 0];
        const r1 = p1.rotation || [0, 0, 0];
        const rx = (r0[0] + (r1[0] - r0[0]) * alpha) * rad;
        const ry = (r0[1] + (r1[1] - r0[1]) * alpha) * rad;
        const rz = (r0[2] + (r1[2] - r0[2]) * alpha) * rad;
        const restRot = mesh.userData.restRotation || new THREE.Euler();
        mesh.rotation.set(restRot.x + rx, restRot.y + ry, restRot.z + rz);
      }
    });
  }, []);

  // Auto-play and reset timeline whenever a new animation is loaded
  useEffect(() => {
    if (animationIR && animationIR.keyframes && animationIR.keyframes.length > 0) {
      animDurationRef.current = animationIR.length || 2.0;
      animTimeRef.current = 0;
      setCurrentTime(0);
      setIsPlaying(true); // Automatically starts playing so user can view it immediately!
      applyAnimationAtTime(0, animationIR);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [animationIR, applyAnimationAtTime]);

  // Rebuild 3D Meshes when modelIR or animationIR changes
  useEffect(() => {
    if (!modelGroupRef.current || !mannequinGroupRef.current || !sceneRef.current) return;
    const modelGroup = modelGroupRef.current;
    const mannequinGroup = mannequinGroupRef.current;

    // Clear Previous Objects
    const clearGroup = (g: THREE.Group) => {
      while (g.children.length > 0) {
        const child = g.children[0];
        g.remove(child);
        if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      }
    };
    clearGroup(modelGroup);
    clearGroup(mannequinGroup);
    partsMeshMap.current.clear();
    rigPivotsMap.current.clear();

    const hasModelInstances = modelIR && modelIR.instances && modelIR.instances.length > 0;
    const isAnimationMode = !!(animationIR && animationIR.keyframes && animationIR.keyframes.length > 0);

    const isCharacterModel = hasModelInstances && modelIR!.instances.some((inst) => {
      const n = (inst.name || '').toLowerCase();
      return n.includes('head') || n.includes('torso') || n.includes('arm') || n.includes('leg');
    });

    // 1. If viewing animation and the model isn't an R6 character, spawn the authentic Roblox R6 Mannequin!
    let mannequinSpawned = false;
    if (isAnimationMode && !isCharacterModel) {
      const mannequin = buildRobloxMannequin();
      mannequinGroup.add(mannequin);
      mannequinSpawned = true;
    }

    // 2. Build Model Instances if present and appropriate
    // In animation mode, only render model instances if it is a character or a handheld accessory/weapon
    const shouldRenderModel = hasModelInstances && (!isAnimationMode || isCharacterModel || (
      modelIR?.name && ['sword', 'blade', 'shield', 'briefcase', 'wand', 'torch', 'gun'].some(w => modelIR.name.toLowerCase().includes(w))
    ));

    if (shouldRenderModel && modelIR) {
      const parts: RobloxPartIR[] = [];
      const traverse = (inst: RobloxInstanceIR) => {
        if (inst.className === 'Part' || inst.className === 'WedgePart' || inst.className === 'MeshPart') {
          parts.push(inst as RobloxPartIR);
        }
        if (inst.children) inst.children.forEach(traverse);
      };
      modelIR.instances.forEach(traverse);

      for (const part of parts) {
        const [sx, sy, sz] = part.size || [2, 2, 2];
        const shape: RobloxShape = part.shape || (part.className === 'WedgePart' ? 'Wedge' : 'Block');

        let geometry: THREE.BufferGeometry;
        if (shape === 'Wedge' || part.className === 'WedgePart') {
          geometry = createWedgeGeometry(sx, sy, sz);
        } else if (shape === 'Cylinder') {
          geometry = new THREE.CylinderGeometry(sy / 2, sy / 2, sx, 32);
          geometry.rotateZ(Math.PI / 2);
        } else if (shape === 'Ball') {
          geometry = new THREE.SphereGeometry(Math.max(sx, sy, sz) / 2, 32, 24);
        } else {
          geometry = new THREE.BoxGeometry(sx, sy, sz);
        }

        const [r, g, b] = normalizeColor(part.color || [160, 160, 160]);
        const matProps = ROBLOX_MATERIALS[part.material] || ROBLOX_MATERIALS.SmoothPlastic;
        const isNeon = part.material === 'Neon' || matProps.emissive;
        const isMetal = part.material === 'Metal' || part.material === 'DiamondPlate';
        const isGlass = part.material === 'Glass';

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(r, g, b),
          roughness: isGlass ? 0.1 : isMetal ? 0.25 : matProps.roughness ?? 0.5,
          metalness: isMetal ? 0.85 : matProps.metalness ?? 0.0,
          wireframe,
          transparent: (part.transparency || 0) > 0 || isGlass,
          opacity: isGlass ? 0.5 : 1.0 - (part.transparency ?? 0),
          emissive: isNeon ? new THREE.Color(r, g, b) : new THREE.Color(0, 0, 0),
          emissiveIntensity: isNeon ? 2.5 : 0.0,
        });

        const mesh = new THREE.Mesh(geometry, material);
        const [px, py, pz] = part.position || [0, 0, 0];
        const [rx, ry, rz] = part.rotation || [0, 0, 0];
        const rad = Math.PI / 180;

        mesh.position.set(px, py, pz);
        mesh.rotation.set(rx * rad, ry * rad, rz * rad);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData = {
          partData: part,
          name: part.name,
          restPosition: mesh.position.clone(),
          restRotation: mesh.rotation.clone(),
        };

        partsMeshMap.current.set(part.name, mesh);
        modelGroup.add(mesh);
      }
    }

    // Immediately articulate rig to current animation pose so initial frame is rendered
    if (isAnimationMode && animationIR) {
      applyAnimationAtTime(animTimeRef.current || 0, animationIR);
    }

    // Auto-frame Camera
    const targetGroup = mannequinSpawned ? mannequinGroup : modelGroup;
    const box = new THREE.Box3().setFromObject(targetGroup);
    if (!box.isEmpty()) {
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      cameraTarget.current.copy(center);
      const maxDim = Math.max(size.x, size.y, size.z, 2);
      cameraSpherical.current.radius = Math.max(maxDim * 2.5, 9);

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
  }, [modelIR, animationIR, buildRobloxMannequin, createWedgeGeometry, wireframe, applyAnimationAtTime]);

  // Update Grid Visibility
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Step between animation keyframes
  const handleStepKeyframe = useCallback((direction: 'prev' | 'next') => {
    const anim = animationIRRef.current;
    if (!anim?.keyframes || anim.keyframes.length === 0) return;
    const kfs = [...anim.keyframes].sort((a, b) => a.time - b.time);

    let targetKf = kfs[0];
    if (direction === 'next') {
      const next = kfs.find((kf) => kf.time > animTimeRef.current + 0.02);
      targetKf = next || kfs[0];
    } else {
      const prevs = kfs.filter((kf) => kf.time < animTimeRef.current - 0.02);
      targetKf = prevs.length > 0 ? prevs[prevs.length - 1] : kfs[kfs.length - 1];
    }

    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentTime(targetKf.time);
    animTimeRef.current = targetKf.time;
    applyAnimationAtTime(targetKf.time, anim);
  }, [applyAnimationAtTime]);

  // Keybindings (Spacebar = Play/Pause, ArrowLeft/Right = Step, F = Focus, R = Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepKeyframe('prev');
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepKeyframe('next');
      } else if (e.code === 'KeyF') {
        if (selectedPart && partsMeshMap.current.has(selectedPart.name)) {
          const mesh = partsMeshMap.current.get(selectedPart.name)!;
          const pos = new THREE.Vector3();
          mesh.getWorldPosition(pos);
          cameraTarget.current.copy(pos);
          if (cameraRef.current) cameraRef.current.lookAt(pos);
        } else {
          handleResetCamera();
        }
      } else if (e.code === 'KeyR') {
        handleResetCamera();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPart, togglePlay, handleStepKeyframe]);

  // Selection Raycaster (Click in Viewport to select part)
  const handlePointerClick = (e: React.MouseEvent) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const meshes: THREE.Mesh[] = [];
    modelGroupRef.current?.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
    });

    const intersects = raycaster.intersectObjects(meshes, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      if (hit.userData?.partData) {
        setSelectedPart(hit.userData.partData as RobloxPartIR);

        // Highlight with SelectionBox outline
        if (selectionBoxRef.current) {
          sceneRef.current.remove(selectionBoxRef.current);
          selectionBoxRef.current.dispose();
        }
        const boxHelper = new THREE.BoxHelper(hit, 0x00d2ff);
        (boxHelper.material as THREE.LineBasicMaterial).linewidth = 2;
        sceneRef.current.add(boxHelper);
        selectionBoxRef.current = boxHelper;
        return;
      }
    }

    // Deselect if clicked empty space
    setSelectedPart(null);
    if (selectionBoxRef.current && sceneRef.current) {
      sceneRef.current.remove(selectionBoxRef.current);
      selectionBoxRef.current.dispose();
      selectionBoxRef.current = null;
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    cameraSpherical.current = { radius: 14, theta: Math.PI / 4, phi: Math.PI / 3 };
    cameraTarget.current.set(0, 2.5, 0);
    if (cameraRef.current) {
      const { radius, theta, phi } = cameraSpherical.current;
      cameraRef.current.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        2.5 + radius * Math.cos(phi),
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
    a.download = `${modelIR?.name || animationIR?.name || 'RobloxAsset'}-render.png`;
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
    cameraSpherical.current.radius = Math.max(2, Math.min(65, cameraSpherical.current.radius + zoomDelta));

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
      className={`relative w-full h-full min-h-[460px] bg-studio-950 rounded-xl overflow-hidden border border-studio-800 select-none shadow-2xl ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={handlePointerClick}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Viewport Top Toolbar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-studio-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-studio-800 pointer-events-auto shadow-xl text-xs text-studio-200">
          <span className="font-semibold text-roblox-blue uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-roblox-blue" />
            {modelIR?.name || animationIR?.name || 'Roblox Studio Viewport'}
          </span>
          {modelIR?.instances && (
            <span className="text-studio-400">
              • {modelIR.instances.length} Parts
            </span>
          )}
          {animationIR && (
            <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {animationIR.keyframes.length} Keyframes
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-studio-900/90 backdrop-blur-md p-1 rounded-lg border border-studio-800 pointer-events-auto shadow-xl text-xs">
          {/* Camera Angles */}
          <div className="flex items-center bg-studio-950/80 rounded p-0.5 border border-studio-800 text-[10px] font-mono">
            <button
              onClick={() => setCameraAngle('iso')}
              className="px-2 py-0.5 hover:bg-studio-800 rounded text-studio-300 transition"
              title="Isometric 3/4 View"
            >
              ISO
            </button>
            <button
              onClick={() => setCameraAngle('front')}
              className="px-2 py-0.5 hover:bg-studio-800 rounded text-studio-300 transition"
              title="Front Ortho View"
            >
              FRONT
            </button>
            <button
              onClick={() => setCameraAngle('top')}
              className="px-2 py-0.5 hover:bg-studio-800 rounded text-studio-300 transition"
              title="Top Down View"
            >
              TOP
            </button>
          </div>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-1.5 text-studio-400 hover:text-studio-100 hover:bg-studio-800 rounded transition"
            title="Reset Camera (R key)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Grid */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded transition ${
              showGrid ? 'text-roblox-blue bg-studio-800' : 'text-studio-400 hover:text-studio-100'
            }`}
            title="Toggle Baseplate Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Wireframe */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded transition ${
              wireframe ? 'text-amber-400 bg-studio-800' : 'text-studio-400 hover:text-studio-100'
            }`}
            title="Toggle Wireframe"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Lighting Mode */}
          <button
            onClick={cycleLighting}
            className="p-1.5 text-studio-400 hover:text-studio-100 hover:bg-studio-800 rounded transition"
            title={`Lighting: ${lightingPreset}`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>

          {/* Snapshot Button */}
          <button
            onClick={handleDownloadSnapshot}
            className="flex items-center gap-1 px-2.5 py-1 bg-studio-800 hover:bg-studio-700 text-studio-200 rounded transition text-[11px] font-medium"
            title="Export High-Res PNG Render"
          >
            <Camera className="w-3 h-3 text-roblox-blue" />
            <span>Render</span>
          </button>
        </div>
      </div>

      {/* Selected Part HUD Overlay (When user clicks a 3D part) */}
      {selectedPart && (
        <div className="absolute top-14 left-3 bg-studio-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-roblox-blue/40 shadow-2xl pointer-events-auto text-xs flex flex-col gap-1 min-w-[210px] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Box className="w-3 h-3 text-roblox-blue" />
              {selectedPart.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-studio-800 text-studio-300 rounded font-mono">
              {selectedPart.className}
            </span>
          </div>
          <div className="text-[11px] text-studio-400 font-mono flex items-center justify-between">
            <span>Size:</span>
            <span className="text-studio-200">
              {selectedPart.size?.map((n) => n.toFixed(1)).join(' × ')} st
            </span>
          </div>
          <div className="text-[11px] text-studio-400 font-mono flex items-center justify-between">
            <span>Pos:</span>
            <span className="text-studio-200">
              ({selectedPart.position?.map((n) => n.toFixed(1)).join(', ')})
            </span>
          </div>
          <div className="text-[11px] text-studio-400 flex items-center justify-between">
            <span>Material:</span>
            <span className="text-roblox-blue font-medium">{selectedPart.material}</span>
          </div>
        </div>
      )}

      {/* Animation Playback Bar (When viewing animations) */}
      {animationIR && (
        <div className="absolute bottom-3 left-3 right-3 bg-studio-900/95 backdrop-blur-md p-3 rounded-xl border border-studio-800 shadow-2xl flex flex-col gap-2.5 pointer-events-auto animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between text-xs text-studio-300">
            {/* Playback Transport Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStepKeyframe('prev')}
                className="p-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-studio-300 hover:text-white transition shadow"
                title="Previous Keyframe"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={togglePlay}
                className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg bg-roblox-blue hover:bg-roblox-blue/90 text-white font-medium text-xs transition shadow-lg shadow-roblox-blue/20"
                title="Play/Pause (Spacebar)"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => handleStepKeyframe('next')}
                className="p-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-studio-300 hover:text-white transition shadow"
                title="Next Keyframe (Arrow Right)"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleLoop}
                className={`p-1.5 rounded-lg transition border ${
                  loopAnimation
                    ? 'text-roblox-blue bg-roblox-blue/10 border-roblox-blue/30'
                    : 'text-studio-500 bg-studio-800 border-transparent'
                }`}
                title="Loop Animation"
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-studio-100 text-[11px] ml-1 bg-studio-950 px-2 py-1 rounded border border-studio-800">
                {currentTime.toFixed(2)}s / {(animationIR.length || 2.0).toFixed(2)}s
              </span>
            </div>

            {/* Playback Speed Multipliers */}
            <div className="flex items-center gap-2">
              <span className="text-studio-400 text-[11px]">Speed:</span>
              {[0.25, 0.5, 1.0, 1.5, 2.0].map((speed) => (
                <button
                  key={speed}
                  onClick={() => updatePlaybackSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                    playbackSpeed === speed
                      ? 'bg-roblox-blue text-white font-medium'
                      : 'text-studio-400 hover:text-studio-200 bg-studio-800'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Track with Clickable Keyframe Diamonds */}
          <div className="relative flex items-center w-full">
            <input
              type="range"
              min={0}
              max={animationIR.length || 2.0}
              step={0.01}
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                isPlayingRef.current = false;
                setIsPlaying(false);
                setCurrentTime(val);
                animTimeRef.current = val;
                if (animationIRRef.current) {
                  applyAnimationAtTime(val, animationIRRef.current);
                }
              }}
              className="w-full h-2 bg-studio-950 rounded-lg appearance-none cursor-pointer accent-roblox-blue border border-studio-800"
            />

            {/* Keyframe Diamond Indicators */}
            {animationIR.keyframes?.map((kf: RobloxKeyframeIR, idx: number) => {
              const maxL = animationIR.length || 2.0;
              const pct = Math.min(100, Math.max(0, (kf.time / maxL) * 100));
              const isCurrent = Math.abs(currentTime - kf.time) < 0.05;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    isPlayingRef.current = false;
                    setIsPlaying(false);
                    setCurrentTime(kf.time);
                    animTimeRef.current = kf.time;
                    if (animationIRRef.current) {
                      applyAnimationAtTime(kf.time, animationIRRef.current);
                    }
                  }}
                  style={{ left: `${pct}%` }}
                  className={`absolute -top-1 -ml-1.5 w-3 h-3 rotate-45 transition-transform ${
                    isCurrent
                      ? 'bg-roblox-blue scale-125 border border-white z-10'
                      : 'bg-emerald-400 hover:scale-125 border border-studio-900'
                  }`}
                  title={`${kf.name || `Keyframe #${idx + 1}`} at ${kf.time.toFixed(2)}s`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Helpful Shortcuts Overlay */}
      <div className="absolute bottom-3 left-4 pointer-events-none opacity-40 hover:opacity-100 transition text-[11px] text-studio-400">
        Left-drag: Orbit • Right-drag: Pan • Scroll: Zoom • Space: Play/Pause • F: Focus Part
      </div>
    </div>
  );
}

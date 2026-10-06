// ============================================================
// Roblox Asset AI - Intelligent Auto-Rigging Engine
// Automatically generates authentic Roblox Motor6D avatar rigs,
// Humanoid instances, and WeldConstraints for Characters, Vehicles, & Props.
// ============================================================

import {
  RobloxModelIR,
  RobloxPartIR,
  RobloxInstanceIR,
  RobloxMotor6DIR,
  RobloxWeldConstraintIR,
  RobloxHumanoidIR,
  RobloxSeatIR,
} from '../types/roblox';

export interface RiggingResult {
  model: RobloxModelIR;
  rigType: 'humanoid_r6' | 'vehicle' | 'welded_prop';
  jointCount: number;
  weldCount: number;
  hasHumanoid: boolean;
}

/**
 * Calculates Euclidean distance between two 3D positions [x, y, z]
 */
function dist3D(a: [number, number, number], b: [number, number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Auto-rigs any generated Roblox Model IR with genuine Roblox joint hierarchies:
 * - Characters / Humanoids: adds Humanoid, HumanoidRootPart, 6 standard R6 Motor6D joints,
 *   and welds all accessories / clothing / held items to the corresponding limbs.
 * - Vehicles: welds all panels & trims to chassis, sets up wheel/rotor joints, and adds a VehicleSeat.
 * - Props & Architecture: welds all parts to the PrimaryPart with WeldConstraints.
 */
export function autoRigModel(model: RobloxModelIR, promptHint = ''): RiggingResult {
  const promptLower = (promptHint || model.metadata?.prompt || model.name || '').toLowerCase();

  // 1. Separate existing parts from any existing joints
  const parts: RobloxPartIR[] = [];
  const otherInstances: RobloxInstanceIR[] = [];

  for (const inst of model.instances) {
    if (inst.className === 'Part' || inst.className === 'WedgePart' || inst.className === 'MeshPart') {
      parts.push(inst as RobloxPartIR);
    } else if (inst.className !== 'Motor6D' && inst.className !== 'WeldConstraint' && inst.className !== 'Humanoid') {
      otherInstances.push(inst);
    }
  }

  if (parts.length === 0) {
    return {
      model,
      rigType: 'welded_prop',
      jointCount: 0,
      weldCount: 0,
      hasHumanoid: false,
    };
  }

  // 2. Classify asset type
  const isHumanoid =
    promptLower.includes('zombie') ||
    promptLower.includes('character') ||
    promptLower.includes('humanoid') ||
    promptLower.includes('mannequin') ||
    promptLower.includes('npc') ||
    promptLower.includes('soldier') ||
    promptLower.includes('robot') ||
    promptLower.includes('creature') ||
    promptLower.includes('monster') ||
    promptLower.includes('golem') ||
    parts.some((p) => /torso/i.test(p.name)) ||
    parts.some((p) => /head/i.test(p.name) && (/arm/i.test(p.name) || /leg/i.test(p.name)));

  const isVehicle =
    !isHumanoid &&
    (promptLower.includes('car') ||
      promptLower.includes('truck') ||
      promptLower.includes('buggy') ||
      promptLower.includes('motorcycle') ||
      promptLower.includes('helicopter') ||
      promptLower.includes('plane') ||
      promptLower.includes('vehicle') ||
      parts.some((p) => /wheel/i.test(p.name)) ||
      parts.some((p) => /rotor/i.test(p.name)));

  if (isHumanoid) {
    return rigHumanoidModel(model, parts, otherInstances);
  } else if (isVehicle) {
    return rigVehicleModel(model, parts, otherInstances);
  } else {
    return rigPropModel(model, parts, otherInstances);
  }
}

/**
 * Rigs a humanoid / creature model with authentic Roblox R6 rig topology
 */
function rigHumanoidModel(
  model: RobloxModelIR,
  parts: RobloxPartIR[],
  otherInstances: RobloxInstanceIR[]
): RiggingResult {
  // Identify major anatomical limbs
  const findPart = (pattern: RegExp) => parts.find((p) => pattern.test(p.name));

  let torso = findPart(/^torso/i) || findPart(/torso|body_core|chest/i);
  let head = findPart(/^head/i) || findPart(/head|skull/i);
  let leftArm = findPart(/left.*arm|arm.*left|l_arm/i);
  let rightArm = findPart(/right.*arm|arm.*right|r_arm/i);
  let leftLeg = findPart(/left.*leg|leg.*left|l_leg/i);
  let rightLeg = findPart(/right.*leg|leg.*right|r_leg/i);

  // If no explicit torso found, pick the central largest part
  if (!torso) {
    torso = parts.reduce((best, p) => {
      const vol = p.size[0] * p.size[1] * p.size[2];
      const bestVol = best.size[0] * best.size[1] * best.size[2];
      return vol > bestVol ? p : best;
    }, parts[0]);
    torso.name = 'Torso';
  }

  // Ensure canonical names for the 6 core body parts
  if (torso) torso.name = 'Torso';
  if (head) head.name = 'Head';
  if (leftArm) leftArm.name = 'Left Arm';
  if (rightArm) rightArm.name = 'Right Arm';
  if (leftLeg) leftLeg.name = 'Left Leg';
  if (rightLeg) rightLeg.name = 'Right Leg';

  // Ensure HumanoidRootPart exists (Roblox standard root)
  let rootPart = parts.find((p) => /root/i.test(p.name) || p.name === 'HumanoidRootPart');
  if (!rootPart) {
    rootPart = {
      id: 'hrp_root',
      name: 'HumanoidRootPart',
      className: 'Part',
      shape: 'Block',
      size: [2, 2, 1],
      position: [...torso.position],
      rotation: [0, 0, 0],
      color: [128, 128, 128],
      material: 'SmoothPlastic',
      transparency: 1,
      canCollide: false,
      anchored: true,
    };
    parts.unshift(rootPart);
  } else {
    rootPart.name = 'HumanoidRootPart';
    rootPart.transparency = 1;
    rootPart.canCollide = false;
  }

  // Set HumanoidRootPart as PrimaryPart
  model.primaryPartId = rootPart.id;

  const motors: RobloxMotor6DIR[] = [];
  const welds: RobloxWeldConstraintIR[] = [];

  // Canonical R6 Motor6D joints
  // 1. RootJoint: HumanoidRootPart -> Torso
  motors.push({
    id: 'm6d_root',
    name: 'RootJoint',
    className: 'Motor6D',
    part0: rootPart.id,
    part1: torso.id,
    c0: [0, 0, 0, -90, 0, 180],
    c1: [0, 0, 0, -90, 0, 180],
  });

  // 2. Neck: Torso -> Head
  if (head) {
    motors.push({
      id: 'm6d_neck',
      name: 'Neck',
      className: 'Motor6D',
      part0: torso.id,
      part1: head.id,
      c0: [0, 1, 0, -90, 0, 180],
      c1: [0, -0.5, 0, -90, 0, 180],
    });
  }

  // 3. Left Shoulder: Torso -> Left Arm
  if (leftArm) {
    motors.push({
      id: 'm6d_left_shoulder',
      name: 'Left Shoulder',
      className: 'Motor6D',
      part0: torso.id,
      part1: leftArm.id,
      c0: [-1, 0.5, 0, 0, -90, 0],
      c1: [0.5, 0.5, 0, 0, -90, 0],
    });
  }

  // 4. Right Shoulder: Torso -> Right Arm
  if (rightArm) {
    motors.push({
      id: 'm6d_right_shoulder',
      name: 'Right Shoulder',
      className: 'Motor6D',
      part0: torso.id,
      part1: rightArm.id,
      c0: [1, 0.5, 0, 0, 90, 0],
      c1: [-0.5, 0.5, 0, 0, 90, 0],
    });
  }

  // 5. Left Hip: Torso -> Left Leg
  if (leftLeg) {
    motors.push({
      id: 'm6d_left_hip',
      name: 'Left Hip',
      className: 'Motor6D',
      part0: torso.id,
      part1: leftLeg.id,
      c0: [-1, -1, 0, 0, -90, 0],
      c1: [-0.5, 1, 0, 0, -90, 0],
    });
  }

  // 6. Right Hip: Torso -> Right Leg
  if (rightLeg) {
    motors.push({
      id: 'm6d_right_hip',
      name: 'Right Hip',
      className: 'Motor6D',
      part0: torso.id,
      part1: rightLeg.id,
      c0: [1, -1, 0, 0, 90, 0],
      c1: [0.5, 1, 0, 0, 90, 0],
    });
  }

  // Core limb set
  const coreLimbIds = new Set([
    rootPart.id,
    torso.id,
    head?.id,
    leftArm?.id,
    rightArm?.id,
    leftLeg?.id,
    rightLeg?.id,
  ].filter(Boolean));

  const limbList = [
    { id: torso.id, part: torso },
    head ? { id: head.id, part: head } : null,
    leftArm ? { id: leftArm.id, part: leftArm } : null,
    rightArm ? { id: rightArm.id, part: rightArm } : null,
    leftLeg ? { id: leftLeg.id, part: leftLeg } : null,
    rightLeg ? { id: rightLeg.id, part: rightLeg } : null,
  ].filter(Boolean) as { id: string; part: RobloxPartIR }[];

  // Weld all accessory, clothing, facial, and held parts to the closest major body part!
  for (const part of parts) {
    if (coreLimbIds.has(part.id)) continue;

    // Determine nearest limb by distance
    let nearestLimb = limbList[0];
    let minD = Infinity;

    for (const limb of limbList) {
      const d = dist3D(part.position, limb.part.position);
      if (d < minD) {
        minD = d;
        nearestLimb = limb;
      }
    }

    // Set canCollide false for small accessories to prevent physics clipping
    if (part.size[0] < 1.5 && part.size[1] < 1.5 && part.size[2] < 1.5) {
      part.canCollide = false;
    }

    welds.push({
      id: `weld_${part.id}`,
      name: `Weld_${part.name}`,
      className: 'WeldConstraint',
      part0: nearestLimb.id,
      part1: part.id,
    });
  }

  // Add Humanoid instance
  const humanoid: RobloxHumanoidIR = {
    id: 'humanoid_r6',
    name: 'Humanoid',
    className: 'Humanoid',
    health: 100,
    maxHealth: 100,
    rigType: 0,
  };

  const finalInstances: RobloxInstanceIR[] = [
    ...parts,
    humanoid,
    ...motors,
    ...welds,
    ...otherInstances,
  ];

  model.instances = finalInstances;

  return {
    model,
    rigType: 'humanoid_r6',
    jointCount: motors.length,
    weldCount: welds.length,
    hasHumanoid: true,
  };
}

/**
 * Rigs a vehicle model (chassis welded to body panels, wheels with joints, VehicleSeat added)
 */
function rigVehicleModel(
  model: RobloxModelIR,
  parts: RobloxPartIR[],
  otherInstances: RobloxInstanceIR[]
): RiggingResult {
  // Find chassis / main body
  const chassis =
    parts.find((p) => /chassis|body|frame|hull/i.test(p.name)) ||
    parts.reduce((best, p) => {
      const vol = p.size[0] * p.size[1] * p.size[2];
      const bestVol = best.size[0] * best.size[1] * best.size[2];
      return vol > bestVol ? p : best;
    }, parts[0]);

  model.primaryPartId = chassis.id;

  const welds: RobloxWeldConstraintIR[] = [];
  const motors: RobloxMotor6DIR[] = [];

  for (const part of parts) {
    if (part.id === chassis.id) continue;

    const isWheel = /wheel|tire/i.test(part.name);
    const isRotor = /rotor|blade|propeller/i.test(part.name);

    if (isWheel || isRotor) {
      // Connect moving parts with Motor6D for potential spinning animation
      motors.push({
        id: `motor_${part.id}`,
        name: `Axle_${part.name}`,
        className: 'Motor6D',
        part0: chassis.id,
        part1: part.id,
        c0: [
          part.position[0] - chassis.position[0],
          part.position[1] - chassis.position[1],
          part.position[2] - chassis.position[2],
        ],
        c1: [0, 0, 0],
      });
    } else {
      // Rigidly weld all panels, lights, and trims to chassis
      welds.push({
        id: `weld_${part.id}`,
        name: `Weld_${part.name}`,
        className: 'WeldConstraint',
        part0: chassis.id,
        part1: part.id,
      });
    }
  }

  // Add VehicleSeat if one does not already exist
  const hasSeat = parts.some((p) => /seat/i.test(p.name));
  if (!hasSeat) {
    const seat: RobloxSeatIR = {
      id: 'vehicle_seat',
      name: 'VehicleSeat',
      className: 'VehicleSeat',
      size: [2, 1, 2],
      position: [chassis.position[0], chassis.position[1] + chassis.size[1] / 2 + 0.5, chassis.position[2]],
      rotation: [0, 0, 0],
      color: [40, 40, 40],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    };
    parts.push(seat as any);
    welds.push({
      id: 'weld_vehicle_seat',
      name: 'Weld_VehicleSeat',
      className: 'WeldConstraint',
      part0: chassis.id,
      part1: seat.id,
    });
  }

  model.instances = [...parts, ...motors, ...welds, ...otherInstances];

  return {
    model,
    rigType: 'vehicle',
    jointCount: motors.length,
    weldCount: welds.length,
    hasHumanoid: false,
  };
}

/**
 * Rigs a standard prop, weapon, or building with unified WeldConstraints
 */
function rigPropModel(
  model: RobloxModelIR,
  parts: RobloxPartIR[],
  otherInstances: RobloxInstanceIR[]
): RiggingResult {
  // Find or verify PrimaryPart
  let primary = parts.find((p) => p.id === model.primaryPartId);
  if (!primary) {
    // Pick largest base part
    primary = parts.reduce((best, p) => {
      const vol = p.size[0] * p.size[1] * p.size[2];
      const bestVol = best.size[0] * best.size[1] * best.size[2];
      return vol > bestVol ? p : best;
    }, parts[0]);
    model.primaryPartId = primary.id;
  }

  const welds: RobloxWeldConstraintIR[] = [];

  for (const part of parts) {
    if (part.id === primary.id) continue;
    welds.push({
      id: `weld_${part.id}`,
      name: `Weld_${part.name}`,
      className: 'WeldConstraint',
      part0: primary.id,
      part1: part.id,
    });
  }

  model.instances = [...parts, ...welds, ...otherInstances];

  return {
    model,
    rigType: 'welded_prop',
    jointCount: 0,
    weldCount: welds.length,
    hasHumanoid: false,
  };
}

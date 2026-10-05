// ============================================================
// Roblox Asset AI - Comprehensive Domain Asset Builders
// Contains production-grade, highly-detailed multi-part generators
// for 30+ Roblox categories with 3 progressive iteration levels.
// ============================================================

import { RobloxPartIR, RobloxInstanceIR } from '../../types/roblox';
import { AssetGeneratorResult } from './roblox-asset-catalog';

export class CatalogBuilders {
  // ============================================================
  // 1. PROPS & NATURE
  // ============================================================

  public static buildTreasureChest(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main chest bottom base
    const base: RobloxPartIR = {
      id: 'tc_base',
      name: 'ChestBase',
      className: 'Part',
      shape: 'Block',
      size: [4.0, 2.0, 2.8],
      position: [0, 1.0, 0],
      rotation: [0, 0, 0],
      color: [115, 70, 40],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    };
    instances.push(base);

    // Curved/Angled Lid
    instances.push({
      id: 'tc_lid',
      name: 'ChestLid',
      className: 'Part',
      shape: 'Block',
      size: [4.0, 1.2, 2.8],
      position: [0, 2.6, 0],
      rotation: [0, 0, 0],
      color: [115, 70, 40],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    // Iron Band Left (Base)
    instances.push({
      id: 'tc_band_l',
      name: 'IronBandLeft',
      className: 'Part',
      shape: 'Block',
      size: [0.35, 2.05, 2.9],
      position: [-1.2, 1.0, 0],
      rotation: [0, 0, 0],
      color: [75, 80, 88],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Iron Band Right (Base)
    instances.push({
      id: 'tc_band_r',
      name: 'IronBandRight',
      className: 'Part',
      shape: 'Block',
      size: [0.35, 2.05, 2.9],
      position: [1.2, 1.0, 0],
      rotation: [0, 0, 0],
      color: [75, 80, 88],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Iron Band Left (Lid)
    instances.push({
      id: 'tc_band_lid_l',
      name: 'IronBandLidLeft',
      className: 'Part',
      shape: 'Block',
      size: [0.35, 1.25, 2.9],
      position: [-1.2, 2.6, 0],
      rotation: [0, 0, 0],
      color: [75, 80, 88],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Iron Band Right (Lid)
    instances.push({
      id: 'tc_band_lid_r',
      name: 'IronBandLidRight',
      className: 'Part',
      shape: 'Block',
      size: [0.35, 1.25, 2.9],
      position: [1.2, 2.6, 0],
      rotation: [0, 0, 0],
      color: [75, 80, 88],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Rear Hinges
    instances.push({
      id: 'tc_hinge_l',
      name: 'HingeLeft',
      className: 'Part',
      shape: 'Block',
      size: [0.4, 0.5, 0.25],
      position: [-1.2, 2.0, -1.45],
      rotation: [0, 0, 0],
      color: [60, 65, 72],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'tc_hinge_r',
      name: 'HingeRight',
      className: 'Part',
      shape: 'Block',
      size: [0.4, 0.5, 0.25],
      position: [1.2, 2.0, -1.45],
      rotation: [0, 0, 0],
      color: [60, 65, 72],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Golden Latch Plate & Lock
      instances.push({
        id: 'tc_hasp',
        name: 'GoldHaspLatch',
        className: 'Part',
        shape: 'Block',
        size: [0.6, 0.8, 0.2],
        position: [0, 2.0, 1.45],
        rotation: [0, 0, 0],
        color: [230, 190, 50],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'tc_lock',
        name: 'IronPadlock',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.3, 0.5, 0.5],
        position: [0, 1.7, 1.55],
        rotation: [0, 0, 90],
        color: [235, 195, 55],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // 4 Corner Reinforcements
      for (const [x, z, suffix] of [
        [-1.9, 1.3, 'fl'],
        [1.9, 1.3, 'fr'],
        [-1.9, -1.3, 'bl'],
        [1.9, -1.3, 'br'],
      ] as const) {
        instances.push({
          id: `tc_corner_${suffix}`,
          name: `CornerBracket_${suffix.toUpperCase()}`,
          className: 'Part',
          shape: 'Block',
          size: [0.3, 1.8, 0.3],
          position: [x, 0.9, z],
          rotation: [0, 0, 0],
          color: [70, 75, 82],
          material: 'Metal',
          anchored: true,
          canCollide: true,
        });
      }
    }

    if (iteration >= 3) {
      // Overflowing Gold Coins & Glowing Gems
      instances.push({
        id: 'tc_gold_mound',
        name: 'OverflowingGoldCoins',
        className: 'Part',
        shape: 'Block',
        size: [3.2, 0.5, 1.8],
        position: [0, 2.1, 0.1],
        rotation: [0, 0, 0],
        color: [245, 205, 45],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'tc_ruby',
        name: 'GlowingRubyGem',
        className: 'Part',
        shape: 'Ball',
        size: [0.45, 0.45, 0.45],
        position: [-0.7, 2.5, 0.3],
        rotation: [0, 0, 0],
        color: [255, 30, 60],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      instances.push({
        id: 'tc_sapphire',
        name: 'GlowingSapphireGem',
        className: 'Part',
        shape: 'Ball',
        size: [0.45, 0.45, 0.45],
        position: [0.7, 2.45, 0.4],
        rotation: [0, 0, 0],
        color: [0, 200, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      // Side Handles
      instances.push({
        id: 'tc_handle_l',
        name: 'CarryingRingLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.6, 0.6],
        position: [-2.1, 1.2, 0],
        rotation: [0, 0, 90],
        color: [60, 65, 72],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'tc_handle_r',
        name: 'CarryingRingRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.6, 0.6],
        position: [2.1, 1.2, 0],
        rotation: [0, 0, 90],
        color: [60, 65, 72],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    return { name: 'StylizedTreasureChest', instances, primaryPartId: 'tc_base' };
  }

  public static buildCrate(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Core Box Body
    const core: RobloxPartIR = {
      id: 'cr_body',
      name: 'CrateCore',
      className: 'Part',
      shape: 'Block',
      size: [3.2, 3.2, 3.2],
      position: [0, 1.6, 0],
      rotation: [0, 0, 0],
      color: [130, 85, 45],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    };
    instances.push(core);

    // Exterior Framing Rails
    instances.push({
      id: 'cr_frame_top',
      name: 'TopRimFrame',
      className: 'Part',
      shape: 'Block',
      size: [3.35, 0.35, 3.35],
      position: [0, 3.1, 0],
      rotation: [0, 0, 0],
      color: [100, 65, 35],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    instances.push({
      id: 'cr_frame_bot',
      name: 'BottomRimFrame',
      className: 'Part',
      shape: 'Block',
      size: [3.35, 0.35, 3.35],
      position: [0, 0.17, 0],
      rotation: [0, 0, 0],
      color: [100, 65, 35],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    // Side Cross Braces (Diagonal struts)
    instances.push({
      id: 'cr_cross_f',
      name: 'FrontDiagonalBrace',
      className: 'Part',
      shape: 'Block',
      size: [0.25, 3.4, 0.3],
      position: [0, 1.6, 1.65],
      rotation: [0, 0, 45],
      color: [110, 72, 38],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    instances.push({
      id: 'cr_cross_b',
      name: 'BackDiagonalBrace',
      className: 'Part',
      shape: 'Block',
      size: [0.25, 3.4, 0.3],
      position: [0, 1.6, -1.65],
      rotation: [0, 0, -45],
      color: [110, 72, 38],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // 4 Iron Corner Brackets
      for (const [x, z, suf] of [
        [-1.6, 1.6, 'fl'],
        [1.6, 1.6, 'fr'],
        [-1.6, -1.6, 'bl'],
        [1.6, -1.6, 'br'],
      ] as const) {
        instances.push({
          id: `cr_bracket_${suf}`,
          name: `IronBracket_${suf}`,
          className: 'Part',
          shape: 'Block',
          size: [0.35, 0.8, 0.35],
          position: [x, 3.0, z],
          rotation: [0, 0, 0],
          color: [65, 70, 78],
          material: 'Metal',
          anchored: true,
          canCollide: true,
        });
      }

      // Rope Handles
      instances.push({
        id: 'cr_rope_l',
        name: 'RopeHandleLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.8, 0.8],
        position: [-1.75, 1.8, 0],
        rotation: [0, 0, 90],
        color: [180, 160, 120],
        material: 'Fabric',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'cr_rope_r',
        name: 'RopeHandleRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.8, 0.8],
        position: [1.75, 1.8, 0],
        rotation: [0, 0, 90],
        color: [180, 160, 120],
        material: 'Fabric',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Stencil / Fragile Stamp Label
      instances.push({
        id: 'cr_label',
        name: 'StencilWarningMark',
        className: 'Part',
        shape: 'Block',
        size: [1.2, 0.8, 0.05],
        position: [0, 2.2, 1.7],
        rotation: [0, 0, 0],
        color: [200, 45, 45],
        material: 'SmoothPlastic',
        anchored: true,
        canCollide: false,
      });

      // Pried-open corner reveal glowing cargo
      instances.push({
        id: 'cr_glow_cargo',
        name: 'InternalGlowingOre',
        className: 'Part',
        shape: 'Ball',
        size: [0.6, 0.6, 0.6],
        position: [1.1, 3.1, 1.1],
        rotation: [0, 0, 0],
        color: [0, 230, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'ShippingCrate', instances, primaryPartId: 'cr_body' };
  }

  public static buildBarrel(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main barrel belly cylinder
    const core: RobloxPartIR = {
      id: 'brl_core',
      name: 'BarrelBody',
      className: 'Part',
      shape: 'Cylinder',
      size: [2.8, 3.4, 2.8],
      position: [0, 1.7, 0],
      rotation: [0, 0, 0],
      color: [120, 75, 42],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    };
    instances.push(core);

    // Top and Bottom Iron Hoops
    instances.push({
      id: 'brl_hoop_top',
      name: 'TopIronHoop',
      className: 'Part',
      shape: 'Cylinder',
      size: [2.85, 0.3, 2.85],
      position: [0, 3.0, 0],
      rotation: [0, 0, 0],
      color: [65, 70, 78],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    instances.push({
      id: 'brl_hoop_bot',
      name: 'BottomIronHoop',
      className: 'Part',
      shape: 'Cylinder',
      size: [2.85, 0.3, 2.85],
      position: [0, 0.4, 0],
      rotation: [0, 0, 0],
      color: [65, 70, 78],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Middle Iron Belly Hoops
      instances.push({
        id: 'brl_hoop_mid1',
        name: 'MiddleUpperHoop',
        className: 'Part',
        shape: 'Cylinder',
        size: [2.9, 0.25, 2.9],
        position: [0, 2.1, 0],
        rotation: [0, 0, 0],
        color: [65, 70, 78],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'brl_hoop_mid2',
        name: 'MiddleLowerHoop',
        className: 'Part',
        shape: 'Cylinder',
        size: [2.9, 0.25, 2.9],
        position: [0, 1.3, 0],
        rotation: [0, 0, 0],
        color: [65, 70, 78],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Wooden Spigot Tap
      instances.push({
        id: 'brl_spigot',
        name: 'DispenserSpigot',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.2, 0.6, 0.2],
        position: [0, 0.8, 1.5],
        rotation: [90, 0, 0],
        color: [90, 55, 30],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Spigot Handle / Turncock
      instances.push({
        id: 'brl_tap_handle',
        name: 'SpigotValveHandle',
        className: 'Part',
        shape: 'Block',
        size: [0.4, 0.15, 0.15],
        position: [0, 1.0, 1.6],
        rotation: [0, 0, 0],
        color: [220, 180, 50],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });

      // Top Bung Plug
      instances.push({
        id: 'brl_bung',
        name: 'TopBungStopper',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.5, 0.2, 0.5],
        position: [0, 3.45, 0],
        rotation: [0, 0, 0],
        color: [95, 60, 35],
        material: 'Wood',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'OakStorageBarrel', instances, primaryPartId: 'brl_core' };
  }

  public static buildCampfire(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Base Ash Bed
    const ash: RobloxPartIR = {
      id: 'cf_base',
      name: 'AshBed',
      className: 'Part',
      shape: 'Cylinder',
      size: [3.6, 0.2, 3.6],
      position: [0, 0.1, 0],
      rotation: [0, 0, 0],
      color: [45, 45, 50],
      material: 'Slate',
      anchored: true,
      canCollide: true,
    };
    instances.push(ash);

    // Stone Perimeter Ring (8 cobblestones around fire)
    const stoneCount = 8;
    const radius = 1.6;
    for (let i = 0; i < stoneCount; i++) {
      const angle = (i / stoneCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      instances.push({
        id: `cf_stone_${i}`,
        name: `HearthStone_${i}`,
        className: 'Part',
        shape: 'Ball',
        size: [0.75, 0.55, 0.75],
        position: [x, 0.3, z],
        rotation: [0, (i * 45) % 360, 0],
        color: [110, 115, 120],
        material: 'Cobblestone',
        anchored: true,
        canCollide: true,
      });
    }

    // Criss-Cross Firewood Logs (3 logs)
    const logAngles = [0, 60, 120];
    for (let i = 0; i < logAngles.length; i++) {
      instances.push({
        id: `cf_log_${i}`,
        name: `CampfireLog_${i}`,
        className: 'Part',
        shape: 'Cylinder',
        size: [0.4, 2.4, 0.4],
        position: [0, 0.35 + i * 0.15, 0],
        rotation: [0, logAngles[i], 90],
        color: [85, 50, 28],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    // Glowing Flame Core
    instances.push({
      id: 'cf_flame_core',
      name: 'FireCoreFlame',
      className: 'Part',
      shape: 'Ball',
      size: [1.2, 1.8, 1.2],
      position: [0, 1.1, 0],
      rotation: [0, 0, 0],
      color: [255, 120, 20],
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    if (iteration >= 2) {
      // Inner Hot Flame Tongue
      instances.push({
        id: 'cf_flame_hot',
        name: 'InnerFlameHot',
        className: 'Part',
        shape: 'Ball',
        size: [0.8, 1.4, 0.8],
        position: [0, 1.0, 0],
        rotation: [0, 0, 0],
        color: [255, 230, 80],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      // Embers on the side
      instances.push({
        id: 'cf_ember_1',
        name: 'GlowingEmber1',
        className: 'Part',
        shape: 'Ball',
        size: [0.25, 0.25, 0.25],
        position: [0.4, 0.25, 0.5],
        rotation: [0, 0, 0],
        color: [255, 60, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Wooden Cooking Spit / Tripod
      instances.push({
        id: 'cf_post_l',
        name: 'SpitPostLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.2, 2.6, 0.2],
        position: [-1.4, 1.3, 0],
        rotation: [0, 0, 0],
        color: [90, 55, 30],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'cf_post_r',
        name: 'SpitPostRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.2, 2.6, 0.2],
        position: [1.4, 1.3, 0],
        rotation: [0, 0, 0],
        color: [90, 55, 30],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'cf_crossbar',
        name: 'SpitCrossbeam',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 3.0, 0.15],
        position: [0, 2.5, 0],
        rotation: [0, 0, 90],
        color: [90, 55, 30],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      // Cast iron kettle hanging from spit
      instances.push({
        id: 'cf_kettle',
        name: 'HangingIronKettle',
        className: 'Part',
        shape: 'Ball',
        size: [0.7, 0.7, 0.7],
        position: [0, 1.8, 0],
        rotation: [0, 0, 0],
        color: [40, 42, 48],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    return { name: 'CampsiteFire', instances, primaryPartId: 'cf_base' };
  }

  public static buildTree(iteration: number, isPalm: boolean): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    if (isPalm) {
      // Curved Palm Trunk
      const trunk: RobloxPartIR = {
        id: 'tr_trunk',
        name: 'PalmTrunkBase',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.9, 4.2, 0.9],
        position: [0, 2.1, 0],
        rotation: [0, 0, 6],
        color: [130, 85, 45],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      };
      instances.push(trunk);

      instances.push({
        id: 'tr_trunk_upper',
        name: 'PalmTrunkUpper',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.75, 4.0, 0.75],
        position: [0.4, 5.8, 0],
        rotation: [0, 0, 14],
        color: [120, 80, 40],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      // Palm Crown Fronds (4 large curved fronds)
      for (let i = 0; i < 4; i++) {
        const rotY = i * 90;
        instances.push({
          id: `tr_frond_${i}`,
          name: `PalmFrondLeaf_${i}`,
          className: 'Part',
          shape: 'Block',
          size: [3.4, 0.15, 1.1],
          position: [0.9 + Math.cos((rotY * Math.PI) / 180) * 1.6, 7.8, Math.sin((rotY * Math.PI) / 180) * 1.6],
          rotation: [15, rotY, -20],
          color: [55, 155, 60],
          material: 'Grass',
          anchored: true,
          canCollide: false,
        });
      }

      if (iteration >= 2) {
        // Coconuts
        for (let i = 0; i < 3; i++) {
          const a = (i * 120 * Math.PI) / 180;
          instances.push({
            id: `tr_coconut_${i}`,
            name: `Coconut_${i}`,
            className: 'Part',
            shape: 'Ball',
            size: [0.55, 0.65, 0.55],
            position: [0.8 + Math.cos(a) * 0.4, 7.4, Math.sin(a) * 0.4],
            rotation: [0, 0, 0],
            color: [90, 50, 25],
            material: 'SmoothPlastic',
            anchored: true,
            canCollide: true,
          });
        }
      }

      if (iteration >= 3) {
        // Additional secondary fronds
        for (let i = 0; i < 4; i++) {
          const rotY = i * 90 + 45;
          instances.push({
            id: `tr_frond_sub_${i}`,
            name: `SecondaryFrond_${i}`,
            className: 'Part',
            shape: 'Block',
            size: [2.8, 0.12, 0.9],
            position: [0.9 + Math.cos((rotY * Math.PI) / 180) * 1.3, 8.1, Math.sin((rotY * Math.PI) / 180) * 1.3],
            rotation: [25, rotY, -30],
            color: [70, 175, 75],
            material: 'Grass',
            anchored: true,
            canCollide: false,
          });
        }
      }

      return { name: 'TropicalPalmTree', instances, primaryPartId: 'tr_trunk' };
    }

    // Classic Stylized Pine / Foliage Tree
    const trunk: RobloxPartIR = {
      id: 'tr_trunk',
      name: 'TreeTrunk',
      className: 'Part',
      shape: 'Cylinder',
      size: [1.2, 5.2, 1.2],
      position: [0, 2.6, 0],
      rotation: [0, 0, 0],
      color: [110, 68, 38],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    };
    instances.push(trunk);

    // Foliage Tier 1 (Lower)
    instances.push({
      id: 'tr_foliage_1',
      name: 'CanopyTierLower',
      className: 'Part',
      shape: 'Ball',
      size: [4.6, 3.2, 4.6],
      position: [0, 5.4, 0],
      rotation: [0, 0, 0],
      color: [40, 130, 55],
      material: 'Grass',
      anchored: true,
      canCollide: true,
    });

    // Foliage Tier 2 (Middle)
    instances.push({
      id: 'tr_foliage_2',
      name: 'CanopyTierMiddle',
      className: 'Part',
      shape: 'Ball',
      size: [3.8, 2.8, 3.8],
      position: [0, 7.2, 0],
      rotation: [0, 0, 0],
      color: [50, 145, 65],
      material: 'Grass',
      anchored: true,
      canCollide: true,
    });

    // Foliage Tier 3 (Top Tip)
    instances.push({
      id: 'tr_foliage_3',
      name: 'CanopyTierTop',
      className: 'Part',
      shape: 'Ball',
      size: [2.6, 2.4, 2.6],
      position: [0, 8.8, 0],
      rotation: [0, 0, 0],
      color: [60, 160, 75],
      material: 'Grass',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Buttress Root Flares
      for (const [x, z, rY, suf] of [
        [-0.7, 0, 0, 'w'],
        [0.7, 0, 180, 'e'],
        [0, 0.7, 90, 'n'],
        [0, -0.7, 270, 's'],
      ] as const) {
        instances.push({
          id: `tr_root_${suf}`,
          name: `RootFlare_${suf}`,
          className: 'WedgePart',
          shape: 'Wedge',
          size: [0.5, 0.9, 0.9],
          position: [x, 0.45, z],
          rotation: [0, rY, 0],
          color: [100, 62, 32],
          material: 'Wood',
          anchored: true,
          canCollide: true,
        });
      }
    }

    if (iteration >= 3) {
      // Forest Mushrooms at Base
      instances.push({
        id: 'tr_mush_stem',
        name: 'MushroomStem',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.4, 0.15],
        position: [0.8, 0.2, 0.5],
        rotation: [0, 0, 0],
        color: [240, 240, 235],
        material: 'SmoothPlastic',
        anchored: true,
        canCollide: false,
      });

      instances.push({
        id: 'tr_mush_cap',
        name: 'MushroomCap',
        className: 'Part',
        shape: 'Ball',
        size: [0.5, 0.35, 0.5],
        position: [0.8, 0.45, 0.5],
        rotation: [0, 0, 0],
        color: [220, 40, 40],
        material: 'SmoothPlastic',
        anchored: true,
        canCollide: false,
      });

      // Glowing Firefly / Fairy light
      instances.push({
        id: 'tr_firefly',
        name: 'CanopyFireflyOrb',
        className: 'Part',
        shape: 'Ball',
        size: [0.3, 0.3, 0.3],
        position: [-1.2, 6.2, 1.4],
        rotation: [0, 0, 0],
        color: [255, 245, 100],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'StylizedPineTree', instances, primaryPartId: 'tr_trunk' };
  }

  public static buildCrystalCore(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Stone Pedestal Foundation
    const pedestal: RobloxPartIR = {
      id: 'cc_base',
      name: 'CrystalAltarBase',
      className: 'Part',
      shape: 'Cylinder',
      size: [4.4, 0.8, 4.4],
      position: [0, 0.4, 0],
      rotation: [0, 0, 0],
      color: [75, 80, 92],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    };
    instances.push(pedestal);

    // Inner Pillar
    instances.push({
      id: 'cc_pillar',
      name: 'AltarPillar',
      className: 'Part',
      shape: 'Cylinder',
      size: [2.6, 1.2, 2.6],
      position: [0, 1.4, 0],
      rotation: [0, 0, 0],
      color: [60, 65, 75],
      material: 'Slate',
      anchored: true,
      canCollide: true,
    });

    // Giant Glowing Central Crystal Monolith
    instances.push({
      id: 'cc_crystal_main',
      name: 'ArcaneCrystalMonolith',
      className: 'Part',
      shape: 'Block',
      size: [1.6, 3.8, 1.6],
      position: [0, 4.2, 0],
      rotation: [25, 45, 20],
      color: [0, 230, 255],
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    if (iteration >= 2) {
      // 3 Flanking Orbiting Crystal Shards
      for (let i = 0; i < 3; i++) {
        const a = (i * 120 * Math.PI) / 180;
        instances.push({
          id: `cc_shard_${i}`,
          name: `OrbitingShard_${i}`,
          className: 'Part',
          shape: 'Block',
          size: [0.7, 1.8, 0.7],
          position: [Math.cos(a) * 2.2, 3.8, Math.sin(a) * 2.2],
          rotation: [30, i * 120, -15],
          color: [140, 40, 255],
          material: 'Neon',
          anchored: true,
          canCollide: false,
        });
      }

      // Golden Runic Ring
      instances.push({
        id: 'cc_ring',
        name: 'FloatingRunicRing',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 3.6, 3.6],
        position: [0, 4.2, 0],
        rotation: [15, 0, 75],
        color: [240, 200, 50],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Power Flare Core Orb
      instances.push({
        id: 'cc_power_flare',
        name: 'ZeroPointPowerCore',
        className: 'Part',
        shape: 'Ball',
        size: [1.1, 1.1, 1.1],
        position: [0, 4.2, 0],
        rotation: [0, 0, 0],
        color: [255, 255, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      // Base Neon Rune Circle
      instances.push({
        id: 'cc_rune_circle',
        name: 'BaseRuneInlay',
        className: 'Part',
        shape: 'Cylinder',
        size: [3.8, 0.05, 3.8],
        position: [0, 0.82, 0],
        rotation: [0, 0, 0],
        color: [0, 230, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'MagicCrystalCore', instances, primaryPartId: 'cc_base' };
  }

  // ============================================================
  // 2. FURNITURE & INTERIOR
  // ============================================================

  public static buildChair(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Seat Board
    const seat: RobloxPartIR = {
      id: 'ch_seat',
      name: 'ChairSeatBase',
      className: 'Part',
      shape: 'Block',
      size: [2.4, 0.4, 2.4],
      position: [0, 1.6, 0],
      rotation: [0, 0, 0],
      color: [115, 75, 45],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    };
    instances.push(seat);

    // 4 Sturdy Legs
    for (const [x, z, suf] of [
      [-0.95, 0.95, 'fl'],
      [0.95, 0.95, 'fr'],
      [-0.95, -0.95, 'bl'],
      [0.95, -0.95, 'br'],
    ] as const) {
      instances.push({
        id: `ch_leg_${suf}`,
        name: `ChairLeg_${suf}`,
        className: 'Part',
        shape: 'Cylinder',
        size: [0.35, 1.6, 0.35],
        position: [x, 0.8, z],
        rotation: [0, 0, 0],
        color: [95, 60, 35],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    // High Backrest
    instances.push({
      id: 'ch_back',
      name: 'BackrestPanel',
      className: 'Part',
      shape: 'Block',
      size: [2.4, 2.6, 0.3],
      position: [0, 3.1, -1.05],
      rotation: [0, 0, 0],
      color: [115, 75, 45],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    // Crimson Fabric Seat Cushion
    instances.push({
      id: 'ch_cushion',
      name: 'PlushSeatCushion',
      className: 'Part',
      shape: 'Block',
      size: [2.2, 0.35, 2.2],
      position: [0, 1.9, 0],
      rotation: [0, 0, 0],
      color: [180, 35, 45],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Left and Right Armrests
      instances.push({
        id: 'ch_arm_l',
        name: 'ArmrestLeft',
        className: 'Part',
        shape: 'Block',
        size: [0.35, 0.3, 2.2],
        position: [-1.25, 2.4, 0],
        rotation: [0, 0, 0],
        color: [115, 75, 45],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'ch_arm_r',
        name: 'ArmrestRight',
        className: 'Part',
        shape: 'Block',
        size: [0.35, 0.3, 2.2],
        position: [1.25, 2.4, 0],
        rotation: [0, 0, 0],
        color: [115, 75, 45],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      // Armrest Front Supports
      instances.push({
        id: 'ch_arm_sup_l',
        name: 'ArmSupportLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.25, 0.7, 0.25],
        position: [-1.25, 1.95, 0.9],
        rotation: [0, 0, 0],
        color: [95, 60, 35],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'ch_arm_sup_r',
        name: 'ArmSupportRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.25, 0.7, 0.25],
        position: [1.25, 1.95, 0.9],
        rotation: [0, 0, 0],
        color: [95, 60, 35],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      // Backrest Cushion Padding
      instances.push({
        id: 'ch_back_pad',
        name: 'BackrestPadding',
        className: 'Part',
        shape: 'Block',
        size: [2.0, 2.0, 0.2],
        position: [0, 3.0, -0.9],
        rotation: [0, 0, 0],
        color: [180, 35, 45],
        material: 'Fabric',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Golden Royal Finial on Backrest Top
      instances.push({
        id: 'ch_crown_crest',
        name: 'RoyalChairCrown',
        className: 'Part',
        shape: 'Block',
        size: [1.4, 0.7, 0.35],
        position: [0, 4.7, -1.05],
        rotation: [0, 0, 0],
        color: [230, 190, 50],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Embedded Emerald in Crown
      instances.push({
        id: 'ch_emerald',
        name: 'CrownEmerald',
        className: 'Part',
        shape: 'Ball',
        size: [0.4, 0.4, 0.4],
        position: [0, 4.7, -0.85],
        rotation: [0, 0, 0],
        color: [30, 220, 110],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'StylizedArmchair', instances, primaryPartId: 'ch_seat' };
  }

  public static buildTable(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Banquet Tabletop
    const top: RobloxPartIR = {
      id: 'tb_top',
      name: 'BanquetTabletop',
      className: 'Part',
      shape: 'Block',
      size: [6.4, 0.45, 3.6],
      position: [0, 2.6, 0],
      rotation: [0, 0, 0],
      color: [110, 70, 40],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    };
    instances.push(top);

    // 4 Heavy Turned Legs
    for (const [x, z, suf] of [
      [-2.8, 1.4, 'fl'],
      [2.8, 1.4, 'fr'],
      [-2.8, -1.4, 'bl'],
      [2.8, -1.4, 'br'],
    ] as const) {
      instances.push({
        id: `tb_leg_${suf}`,
        name: `TableLeg_${suf}`,
        className: 'Part',
        shape: 'Cylinder',
        size: [0.55, 2.4, 0.55],
        position: [x, 1.2, z],
        rotation: [0, 0, 0],
        color: [90, 55, 30],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    // Longitudinal Stretcher Beam
    instances.push({
      id: 'tb_stretcher',
      name: 'CenterStretcherBeam',
      className: 'Part',
      shape: 'Block',
      size: [5.6, 0.35, 0.35],
      position: [0, 0.6, 0],
      rotation: [0, 0, 0],
      color: [90, 55, 30],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Table Runner Cloth
      instances.push({
        id: 'tb_runner',
        name: 'TableRunnerCloth',
        className: 'Part',
        shape: 'Block',
        size: [6.5, 0.08, 1.4],
        position: [0, 2.85, 0],
        rotation: [0, 0, 0],
        color: [160, 40, 50],
        material: 'Fabric',
        anchored: true,
        canCollide: true,
      });

      // Wooden Tavern Plates (2x)
      instances.push({
        id: 'tb_plate_1',
        name: 'TavernPlateLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.9, 0.1, 0.9],
        position: [-1.6, 2.9, 0],
        rotation: [0, 0, 0],
        color: [140, 95, 55],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'tb_plate_2',
        name: 'TavernPlateRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.9, 0.1, 0.9],
        position: [1.6, 2.9, 0],
        rotation: [0, 0, 0],
        color: [140, 95, 55],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Center Brass Candlestick
      instances.push({
        id: 'tb_candlestick',
        name: 'BrassCandlestick',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.3, 0.8, 0.3],
        position: [0, 3.25, 0],
        rotation: [0, 0, 0],
        color: [225, 185, 50],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Candle Flame
      instances.push({
        id: 'tb_flame',
        name: 'CandleFlameNeon',
        className: 'Part',
        shape: 'Ball',
        size: [0.25, 0.45, 0.25],
        position: [0, 3.8, 0],
        rotation: [0, 0, 0],
        color: [255, 170, 30],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'RusticBanquetTable', instances, primaryPartId: 'tb_top' };
  }

  public static buildBookshelf(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Frame Backboard
    const frame: RobloxPartIR = {
      id: 'bk_base',
      name: 'BookshelfBackboard',
      className: 'Part',
      shape: 'Block',
      size: [4.4, 6.8, 0.3],
      position: [0, 3.4, -0.8],
      rotation: [0, 0, 0],
      color: [100, 60, 32],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    };
    instances.push(frame);

    // Left and Right Side Walls
    instances.push({
      id: 'bk_side_l',
      name: 'SideWallLeft',
      className: 'Part',
      shape: 'Block',
      size: [0.35, 6.8, 1.8],
      position: [-2.1, 3.4, 0],
      rotation: [0, 0, 0],
      color: [90, 55, 28],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'bk_side_r',
      name: 'SideWallRight',
      className: 'Part',
      shape: 'Block',
      size: [0.35, 6.8, 1.8],
      position: [2.1, 3.4, 0],
      rotation: [0, 0, 0],
      color: [90, 55, 28],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    // 4 Horizontal Shelves
    const shelfHeights = [0.4, 2.2, 4.0, 5.8, 6.7];
    for (let i = 0; i < shelfHeights.length; i++) {
      instances.push({
        id: `bk_shelf_${i}`,
        name: `ShelfBoard_${i}`,
        className: 'Part',
        shape: 'Block',
        size: [4.0, 0.25, 1.7],
        position: [0, shelfHeights[i], 0],
        rotation: [0, 0, 0],
        color: [95, 58, 30],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 2) {
      // Books on Shelves (Clusters of colorful book spines)
      const bookColors: [number, number, number][] = [
        [160, 40, 40], // Red
        [40, 80, 160], // Blue
        [40, 130, 60], // Green
        [180, 140, 40], // Gold
        [80, 40, 90], // Purple
      ];

      for (let s = 1; s <= 3; s++) {
        for (let b = 0; b < 4; b++) {
          const col = bookColors[(s + b) % bookColors.length];
          instances.push({
            id: `bk_book_${s}_${b}`,
            name: `TomeSpine_${s}_${b}`,
            className: 'Part',
            shape: 'Block',
            size: [0.35, 1.3, 1.1],
            position: [-1.4 + b * 0.75, shelfHeights[s] + 0.75, 0],
            rotation: [0, 0, 0],
            color: col,
            material: 'SmoothPlastic',
            anchored: true,
            canCollide: true,
          });
        }
      }
    }

    if (iteration >= 3) {
      // Top Crown Molding
      instances.push({
        id: 'bk_cornice',
        name: 'TopCrownMolding',
        className: 'Part',
        shape: 'Block',
        size: [4.8, 0.5, 2.1],
        position: [0, 6.95, 0],
        rotation: [0, 0, 0],
        color: [110, 68, 38],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      // Arcane Glowing Crystal Artifact on top shelf
      instances.push({
        id: 'bk_relic',
        name: 'GlowingArcaneOrb',
        className: 'Part',
        shape: 'Ball',
        size: [0.7, 0.7, 0.7],
        position: [1.2, 6.25, 0],
        rotation: [0, 0, 0],
        color: [0, 240, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'LibraryBookshelf', instances, primaryPartId: 'bk_base' };
  }

  public static buildSofa(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Seat Base
    const base: RobloxPartIR = {
      id: 'sf_base',
      name: 'SofaBaseFrame',
      className: 'Part',
      shape: 'Block',
      size: [6.2, 0.6, 3.2],
      position: [0, 0.7, 0],
      rotation: [0, 0, 0],
      color: [45, 55, 75],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    };
    instances.push(base);

    // Thick Backrest
    instances.push({
      id: 'sf_back',
      name: 'HighBackrest',
      className: 'Part',
      shape: 'Block',
      size: [6.2, 2.4, 0.8],
      position: [0, 2.1, -1.2],
      rotation: [0, 0, 0],
      color: [45, 55, 75],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });

    // Left and Right Arms
    instances.push({
      id: 'sf_arm_l',
      name: 'ArmrestLeft',
      className: 'Part',
      shape: 'Block',
      size: [0.8, 1.6, 3.2],
      position: [-2.9, 1.6, 0],
      rotation: [0, 0, 0],
      color: [40, 50, 70],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'sf_arm_r',
      name: 'ArmrestRight',
      className: 'Part',
      shape: 'Block',
      size: [0.8, 1.6, 3.2],
      position: [2.9, 1.6, 0],
      rotation: [0, 0, 0],
      color: [40, 50, 70],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });

    // 2 Deep Seat Cushions
    instances.push({
      id: 'sf_cushion_l',
      name: 'SeatCushionLeft',
      className: 'Part',
      shape: 'Block',
      size: [2.4, 0.5, 2.4],
      position: [-1.3, 1.25, 0.3],
      rotation: [0, 0, 0],
      color: [55, 68, 92],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'sf_cushion_r',
      name: 'SeatCushionRight',
      className: 'Part',
      shape: 'Block',
      size: [2.4, 0.5, 2.4],
      position: [1.3, 1.25, 0.3],
      rotation: [0, 0, 0],
      color: [55, 68, 92],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // 4 Wooden Peg Feet
      for (const [x, z, suf] of [
        [-2.8, 1.3, 'fl'],
        [2.8, 1.3, 'fr'],
        [-2.8, -1.3, 'bl'],
        [2.8, -1.3, 'br'],
      ] as const) {
        instances.push({
          id: `sf_foot_${suf}`,
          name: `WoodPegFoot_${suf}`,
          className: 'Part',
          shape: 'Cylinder',
          size: [0.35, 0.45, 0.35],
          position: [x, 0.22, z],
          rotation: [0, 0, 0],
          color: [110, 70, 40],
          material: 'Wood',
          anchored: true,
          canCollide: true,
        });
      }

      // Throw Pillows
      instances.push({
        id: 'sf_pillow_l',
        name: 'ThrowPillowLeft',
        className: 'Part',
        shape: 'Block',
        size: [1.1, 1.1, 0.35],
        position: [-2.1, 1.8, -0.4],
        rotation: [15, 20, 0],
        color: [225, 175, 60],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });

      instances.push({
        id: 'sf_pillow_r',
        name: 'ThrowPillowRight',
        className: 'Part',
        shape: 'Block',
        size: [1.1, 1.1, 0.35],
        position: [2.1, 1.8, -0.4],
        rotation: [15, -20, 0],
        color: [200, 75, 60],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Draped Blanket
      instances.push({
        id: 'sf_blanket',
        name: 'DrapedThrowBlanket',
        className: 'Part',
        shape: 'Block',
        size: [1.6, 0.08, 2.2],
        position: [0.8, 1.45, 0.5],
        rotation: [0, 8, 0],
        color: [230, 225, 215],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'LivingRoomSofa', instances, primaryPartId: 'sf_base' };
  }

  public static buildStreetLamp(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Heavy Cast-Iron Fluted Base
    const base: RobloxPartIR = {
      id: 'lp_base',
      name: 'LampCastIronBase',
      className: 'Part',
      shape: 'Cylinder',
      size: [1.6, 0.8, 1.6],
      position: [0, 0.4, 0],
      rotation: [0, 0, 0],
      color: [40, 44, 52],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    };
    instances.push(base);

    // Tall Tapered Pole
    instances.push({
      id: 'lp_pole',
      name: 'LampPostPole',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.45, 7.2, 0.45],
      position: [0, 4.4, 0],
      rotation: [0, 0, 0],
      color: [35, 38, 45],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Lantern Bracket Collar
    instances.push({
      id: 'lp_collar',
      name: 'LanternCollar',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.9, 0.4, 0.9],
      position: [0, 8.2, 0],
      rotation: [0, 0, 0],
      color: [40, 44, 52],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Glass Lantern Housing
    instances.push({
      id: 'lp_glass',
      name: 'LanternGlassEnclosure',
      className: 'Part',
      shape: 'Block',
      size: [1.2, 1.6, 1.2],
      position: [0, 9.2, 0],
      rotation: [0, 0, 0],
      color: [220, 240, 255],
      material: 'Glass',
      transparency: 0.5,
      anchored: true,
      canCollide: true,
    });

    // Glowing Filament Bulb
    instances.push({
      id: 'lp_bulb',
      name: 'FilamentGlowBulb',
      className: 'Part',
      shape: 'Ball',
      size: [0.65, 0.65, 0.65],
      position: [0, 9.2, 0],
      rotation: [0, 0, 0],
      color: [255, 220, 100],
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    if (iteration >= 2) {
      // Pyramid Lantern Cap/Roof
      instances.push({
        id: 'lp_cap',
        name: 'LanternPyramidCap',
        className: 'WedgePart',
        shape: 'Wedge',
        size: [1.4, 0.7, 1.4],
        position: [0, 10.35, 0],
        rotation: [0, 0, 0],
        color: [35, 38, 45],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Horizontal Ladder Crossbar
      instances.push({
        id: 'lp_ladder_bar',
        name: 'LadderRestBar',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 1.8, 0.15],
        position: [0, 7.6, 0],
        rotation: [0, 0, 90],
        color: [40, 44, 52],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Hanging Iron Town Sign
      instances.push({
        id: 'lp_sign',
        name: 'HangingBrassSign',
        className: 'Part',
        shape: 'Block',
        size: [1.2, 0.6, 0.08],
        position: [0.8, 7.1, 0],
        rotation: [0, 0, 0],
        color: [210, 170, 50],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });

      // Top Finial Spike
      instances.push({
        id: 'lp_finial',
        name: 'LanternTopSpire',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.6, 0.15],
        position: [0, 10.9, 0],
        rotation: [0, 0, 0],
        color: [225, 185, 50],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'VictorianStreetlamp', instances, primaryPartId: 'lp_base' };
  }

  // ============================================================
  // 3. ARCHITECTURE & STRUCTURES
  // ============================================================

  public static buildTower(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Circular Foundation Base
    const base: RobloxPartIR = {
      id: 'tw_base',
      name: 'TowerPlinthBase',
      className: 'Part',
      shape: 'Cylinder',
      size: [6.4, 1.2, 6.4],
      position: [0, 0.6, 0],
      rotation: [0, 0, 0],
      color: [95, 100, 105],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    };
    instances.push(base);

    // Main Cylindrical Tower Shaft
    instances.push({
      id: 'tw_shaft',
      name: 'TowerStoneShaft',
      className: 'Part',
      shape: 'Cylinder',
      size: [5.2, 10.4, 5.2],
      position: [0, 6.4, 0],
      rotation: [0, 0, 0],
      color: [115, 120, 125],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Overhanging Battlement Platform Rim
    instances.push({
      id: 'tw_deck',
      name: 'BattlementObservationDeck',
      className: 'Part',
      shape: 'Cylinder',
      size: [6.8, 1.0, 6.8],
      position: [0, 12.1, 0],
      rotation: [0, 0, 0],
      color: [95, 100, 105],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Arched Wood Entrance Door
    instances.push({
      id: 'tw_door',
      name: 'ReinforcedTowerDoor',
      className: 'Part',
      shape: 'Block',
      size: [1.8, 3.2, 0.4],
      position: [0, 2.2, 2.5],
      rotation: [0, 0, 0],
      color: [90, 55, 30],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // 4 Crenellation Merlons on Top Deck
      for (const [x, z, suf] of [
        [0, 3.0, 'n'],
        [0, -3.0, 's'],
        [3.0, 0, 'e'],
        [-3.0, 0, 'w'],
      ] as const) {
        instances.push({
          id: `tw_merlon_${suf}`,
          name: `BattlementMerlon_${suf}`,
          className: 'Part',
          shape: 'Block',
          size: [1.4, 1.4, 0.8],
          position: [x, 13.3, z],
          rotation: [0, 0, 0],
          color: [115, 120, 125],
          material: 'Cobblestone',
          anchored: true,
          canCollide: true,
        });
      }

      // Arrow Slit Windows
      instances.push({
        id: 'tw_window_1',
        name: 'ArrowSlitWindowMid',
        className: 'Part',
        shape: 'Block',
        size: [0.4, 1.6, 0.3],
        position: [0, 7.2, 2.55],
        rotation: [0, 0, 0],
        color: [30, 35, 45],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Beacon Fire Brazier on Top Platform
      instances.push({
        id: 'tw_brazier',
        name: 'SignalFireBrazier',
        className: 'Part',
        shape: 'Cylinder',
        size: [1.6, 0.8, 1.6],
        position: [0, 13.0, 0],
        rotation: [0, 0, 0],
        color: [55, 60, 68],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Roaring Beacon Flame
      instances.push({
        id: 'tw_beacon_flame',
        name: 'BeaconSignalFlame',
        className: 'Part',
        shape: 'Ball',
        size: [1.8, 2.4, 1.8],
        position: [0, 14.5, 0],
        rotation: [0, 0, 0],
        color: [255, 140, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'WatchtowerPost', instances, primaryPartId: 'tw_base' };
  }

  public static buildHouse(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Stone Foundation Plinth
    const base: RobloxPartIR = {
      id: 'hs_base',
      name: 'HouseFoundationPlinth',
      className: 'Part',
      shape: 'Block',
      size: [8.8, 0.8, 7.2],
      position: [0, 0.4, 0],
      rotation: [0, 0, 0],
      color: [95, 100, 105],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    };
    instances.push(base);

    // Main Brick Walls Body
    instances.push({
      id: 'hs_walls',
      name: 'MainLivingWalls',
      className: 'Part',
      shape: 'Block',
      size: [8.2, 5.0, 6.6],
      position: [0, 3.3, 0],
      rotation: [0, 0, 0],
      color: [160, 145, 130],
      material: 'Brick',
      anchored: true,
      canCollide: true,
    });

    // Peaked Gabled Roof - Left Slope
    instances.push({
      id: 'hs_roof_l',
      name: 'GabledRoofLeft',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [3.8, 2.4, 7.2],
      position: [-2.1, 7.0, 0],
      rotation: [0, 0, 0],
      color: [140, 55, 45],
      material: 'Slate',
      anchored: true,
      canCollide: true,
    });

    // Peaked Gabled Roof - Right Slope
    instances.push({
      id: 'hs_roof_r',
      name: 'GabledRoofRight',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [3.8, 2.4, 7.2],
      position: [2.1, 7.0, 0],
      rotation: [0, 180, 0],
      color: [140, 55, 45],
      material: 'Slate',
      anchored: true,
      canCollide: true,
    });

    // Front Wooden Door
    instances.push({
      id: 'hs_door',
      name: 'FrontCottageDoor',
      className: 'Part',
      shape: 'Block',
      size: [1.8, 3.4, 0.3],
      position: [-1.4, 2.5, 3.45],
      rotation: [0, 0, 0],
      color: [110, 65, 35],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Glass Windows (Front & Side)
      instances.push({
        id: 'hs_window_f',
        name: 'FrontLivingWindow',
        className: 'Part',
        shape: 'Block',
        size: [2.0, 1.8, 0.25],
        position: [1.8, 3.2, 3.42],
        rotation: [0, 0, 0],
        color: [160, 220, 245],
        material: 'Glass',
        transparency: 0.35,
        anchored: true,
        canCollide: true,
      });

      // Brick Chimney
      instances.push({
        id: 'hs_chimney',
        name: 'StoneChimneyFlue',
        className: 'Part',
        shape: 'Block',
        size: [1.4, 6.2, 1.4],
        position: [2.6, 6.0, -1.8],
        rotation: [0, 0, 0],
        color: [120, 50, 40],
        material: 'Brick',
        anchored: true,
        canCollide: true,
      });

      // Window Flower Box
      instances.push({
        id: 'hs_flowerbox',
        name: 'WindowFlowerBox',
        className: 'Part',
        shape: 'Block',
        size: [2.2, 0.5, 0.6],
        position: [1.8, 2.05, 3.6],
        rotation: [0, 0, 0],
        color: [100, 62, 32],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Smoke Cloud Puff from Chimney
      instances.push({
        id: 'hs_smoke_puff',
        name: 'ChimneySmokePuff',
        className: 'Part',
        shape: 'Ball',
        size: [1.1, 1.1, 1.1],
        position: [2.6, 9.6, -1.8],
        rotation: [0, 0, 0],
        color: [220, 225, 230],
        material: 'SmoothPlastic',
        transparency: 0.5,
        anchored: true,
        canCollide: false,
      });

      // Warm Porch Lantern
      instances.push({
        id: 'hs_porch_lantern',
        name: 'PorchLanternGlow',
        className: 'Part',
        shape: 'Ball',
        size: [0.5, 0.5, 0.5],
        position: [-2.7, 3.6, 3.6],
        rotation: [0, 0, 0],
        color: [255, 200, 60],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'MedievalCottage', instances, primaryPartId: 'hs_base' };
  }

  public static buildBridge(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Center Bridge Deck
    const deck: RobloxPartIR = {
      id: 'br_deck',
      name: 'MainBridgeDeck',
      className: 'Part',
      shape: 'Block',
      size: [12.0, 0.8, 4.4],
      position: [0, 2.8, 0],
      rotation: [0, 0, 0],
      color: [115, 120, 125],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    };
    instances.push(deck);

    // Left Approach Ramp
    instances.push({
      id: 'br_ramp_l',
      name: 'ApproachRampLeft',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [4.2, 2.4, 4.4],
      position: [-8.1, 1.6, 0],
      rotation: [0, 0, 0],
      color: [115, 120, 125],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Right Approach Ramp
    instances.push({
      id: 'br_ramp_r',
      name: 'ApproachRampRight',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [4.2, 2.4, 4.4],
      position: [8.1, 1.6, 0],
      rotation: [0, 180, 0],
      color: [115, 120, 125],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Central Under-Arch Abutment Pier
    instances.push({
      id: 'br_arch_pier',
      name: 'CentralArchAbutment',
      className: 'Part',
      shape: 'Cylinder',
      size: [4.2, 4.8, 4.2],
      position: [0, 1.2, 0],
      rotation: [0, 0, 90],
      color: [95, 100, 105],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // North and South Stone Railing Walls
      instances.push({
        id: 'br_rail_n',
        name: 'ParapetRailingNorth',
        className: 'Part',
        shape: 'Block',
        size: [12.0, 1.2, 0.5],
        position: [0, 3.8, 2.0],
        rotation: [0, 0, 0],
        color: [105, 110, 115],
        material: 'Cobblestone',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'br_rail_s',
        name: 'ParapetRailingSouth',
        className: 'Part',
        shape: 'Block',
        size: [12.0, 1.2, 0.5],
        position: [0, 3.8, -2.0],
        rotation: [0, 0, 0],
        color: [105, 110, 115],
        material: 'Cobblestone',
        anchored: true,
        canCollide: true,
      });

      // 4 Corner Newel Posts
      for (const [x, z, suf] of [
        [-5.8, 2.0, 'fl'],
        [5.8, 2.0, 'fr'],
        [-5.8, -2.0, 'bl'],
        [5.8, -2.0, 'br'],
      ] as const) {
        instances.push({
          id: `br_post_${suf}`,
          name: `NewelPost_${suf}`,
          className: 'Part',
          shape: 'Block',
          size: [0.8, 1.8, 0.8],
          position: [x, 4.1, z],
          rotation: [0, 0, 0],
          color: [90, 95, 100],
          material: 'Cobblestone',
          anchored: true,
          canCollide: true,
        });
      }
    }

    if (iteration >= 3) {
      // Lanterns atop Bridge Posts
      instances.push({
        id: 'br_lamp_l',
        name: 'BridgeLanternGlowLeft',
        className: 'Part',
        shape: 'Ball',
        size: [0.55, 0.55, 0.55],
        position: [-5.8, 5.3, 2.0],
        rotation: [0, 0, 0],
        color: [255, 210, 70],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      instances.push({
        id: 'br_lamp_r',
        name: 'BridgeLanternGlowRight',
        className: 'Part',
        shape: 'Ball',
        size: [0.55, 0.55, 0.55],
        position: [5.8, 5.3, -2.0],
        rotation: [0, 0, 0],
        color: [255, 210, 70],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'StoneArchBridge', instances, primaryPartId: 'br_deck' };
  }

  public static buildFortifiedDoor(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Stone Frame Lintel Header
    const lintel: RobloxPartIR = {
      id: 'dr_frame_top',
      name: 'StoneFrameLintel',
      className: 'Part',
      shape: 'Block',
      size: [6.8, 1.4, 1.8],
      position: [0, 7.3, 0],
      rotation: [0, 0, 0],
      color: [95, 100, 108],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    };
    instances.push(lintel);

    // Stone Frame Jambs Left and Right
    instances.push({
      id: 'dr_jamb_l',
      name: 'StoneJambLeft',
      className: 'Part',
      shape: 'Block',
      size: [1.4, 6.8, 1.8],
      position: [-2.7, 3.4, 0],
      rotation: [0, 0, 0],
      color: [95, 100, 108],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'dr_jamb_r',
      name: 'StoneJambRight',
      className: 'Part',
      shape: 'Block',
      size: [1.4, 6.8, 1.8],
      position: [2.7, 3.4, 0],
      rotation: [0, 0, 0],
      color: [95, 100, 108],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Left and Right Massive Oak Doors
    instances.push({
      id: 'dr_leaf_l',
      name: 'OakDoorLeafLeft',
      className: 'Part',
      shape: 'Block',
      size: [2.0, 6.4, 0.45],
      position: [-1.0, 3.2, 0],
      rotation: [0, 0, 0],
      color: [100, 60, 32],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'dr_leaf_r',
      name: 'OakDoorLeafRight',
      className: 'Part',
      shape: 'Block',
      size: [2.0, 6.4, 0.45],
      position: [1.0, 3.2, 0],
      rotation: [0, 0, 0],
      color: [100, 60, 32],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Forged Iron Cross-Bands (Upper & Lower)
      for (const y of [1.6, 4.8]) {
        instances.push({
          id: `dr_band_${y}`,
          name: `IronCrossBand_${y}`,
          className: 'Part',
          shape: 'Block',
          size: [4.1, 0.35, 0.55],
          position: [0, y, 0],
          rotation: [0, 0, 0],
          color: [55, 60, 68],
          material: 'Metal',
          anchored: true,
          canCollide: true,
        });
      }

      // Massive Iron Door Pull Rings
      instances.push({
        id: 'dr_ring_l',
        name: 'IronPullRingLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.7, 0.7],
        position: [-0.6, 3.2, 0.35],
        rotation: [90, 0, 0],
        color: [60, 65, 72],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'dr_ring_r',
        name: 'IronPullRingRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.7, 0.7],
        position: [0.6, 3.2, 0.35],
        rotation: [90, 0, 0],
        color: [60, 65, 72],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Wall Torch Sconces on Stone Pillars
      instances.push({
        id: 'dr_torch_l',
        name: 'DungeonTorchFlameLeft',
        className: 'Part',
        shape: 'Ball',
        size: [0.55, 0.75, 0.55],
        position: [-2.7, 4.4, 1.0],
        rotation: [0, 0, 0],
        color: [255, 130, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      instances.push({
        id: 'dr_torch_r',
        name: 'DungeonTorchFlameRight',
        className: 'Part',
        shape: 'Ball',
        size: [0.55, 0.75, 0.55],
        position: [2.7, 4.4, 1.0],
        rotation: [0, 0, 0],
        color: [255, 130, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'FortifiedDungeonDoor', instances, primaryPartId: 'dr_frame_top' };
  }

  // ============================================================
  // 4. VEHICLES & TRANSPORT
  // ============================================================

  public static buildVehicle(iteration: number, isTruck: boolean): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Chassis
    const chassis: RobloxPartIR = {
      id: 'vh_body',
      name: isTruck ? 'TruckChassis' : 'BuggyChassis',
      className: 'Part',
      shape: 'Block',
      size: isTruck ? [4.2, 1.6, 8.4] : [3.8, 1.2, 6.2],
      position: [0, 1.6, 0],
      rotation: [0, 0, 0],
      color: isTruck ? [40, 85, 160] : [220, 50, 45],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    };
    instances.push(chassis);

    // Cabin Block
    instances.push({
      id: 'vh_cab',
      name: 'VehicleCabin',
      className: 'Part',
      shape: 'Block',
      size: isTruck ? [4.0, 2.2, 3.8] : [3.4, 1.8, 3.2],
      position: [0, 3.3, isTruck ? 1.4 : -0.2],
      rotation: [0, 0, 0],
      color: isTruck ? [40, 85, 160] : [220, 50, 45],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Windshield
    instances.push({
      id: 'vh_windshield',
      name: 'CabinWindshield',
      className: 'Part',
      shape: 'Block',
      size: [3.4, 1.4, 0.25],
      position: [0, 3.4, isTruck ? 3.35 : 1.45],
      rotation: [-20, 0, 0],
      color: [140, 210, 245],
      material: 'Glass',
      transparency: 0.35,
      anchored: true,
      canCollide: true,
    });

    // 4 Heavy-Duty Wheels
    const wheelPositions = isTruck
      ? [
          [-2.3, 1.0, 2.6],
          [2.3, 1.0, 2.6],
          [-2.3, 1.0, -2.4],
          [2.3, 1.0, -2.4],
        ]
      : [
          [-2.1, 0.9, 1.9],
          [2.1, 0.9, 1.9],
          [-2.1, 0.9, -1.9],
          [2.1, 0.9, -1.9],
        ];

    for (let i = 0; i < wheelPositions.length; i++) {
      const [wx, wy, wz] = wheelPositions[i];
      instances.push({
        id: `vh_wheel_${i}`,
        name: `AllTerrainTire_${i}`,
        className: 'Part',
        shape: 'Cylinder',
        size: [0.9, 1.8, 1.8],
        position: [wx, wy, wz],
        rotation: [0, 0, 90],
        color: [30, 30, 35],
        material: 'SmoothPlastic',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 2) {
      // Front Headlights
      instances.push({
        id: 'vh_light_l',
        name: 'HeadlightLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.25, 0.6, 0.6],
        position: [-1.4, 2.0, isTruck ? 4.25 : 3.15],
        rotation: [90, 0, 0],
        color: [255, 240, 150],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      instances.push({
        id: 'vh_light_r',
        name: 'HeadlightRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.25, 0.6, 0.6],
        position: [1.4, 2.0, isTruck ? 4.25 : 3.15],
        rotation: [90, 0, 0],
        color: [255, 240, 150],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      // Front Bull Bar Bumper
      instances.push({
        id: 'vh_bumper',
        name: 'BullBarBumper',
        className: 'Part',
        shape: 'Block',
        size: [4.4, 0.6, 0.5],
        position: [0, 1.4, isTruck ? 4.4 : 3.3],
        rotation: [0, 0, 0],
        color: [55, 60, 68],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Taillights
      instances.push({
        id: 'vh_tail_l',
        name: 'TaillightLeft',
        className: 'Part',
        shape: 'Block',
        size: [0.6, 0.4, 0.15],
        position: [-1.4, 2.0, isTruck ? -4.25 : -3.15],
        rotation: [0, 0, 0],
        color: [255, 30, 30],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      instances.push({
        id: 'vh_tail_r',
        name: 'TaillightRight',
        className: 'Part',
        shape: 'Block',
        size: [0.6, 0.4, 0.15],
        position: [1.4, 2.0, isTruck ? -4.25 : -3.15],
        rotation: [0, 0, 0],
        color: [255, 30, 30],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Chrome Exhaust Stack or Rollbar
      instances.push({
        id: 'vh_exhaust',
        name: 'ChromeExhaustStack',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.35, 2.6, 0.35],
        position: [1.9, 3.8, isTruck ? 0.6 : -1.8],
        rotation: [0, 0, 0],
        color: [220, 225, 235],
        material: 'Metal',
        reflectance: 0.5,
        anchored: true,
        canCollide: false,
      });
    }

    return { name: isTruck ? 'HeavyDutyTruck' : 'StylizedBuggy', instances, primaryPartId: 'vh_body' };
  }

  public static buildPirateShip(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Wooden Hull
    const hull: RobloxPartIR = {
      id: 'sh_hull',
      name: 'GalleonHull',
      className: 'Part',
      shape: 'Block',
      size: [6.4, 3.4, 14.8],
      position: [0, 1.7, 0],
      rotation: [0, 0, 0],
      color: [95, 58, 30],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    };
    instances.push(hull);

    // Pointed Bow Wedge (Front of ship)
    instances.push({
      id: 'sh_bow',
      name: 'ClipperBowWedge',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [6.4, 3.4, 4.8],
      position: [0, 1.7, 9.8],
      rotation: [0, 180, 0],
      color: [95, 58, 30],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    // Raised Stern Quarterdeck (Back castle)
    instances.push({
      id: 'sh_stern_castle',
      name: 'SternQuarterdeck',
      className: 'Part',
      shape: 'Block',
      size: [6.4, 2.4, 4.4],
      position: [0, 4.6, -5.2],
      rotation: [0, 0, 0],
      color: [110, 68, 36],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    // Tall Main Mast
    instances.push({
      id: 'sh_main_mast',
      name: 'MainMastSpar',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.8, 12.0, 0.8],
      position: [0, 9.4, 1.2],
      rotation: [0, 0, 0],
      color: [125, 80, 45],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    // Main Cross Yardarm & Billowing Sail
    instances.push({
      id: 'sh_yardarm',
      name: 'MainYardarm',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.35, 7.8, 0.35],
      position: [0, 12.0, 1.2],
      rotation: [0, 0, 90],
      color: [125, 80, 45],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    instances.push({
      id: 'sh_sail',
      name: 'BillowingMainSail',
      className: 'Part',
      shape: 'Block',
      size: [7.2, 5.2, 0.25],
      position: [0, 9.4, 1.6],
      rotation: [0, 0, 0],
      color: [240, 235, 220],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Crow's Nest
      instances.push({
        id: 'sh_crows_nest',
        name: 'CrowsNestLookout',
        className: 'Part',
        shape: 'Cylinder',
        size: [2.0, 1.2, 2.0],
        position: [0, 14.6, 1.2],
        rotation: [0, 0, 0],
        color: [90, 55, 28],
        material: 'WoodPlanks',
        anchored: true,
        canCollide: true,
      });

      // Bowsprit Spar (Forward pointing pole)
      instances.push({
        id: 'sh_bowsprit',
        name: 'BowspritSpar',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.45, 5.4, 0.45],
        position: [0, 4.4, 13.8],
        rotation: [-30, 0, 0],
        color: [125, 80, 45],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      // Port & Starboard Broadside Cannons
      instances.push({
        id: 'sh_cannon_l',
        name: 'BroadsideCannonPort',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.6, 2.2, 0.6],
        position: [-3.4, 3.6, -0.6],
        rotation: [0, 0, 90],
        color: [45, 48, 55],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'sh_cannon_r',
        name: 'BroadsideCannonStarboard',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.6, 2.2, 0.6],
        position: [3.4, 3.6, -0.6],
        rotation: [0, 0, 90],
        color: [45, 48, 55],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Black Pirate Jolly Roger Flag atop Mast
      instances.push({
        id: 'sh_flag',
        name: 'JollyRogerFlag',
        className: 'Part',
        shape: 'Block',
        size: [2.2, 1.4, 0.08],
        position: [1.2, 15.8, 1.2],
        rotation: [0, 0, 0],
        color: [25, 25, 30],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });

      // Stern Captain's Brass Lantern
      instances.push({
        id: 'sh_stern_lantern',
        name: 'CaptainGalleryLantern',
        className: 'Part',
        shape: 'Ball',
        size: [0.8, 0.8, 0.8],
        position: [0, 6.2, -7.6],
        rotation: [0, 0, 0],
        color: [255, 180, 40],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'PirateGalleon', instances, primaryPartId: 'sh_hull' };
  }

  public static buildHelicopter(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Cockpit & Cabin Fuselage
    const fuse: RobloxPartIR = {
      id: 'hc_fuse',
      name: 'HelicopterFuselage',
      className: 'Part',
      shape: 'Block',
      size: [3.2, 2.8, 6.6],
      position: [0, 3.4, 0],
      rotation: [0, 0, 0],
      color: [65, 75, 60],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    };
    instances.push(fuse);

    // Front Cockpit Glass Canopy
    instances.push({
      id: 'hc_cockpit',
      name: 'CockpitCanopyGlass',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [3.0, 2.2, 2.4],
      position: [0, 3.3, 4.5],
      rotation: [0, 180, 0],
      color: [100, 200, 245],
      material: 'Glass',
      transparency: 0.4,
      anchored: true,
      canCollide: true,
    });

    // Tapered Tail Boom
    instances.push({
      id: 'hc_boom',
      name: 'TailBoomStrut',
      className: 'Part',
      shape: 'Block',
      size: [1.1, 1.2, 7.8],
      position: [0, 3.9, -6.8],
      rotation: [0, 0, 0],
      color: [65, 75, 60],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Main Rotor Mast
    instances.push({
      id: 'hc_rotor_mast',
      name: 'MainRotorMast',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.6, 1.2, 0.6],
      position: [0, 5.4, 0.6],
      rotation: [0, 0, 0],
      color: [40, 42, 48],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Main Rotor Blades (Cross of 2 long thin bars)
    instances.push({
      id: 'hc_blade_1',
      name: 'RotorBladeSpan1',
      className: 'Part',
      shape: 'Block',
      size: [0.4, 0.08, 12.0],
      position: [0, 6.05, 0.6],
      rotation: [0, 0, 0],
      color: [30, 30, 35],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'hc_blade_2',
      name: 'RotorBladeSpan2',
      className: 'Part',
      shape: 'Block',
      size: [12.0, 0.08, 0.4],
      position: [0, 6.05, 0.6],
      rotation: [0, 0, 0],
      color: [30, 30, 35],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Left and Right Landing Skids
    instances.push({
      id: 'hc_skid_l',
      name: 'LandingSkidLeft',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.25, 7.6, 0.25],
      position: [-2.0, 0.5, 0],
      rotation: [90, 0, 0],
      color: [40, 44, 50],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'hc_skid_r',
      name: 'LandingSkidRight',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.25, 7.6, 0.25],
      position: [2.0, 0.5, 0],
      rotation: [90, 0, 0],
      color: [40, 44, 50],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Vertical Tail Fin & Tail Rotor
      instances.push({
        id: 'hc_tail_fin',
        name: 'VerticalTailFin',
        className: 'Part',
        shape: 'Block',
        size: [0.25, 2.4, 1.6],
        position: [0, 4.9, -10.5],
        rotation: [0, 0, 0],
        color: [65, 75, 60],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'hc_tail_rotor',
        name: 'TailAntiTorqueRotor',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 2.4, 2.4],
        position: [0.25, 4.9, -10.5],
        rotation: [0, 0, 90],
        color: [30, 30, 35],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // High-Intensity Searchlight beneath Nose
      instances.push({
        id: 'hc_searchlight',
        name: 'NoseSearchlight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.7, 0.6, 0.7],
        position: [0, 1.8, 4.2],
        rotation: [45, 0, 0],
        color: [255, 255, 220],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'TacticalHelicopter', instances, primaryPartId: 'hc_fuse' };
  }

  public static buildMotorcycle(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Frame Spine
    const frame: RobloxPartIR = {
      id: 'mb_frame',
      name: 'ChopperBikeFrame',
      className: 'Part',
      shape: 'Block',
      size: [0.8, 1.4, 4.8],
      position: [0, 1.8, 0],
      rotation: [0, 0, 0],
      color: [40, 44, 52],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    };
    instances.push(frame);

    // Front Wheel
    instances.push({
      id: 'mb_wheel_f',
      name: 'FrontTireWheel',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.65, 2.2, 2.2],
      position: [0, 1.1, 2.8],
      rotation: [0, 0, 90],
      color: [30, 30, 35],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    // Rear Wheel
    instances.push({
      id: 'mb_wheel_r',
      name: 'RearTireWheel',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.85, 2.2, 2.2],
      position: [0, 1.1, -2.4],
      rotation: [0, 0, 90],
      color: [30, 30, 35],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    // Teardrop Fuel Tank
    instances.push({
      id: 'mb_tank',
      name: 'TeardropFuelTank',
      className: 'Part',
      shape: 'Ball',
      size: [1.2, 1.0, 1.8],
      position: [0, 2.6, 0.6],
      rotation: [0, 0, 0],
      color: [215, 35, 40],
      material: 'SmoothPlastic',
      reflectance: 0.35,
      anchored: true,
      canCollide: true,
    });

    // Leather Saddle Seat
    instances.push({
      id: 'mb_seat',
      name: 'LeatherSaddleSeat',
      className: 'Part',
      shape: 'Block',
      size: [1.0, 0.4, 1.4],
      position: [0, 2.3, -0.7],
      rotation: [-10, 0, 0],
      color: [55, 35, 22],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });

    // V-Twin Engine Block
    instances.push({
      id: 'mb_engine',
      name: 'VTwinEngineBlock',
      className: 'Part',
      shape: 'Block',
      size: [0.9, 1.1, 1.4],
      position: [0, 1.2, 0.1],
      rotation: [0, 0, 0],
      color: [140, 145, 155],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Front Triple Tree Fork Tubes
      instances.push({
        id: 'mb_fork_l',
        name: 'ForkTubeLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 3.4, 0.15],
        position: [-0.5, 1.9, 2.0],
        rotation: [28, 0, 0],
        color: [220, 225, 235],
        material: 'Metal',
        reflectance: 0.5,
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'mb_fork_r',
        name: 'ForkTubeRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 3.4, 0.15],
        position: [0.5, 1.9, 2.0],
        rotation: [28, 0, 0],
        color: [220, 225, 235],
        material: 'Metal',
        reflectance: 0.5,
        anchored: true,
        canCollide: true,
      });

      // Handlebars
      instances.push({
        id: 'mb_bars',
        name: 'ApeHangerHandlebars',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 2.2, 0.15],
        position: [0, 3.2, 1.3],
        rotation: [0, 0, 90],
        color: [220, 225, 235],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Dual Chrome Exhaust Pipes
      instances.push({
        id: 'mb_pipe',
        name: 'ChromeStraightPipe',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.25, 2.8, 0.25],
        position: [0.65, 1.0, -1.2],
        rotation: [85, 0, 0],
        color: [220, 225, 235],
        material: 'Metal',
        reflectance: 0.6,
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Round Chrome Headlight
      instances.push({
        id: 'mb_headlight',
        name: 'RoundChromeHeadlight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.65, 0.45, 0.65],
        position: [0, 2.7, 2.4],
        rotation: [90, 0, 0],
        color: [255, 240, 160],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'ChopperMotorcycle', instances, primaryPartId: 'mb_frame' };
  }

  // ============================================================
  // 5. CREATURES & CHARACTERS
  // ============================================================

  public static buildGolem(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Massive Jagged Boulder Torso
    const torso: RobloxPartIR = {
      id: 'gl_torso',
      name: 'GolemStoneTorso',
      className: 'Part',
      shape: 'Block',
      size: [4.4, 3.6, 3.2],
      position: [0, 5.0, 0],
      rotation: [0, 0, 0],
      color: [110, 115, 120],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    };
    instances.push(torso);

    // Stone Head Boulder
    instances.push({
      id: 'gl_head',
      name: 'CraggyGolemHead',
      className: 'Part',
      shape: 'Block',
      size: [1.8, 1.8, 1.8],
      position: [0, 7.3, 0.4],
      rotation: [0, 0, 0],
      color: [95, 100, 105],
      material: 'Granite',
      anchored: true,
      canCollide: true,
    });

    // Left Arm Heavy Boulders
    instances.push({
      id: 'gl_arm_l',
      name: 'LeftBoulderArm',
      className: 'Part',
      shape: 'Block',
      size: [1.6, 4.2, 1.6],
      position: [-3.2, 4.4, 0],
      rotation: [0, 0, 12],
      color: [105, 110, 115],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Right Arm Heavy Boulders
    instances.push({
      id: 'gl_arm_r',
      name: 'RightBoulderArm',
      className: 'Part',
      shape: 'Block',
      size: [1.6, 4.2, 1.6],
      position: [3.2, 4.4, 0],
      rotation: [0, 0, -12],
      color: [105, 110, 115],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Left and Right Pillar Legs
    instances.push({
      id: 'gl_leg_l',
      name: 'LeftPillarLeg',
      className: 'Part',
      shape: 'Block',
      size: [1.8, 3.2, 2.0],
      position: [-1.4, 1.6, 0],
      rotation: [0, 0, 0],
      color: [90, 95, 100],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    instances.push({
      id: 'gl_leg_r',
      name: 'RightPillarLeg',
      className: 'Part',
      shape: 'Block',
      size: [1.8, 3.2, 2.0],
      position: [1.4, 1.6, 0],
      rotation: [0, 0, 0],
      color: [90, 95, 100],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Overgrown Moss Patches
      instances.push({
        id: 'gl_moss_sh_l',
        name: 'ShoulderMossPatchLeft',
        className: 'Part',
        shape: 'Block',
        size: [1.8, 0.4, 1.8],
        position: [-3.1, 6.4, 0],
        rotation: [0, 0, 8],
        color: [60, 145, 65],
        material: 'Grass',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'gl_moss_back',
        name: 'BackMossPlate',
        className: 'Part',
        shape: 'Block',
        size: [3.4, 2.6, 0.4],
        position: [0, 5.2, -1.65],
        rotation: [0, 0, 0],
        color: [60, 145, 65],
        material: 'Grass',
        anchored: true,
        canCollide: true,
      });

      // Rock Pauldrons
      instances.push({
        id: 'gl_pauldron_l',
        name: 'PauldronBoulderLeft',
        className: 'Part',
        shape: 'Ball',
        size: [2.2, 2.2, 2.2],
        position: [-3.0, 6.2, 0],
        rotation: [0, 0, 0],
        color: [120, 125, 130],
        material: 'Granite',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'gl_pauldron_r',
        name: 'PauldronBoulderRight',
        className: 'Part',
        shape: 'Ball',
        size: [2.2, 2.2, 2.2],
        position: [3.0, 6.2, 0],
        rotation: [0, 0, 0],
        color: [120, 125, 130],
        material: 'Granite',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Glowing Molten/Arcane Core Eye
      instances.push({
        id: 'gl_eye_l',
        name: 'ArcaneEyeGlowLeft',
        className: 'Part',
        shape: 'Ball',
        size: [0.35, 0.35, 0.35],
        position: [-0.4, 7.4, 1.3],
        rotation: [0, 0, 0],
        color: [0, 240, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      instances.push({
        id: 'gl_eye_r',
        name: 'ArcaneEyeGlowRight',
        className: 'Part',
        shape: 'Ball',
        size: [0.35, 0.35, 0.35],
        position: [0.4, 7.4, 1.3],
        rotation: [0, 0, 0],
        color: [0, 240, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      // Elemental Core Heart in Chest
      instances.push({
        id: 'gl_heart',
        name: 'ElementalHeartCore',
        className: 'Part',
        shape: 'Ball',
        size: [1.2, 1.2, 1.2],
        position: [0, 5.0, 1.3],
        rotation: [0, 0, 0],
        color: [0, 240, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'StoneEarthGolem', instances, primaryPartId: 'gl_torso' };
  }
}

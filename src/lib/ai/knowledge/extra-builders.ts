// ============================================================
// Roblox Asset AI - Additional High-Tier Domain Asset Builders
// Expands coverage with Fountain, Well, Anvil, Cannon, Fence,
// Torch, Cauldron, Potion, Crown, and Staircase!
// ============================================================

import { RobloxPartIR, RobloxInstanceIR } from '../../types/roblox';
import { AssetGeneratorResult } from './roblox-asset-catalog';

export class ExtraBuilders {
  public static buildFountain(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Grand Marble Outer Basin
    const basin: RobloxPartIR = {
      id: 'ft_base',
      name: 'MarbleBasinBase',
      className: 'Part',
      shape: 'Cylinder',
      size: [8.4, 1.2, 8.4],
      position: [0, 0.6, 0],
      rotation: [0, 0, 0],
      color: [225, 225, 230],
      material: 'Marble',
      anchored: true,
      canCollide: true,
    };
    instances.push(basin);

    // Water Surface Pool
    instances.push({
      id: 'ft_water_pool',
      name: 'BasinWaterSurface',
      className: 'Part',
      shape: 'Cylinder',
      size: [7.6, 0.2, 7.6],
      position: [0, 1.15, 0],
      rotation: [0, 0, 0],
      color: [60, 170, 245],
      material: 'Glass',
      transparency: 0.35,
      anchored: true,
      canCollide: true,
    });

    // Central Pedestal Pillar
    instances.push({
      id: 'ft_pillar',
      name: 'PedestalColumn',
      className: 'Part',
      shape: 'Cylinder',
      size: [2.2, 3.4, 2.2],
      position: [0, 2.3, 0],
      rotation: [0, 0, 0],
      color: [215, 215, 220],
      material: 'Marble',
      anchored: true,
      canCollide: true,
    });

    // Upper Tier Basin
    instances.push({
      id: 'ft_upper_basin',
      name: 'UpperTierBasin',
      className: 'Part',
      shape: 'Cylinder',
      size: [4.4, 0.8, 4.4],
      position: [0, 4.0, 0],
      rotation: [0, 0, 0],
      color: [225, 225, 230],
      material: 'Marble',
      anchored: true,
      canCollide: true,
    });

    // Spouting Water Jet
    instances.push({
      id: 'ft_water_spout',
      name: 'SpoutingWaterJet',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.6, 2.8, 0.6],
      position: [0, 5.4, 0],
      rotation: [0, 0, 0],
      color: [140, 225, 255],
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    if (iteration >= 2) {
      // 4 Decorative Lion Head Carvings around upper rim
      for (const [x, z, suf] of [
        [0, 2.2, 'n'],
        [0, -2.2, 's'],
        [2.2, 0, 'e'],
        [-2.2, 0, 'w'],
      ] as const) {
        instances.push({
          id: `ft_gargoyle_${suf}`,
          name: `CarvedBasinFinial_${suf}`,
          className: 'Part',
          shape: 'Ball',
          size: [0.65, 0.65, 0.65],
          position: [x, 4.3, z],
          rotation: [0, 0, 0],
          color: [235, 195, 55],
          material: 'Metal',
          anchored: true,
          canCollide: true,
        });
      }
    }

    if (iteration >= 3) {
      // Shimmering Golden Wishing Coins at pool bottom
      instances.push({
        id: 'ft_coins',
        name: 'SunkenWishingCoins',
        className: 'Part',
        shape: 'Cylinder',
        size: [2.4, 0.05, 2.4],
        position: [0, 1.05, 0],
        rotation: [0, 0, 0],
        color: [240, 205, 50],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });

      // Ambient Underwater Illumination
      instances.push({
        id: 'ft_underwater_glow',
        name: 'UnderwaterLuminanceOrb',
        className: 'Part',
        shape: 'Ball',
        size: [1.2, 0.4, 1.2],
        position: [0, 0.9, 0],
        rotation: [0, 0, 0],
        color: [0, 210, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'MarbleFountain', instances, primaryPartId: 'ft_base' };
  }

  public static buildAnvil(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Heavy Log Stand Base
    const stand: RobloxPartIR = {
      id: 'av_stand',
      name: 'BlacksmithLogStand',
      className: 'Part',
      shape: 'Cylinder',
      size: [2.8, 1.6, 2.8],
      position: [0, 0.8, 0],
      rotation: [0, 0, 0],
      color: [90, 55, 30],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    };
    instances.push(stand);

    // Forged Steel Anvil Foot & Waist
    instances.push({
      id: 'av_waist',
      name: 'AnvilWaistPedestal',
      className: 'Part',
      shape: 'Block',
      size: [1.6, 1.2, 1.2],
      position: [0, 2.2, 0],
      rotation: [0, 0, 0],
      color: [45, 48, 55],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Flat Working Striking Face
    instances.push({
      id: 'av_face',
      name: 'HardenedStrikingFace',
      className: 'Part',
      shape: 'Block',
      size: [3.4, 0.8, 1.4],
      position: [-0.2, 3.2, 0],
      rotation: [0, 0, 0],
      color: [55, 60, 68],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Tapered Biconical Horn (Wedge)
    instances.push({
      id: 'av_horn',
      name: 'RoundHornTip',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [1.6, 0.8, 1.4],
      position: [2.1, 3.2, 0],
      rotation: [0, 90, 0],
      color: [55, 60, 68],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Blacksmith's Cross-Peen Hammer Resting on Top
      instances.push({
        id: 'av_hammer_head',
        name: 'SmithHammerHead',
        className: 'Part',
        shape: 'Block',
        size: [0.9, 0.45, 0.45],
        position: [-0.4, 3.8, 0.2],
        rotation: [0, 25, 0],
        color: [70, 75, 82],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'av_hammer_handle',
        name: 'SmithHammerHandle',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 2.2, 0.15],
        position: [-1.2, 3.75, 0.55],
        rotation: [0, 115, 90],
        color: [110, 70, 40],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Glowing Red-Hot Forged Billet / Ingot
      instances.push({
        id: 'av_hot_metal',
        name: 'RedHotSteelBillet',
        className: 'Part',
        shape: 'Block',
        size: [1.2, 0.25, 0.5],
        position: [0.4, 3.72, -0.1],
        rotation: [0, -10, 0],
        color: [255, 110, 25],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'BlacksmithAnvil', instances, primaryPartId: 'av_stand' };
  }

  public static buildCannon(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Wooden Carriage Bed
    const carriage: RobloxPartIR = {
      id: 'cn_carriage',
      name: 'CarriageTruckBed',
      className: 'Part',
      shape: 'Block',
      size: [2.6, 1.2, 4.4],
      position: [0, 1.2, 0],
      rotation: [0, 0, 0],
      color: [95, 60, 32],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    };
    instances.push(carriage);

    // Heavy Cast Iron Cannon Barrel
    instances.push({
      id: 'cn_barrel',
      name: 'IronCannonBarrel',
      className: 'Part',
      shape: 'Cylinder',
      size: [1.2, 5.8, 1.2],
      position: [0, 2.4, 0.6],
      rotation: [15, 0, 0],
      color: [40, 44, 50],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // 4 Heavy Wooden Truck Wheels
    for (const [x, z, suf] of [
      [-1.5, 1.4, 'fl'],
      [1.5, 1.4, 'fr'],
      [-1.5, -1.4, 'bl'],
      [1.5, -1.4, 'br'],
    ] as const) {
      instances.push({
        id: `cn_wheel_${suf}`,
        name: `TruckWheel_${suf}`,
        className: 'Part',
        shape: 'Cylinder',
        size: [0.55, 1.8, 1.8],
        position: [x, 0.9, z],
        rotation: [0, 0, 90],
        color: [80, 50, 28],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 2) {
      // Pyramid Stack of 3 Cannonballs beside carriage
      for (const [x, z, suf] of [
        [-2.4, 0, '1'],
        [-2.4, 0.9, '2'],
        [-2.4, -0.9, '3'],
      ] as const) {
        instances.push({
          id: `cn_ball_${suf}`,
          name: `IronCannonball_${suf}`,
          className: 'Part',
          shape: 'Ball',
          size: [0.85, 0.85, 0.85],
          position: [x, 0.45, z],
          rotation: [0, 0, 0],
          color: [35, 38, 42],
          material: 'Metal',
          anchored: true,
          canCollide: true,
        });
      }

      // Elevation Quoin Wedge under barrel
      instances.push({
        id: 'cn_wedge',
        name: 'ElevationQuoinWedge',
        className: 'WedgePart',
        shape: 'Wedge',
        size: [1.4, 0.6, 1.2],
        position: [0, 1.9, -1.1],
        rotation: [0, 180, 0],
        color: [110, 68, 38],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Golden Crown Crest on Barrel Muzzle
      instances.push({
        id: 'cn_crest',
        name: 'ImperialBarrelInsignia',
        className: 'Part',
        shape: 'Cylinder',
        size: [1.3, 0.4, 1.3],
        position: [0, 2.9, 2.5],
        rotation: [15, 0, 0],
        color: [225, 185, 50],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    return { name: 'IronSiegeCannon', instances, primaryPartId: 'cn_carriage' };
  }

  public static buildFence(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Left and Right Posts
    const postL: RobloxPartIR = {
      id: 'fn_post_l',
      name: 'FencePostLeft',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.6, 4.2, 0.6],
      position: [-3.2, 2.1, 0],
      rotation: [0, 0, 0],
      color: [110, 70, 40],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    };
    instances.push(postL);

    instances.push({
      id: 'fn_post_r',
      name: 'FencePostRight',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.6, 4.2, 0.6],
      position: [3.2, 2.1, 0],
      rotation: [0, 0, 0],
      color: [110, 70, 40],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    // Upper and Lower Horizontal Rails
    instances.push({
      id: 'fn_rail_top',
      name: 'UpperHorizontalRail',
      className: 'Part',
      shape: 'Block',
      size: [6.4, 0.25, 0.35],
      position: [0, 3.2, 0],
      rotation: [0, 0, 0],
      color: [115, 75, 42],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    instances.push({
      id: 'fn_rail_bot',
      name: 'LowerHorizontalRail',
      className: 'Part',
      shape: 'Block',
      size: [6.4, 0.25, 0.35],
      position: [0, 1.2, 0],
      rotation: [0, 0, 0],
      color: [115, 75, 42],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    // 5 Pointed Vertical Pickets
    for (let i = 0; i < 5; i++) {
      const x = -2.2 + i * 1.1;
      instances.push({
        id: `fn_picket_${i}`,
        name: `PicketSlat_${i}`,
        className: 'Part',
        shape: 'Block',
        size: [0.55, 3.2, 0.18],
        position: [x, 2.2, 0.15],
        rotation: [0, 0, 0],
        color: [125, 80, 45],
        material: 'WoodPlanks',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 2) {
      // Pyramid Post Caps
      instances.push({
        id: 'fn_cap_l',
        name: 'PostCapLeft',
        className: 'Part',
        shape: 'Block',
        size: [0.8, 0.35, 0.8],
        position: [-3.2, 4.35, 0],
        rotation: [0, 0, 0],
        color: [90, 55, 30],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });

      instances.push({
        id: 'fn_cap_r',
        name: 'PostCapRight',
        className: 'Part',
        shape: 'Block',
        size: [0.8, 0.35, 0.8],
        position: [3.2, 4.35, 0],
        rotation: [0, 0, 0],
        color: [90, 55, 30],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Overgrown Wild Ivy Vine
      instances.push({
        id: 'fn_ivy',
        name: 'OvergrownIvyFoliage',
        className: 'Part',
        shape: 'Block',
        size: [1.8, 2.6, 0.3],
        position: [-1.2, 2.4, 0.25],
        rotation: [0, 0, 15],
        color: [50, 140, 60],
        material: 'Grass',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'WoodenPicketFence', instances, primaryPartId: 'fn_post_l' };
  }

  public static buildTorch(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Wooden Handle Stick
    const handle: RobloxPartIR = {
      id: 'to_handle',
      name: 'TorchWoodenShaft',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.35, 3.4, 0.35],
      position: [0, 1.7, 0],
      rotation: [0, 0, 0],
      color: [95, 60, 32],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    };
    instances.push(handle);

    // Iron Sconce Cup / Head
    instances.push({
      id: 'to_cup',
      name: 'IronSconceCup',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.8, 0.6, 0.8],
      position: [0, 3.4, 0],
      rotation: [0, 0, 0],
      color: [45, 48, 55],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Pitch Cloth Wrap
    instances.push({
      id: 'to_wrap',
      name: 'PitchClothWrap',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.65, 0.8, 0.65],
      position: [0, 3.9, 0],
      rotation: [0, 0, 0],
      color: [35, 30, 25],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });

    // Glowing Neon Flame
    instances.push({
      id: 'to_flame_core',
      name: 'TorchFlameCore',
      className: 'Part',
      shape: 'Ball',
      size: [1.1, 1.6, 1.1],
      position: [0, 4.8, 0],
      rotation: [0, 0, 0],
      color: [255, 130, 20],
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    if (iteration >= 2) {
      // Hot Inner Flame Tongue
      instances.push({
        id: 'to_flame_inner',
        name: 'TorchFlameHotTongue',
        className: 'Part',
        shape: 'Ball',
        size: [0.65, 1.1, 0.65],
        position: [0, 4.7, 0],
        rotation: [0, 0, 0],
        color: [255, 230, 80],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Wall Mounting Bracket
      instances.push({
        id: 'to_wall_mount',
        name: 'IronWallBracket',
        className: 'Part',
        shape: 'Block',
        size: [0.8, 1.4, 0.8],
        position: [0, 2.2, -0.6],
        rotation: [0, 0, 0],
        color: [40, 44, 50],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    return { name: 'MedievalTorch', instances, primaryPartId: 'to_handle' };
  }

  public static buildCauldron(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Bulbous Iron Pot Body
    const pot: RobloxPartIR = {
      id: 'cd_pot',
      name: 'CastIronPotBody',
      className: 'Part',
      shape: 'Ball',
      size: [3.8, 3.2, 3.8],
      position: [0, 2.1, 0],
      rotation: [0, 0, 0],
      color: [35, 38, 45],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    };
    instances.push(pot);

    // Thick Upper Lip Rim
    instances.push({
      id: 'cd_rim',
      name: 'CauldronRim',
      className: 'Part',
      shape: 'Cylinder',
      size: [3.4, 0.45, 3.4],
      position: [0, 3.6, 0],
      rotation: [0, 0, 0],
      color: [45, 48, 55],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Glowing Bubbling Arcane Brew Surface
    instances.push({
      id: 'cd_liquid',
      name: 'ArcaneBrewSurface',
      className: 'Part',
      shape: 'Cylinder',
      size: [3.0, 0.15, 3.0],
      position: [0, 3.45, 0],
      rotation: [0, 0, 0],
      color: [40, 255, 100], // Radioactive witch green
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    // 3 Curved Iron Legs
    for (let i = 0; i < 3; i++) {
      const a = (i * 120 * Math.PI) / 180;
      instances.push({
        id: `cd_leg_${i}`,
        name: `CauldronLeg_${i}`,
        className: 'Part',
        shape: 'Cylinder',
        size: [0.35, 1.8, 0.35],
        position: [Math.cos(a) * 1.5, 0.8, Math.sin(a) * 1.5],
        rotation: [15 * Math.sin(a), 0, -15 * Math.cos(a)],
        color: [30, 32, 38],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 2) {
      // Side Loop Carrying Handles
      instances.push({
        id: 'cd_handle_l',
        name: 'DropHandleLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.9, 0.9],
        position: [-2.1, 2.9, 0],
        rotation: [0, 0, 90],
        color: [60, 65, 72],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'cd_handle_r',
        name: 'DropHandleRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 0.9, 0.9],
        position: [2.1, 2.9, 0],
        rotation: [0, 0, 90],
        color: [60, 65, 72],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Liquid Bubbles Rising
      instances.push({
        id: 'cd_bubble_1',
        name: 'BrewBubble_1',
        className: 'Part',
        shape: 'Ball',
        size: [0.45, 0.45, 0.45],
        position: [-0.6, 3.65, 0.4],
        rotation: [0, 0, 0],
        color: [80, 255, 120],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Wood Fire beneath Cauldron
      instances.push({
        id: 'cd_fire',
        name: 'UnderfireEmberGlow',
        className: 'Part',
        shape: 'Ball',
        size: [1.8, 0.8, 1.8],
        position: [0, 0.4, 0],
        rotation: [0, 0, 0],
        color: [255, 100, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'WitchBrewCauldron', instances, primaryPartId: 'cd_pot' };
  }

  public static buildPotion(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Translucent Glass Bottle
    const bottle: RobloxPartIR = {
      id: 'po_bottle',
      name: 'AlchemyGlassVial',
      className: 'Part',
      shape: 'Cylinder',
      size: [1.4, 2.2, 1.4],
      position: [0, 1.1, 0],
      rotation: [0, 0, 0],
      color: [180, 230, 255],
      material: 'Glass',
      transparency: 0.45,
      anchored: true,
      canCollide: true,
    };
    instances.push(bottle);

    // Glowing Liquid Inside
    instances.push({
      id: 'po_liquid',
      name: 'ManaPotionFluid',
      className: 'Part',
      shape: 'Cylinder',
      size: [1.2, 1.6, 1.2],
      position: [0, 0.9, 0],
      rotation: [0, 0, 0],
      color: [0, 160, 255],
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    // Cork Stopper
    instances.push({
      id: 'po_cork',
      name: 'WoodCorkStopper',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.7, 0.5, 0.7],
      position: [0, 2.35, 0],
      rotation: [0, 0, 0],
      color: [130, 90, 55],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Alchemy Label Band
      instances.push({
        id: 'po_label',
        name: 'ParchmentLabel',
        className: 'Part',
        shape: 'Cylinder',
        size: [1.45, 0.8, 1.45],
        position: [0, 1.1, 0],
        rotation: [0, 0, 0],
        color: [225, 215, 190],
        material: 'Fabric',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Magical Aura Halo
      instances.push({
        id: 'po_aura',
        name: 'MysticAuraHalo',
        className: 'Part',
        shape: 'Ball',
        size: [2.0, 2.6, 2.0],
        position: [0, 1.2, 0],
        rotation: [0, 0, 0],
        color: [0, 220, 255],
        material: 'ForceField',
        transparency: 0.6,
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'MagicPotionBottle', instances, primaryPartId: 'po_bottle' };
  }

  public static buildCrown(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Polished Gold Circlet Band
    const band: RobloxPartIR = {
      id: 'crn_band',
      name: 'GoldCircletBand',
      className: 'Part',
      shape: 'Cylinder',
      size: [3.2, 0.8, 3.2],
      position: [0, 0.4, 0],
      rotation: [0, 0, 0],
      color: [240, 200, 50],
      material: 'Metal',
      reflectance: 0.4,
      anchored: true,
      canCollide: true,
    };
    instances.push(band);

    // 6 Rising Spikes / Fleur-de-lis Prongs around perimeter
    const spikeCount = 6;
    const radius = 1.45;
    for (let i = 0; i < spikeCount; i++) {
      const a = (i * (360 / spikeCount) * Math.PI) / 180;
      instances.push({
        id: `crn_prong_${i}`,
        name: `CrownSpikeProng_${i}`,
        className: 'WedgePart',
        shape: 'Wedge',
        size: [0.45, 1.4, 0.35],
        position: [Math.cos(a) * radius, 1.4, Math.sin(a) * radius],
        rotation: [0, (i * (360 / spikeCount)) % 360, 0],
        color: [240, 200, 50],
        material: 'Metal',
        reflectance: 0.4,
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 2) {
      // Crimson Velvet Inner Cushion Cap
      instances.push({
        id: 'crn_velvet',
        name: 'CrimsonVelvetCap',
        className: 'Part',
        shape: 'Ball',
        size: [2.8, 1.6, 2.8],
        position: [0, 0.8, 0],
        rotation: [0, 0, 0],
        color: [160, 30, 45],
        material: 'Fabric',
        anchored: true,
        canCollide: true,
      });

      // Front Center Inset Sapphire
      instances.push({
        id: 'crn_gem_sapphire',
        name: 'FrontInsigniaSapphire',
        className: 'Part',
        shape: 'Ball',
        size: [0.45, 0.45, 0.45],
        position: [0, 0.4, 1.65],
        rotation: [0, 0, 0],
        color: [0, 180, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Pearl Finials atop each prong tip
      for (let i = 0; i < spikeCount; i++) {
        const a = (i * (360 / spikeCount) * Math.PI) / 180;
        instances.push({
          id: `crn_pearl_${i}`,
          name: `ProngPearlFinial_${i}`,
          className: 'Part',
          shape: 'Ball',
          size: [0.35, 0.35, 0.35],
          position: [Math.cos(a) * radius, 2.2, Math.sin(a) * radius],
          rotation: [0, 0, 0],
          color: [245, 245, 250],
          material: 'SmoothPlastic',
          reflectance: 0.6,
          anchored: true,
          canCollide: false,
        });
      }
    }

    return { name: 'RoyalGoldenCrown', instances, primaryPartId: 'crn_band' };
  }
}

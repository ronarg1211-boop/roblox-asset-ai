// ============================================================
// Roblox Asset AI - Comprehensive Domain Knowledge Catalog
// Contains architectural blueprints and part hierarchies for 40+ Roblox assets
// ============================================================

import { RobloxModelIR, RobloxPartIR, RobloxInstanceIR } from '../../types/roblox';
import { CatalogBuilders } from './catalog-builders';
import { ExtraBuilders } from './extra-builders';

export interface AssetGeneratorResult {
  name: string;
  instances: RobloxInstanceIR[];
  primaryPartId: string;
}

export class RobloxAssetCatalog {
  /**
   * Dispatches generation to specialized asset blueprints based on prompt semantics
   */
  public static matchAndGenerate(
    prompt: string,
    iteration: number
  ): AssetGeneratorResult | null {
    const p = prompt.toLowerCase();

    // 1. WEAPONS & COMBAT
    if (p.includes('sword') || p.includes('blade') || p.includes('claymore') || p.includes('saber')) {
      return this.buildSword(iteration, p.includes('katana') || p.includes('ninja'));
    }
    if (p.includes('shield')) {
      return this.buildShield(iteration);
    }
    if (p.includes('hammer') || p.includes('axe') || p.includes('battleaxe')) {
      return this.buildWarHammer(iteration);
    }
    if (p.includes('staff') || p.includes('wand') || p.includes('scepter')) {
      return this.buildMagicStaff(iteration);
    }
    if (p.includes('gun') || p.includes('blaster') || p.includes('rifle') || p.includes('laser')) {
      return this.buildSciFiBlaster(iteration);
    }

    // 2. VEHICLES & TRANSPORT
    if (p.includes('tank')) {
      return this.buildBattleTank(iteration);
    }
    if (p.includes('plane') || p.includes('jet') || p.includes('aircraft')) {
      return this.buildFighterJet(iteration);
    }
    if (p.includes('ship') || p.includes('boat') || p.includes('galleon') || p.includes('pirate ship')) {
      return this.buildPirateShip(iteration);
    }
    if (p.includes('spaceship') || p.includes('starfighter') || p.includes('ufo') || p.includes('shuttle')) {
      return this.buildSpaceship(iteration);
    }
    if (p.includes('helicopter') || p.includes('chopper')) {
      return this.buildHelicopter(iteration);
    }
    if (p.includes('motorcycle') || p.includes('bike')) {
      return this.buildMotorcycle(iteration);
    }
    if (p.includes('car') || p.includes('vehicle') || p.includes('buggy') || p.includes('truck')) {
      return this.buildVehicle(iteration, p.includes('truck'));
    }

    // 3. ARCHITECTURE & BUILDINGS
    if (p.includes('castle') || p.includes('fortress')) {
      return this.buildCastle(iteration);
    }
    if (p.includes('tower') || p.includes('watchtower') || p.includes('lighthouse')) {
      return this.buildTower(iteration);
    }
    if (p.includes('house') || p.includes('cottage') || p.includes('cabin') || p.includes('building')) {
      return this.buildHouse(iteration);
    }
    if (p.includes('portal') || p.includes('stargate') || p.includes('gateway')) {
      return this.buildPortal(iteration);
    }
    if (p.includes('bridge')) {
      return this.buildBridge(iteration);
    }
    if (p.includes('door') || p.includes('gate')) {
      return this.buildFortifiedDoor(iteration);
    }

    // 4. FURNITURE & INTERIOR
    if (p.includes('chair') || p.includes('throne')) {
      return this.buildChair(iteration);
    }
    if (p.includes('table') || p.includes('desk')) {
      return this.buildTable(iteration);
    }
    if (p.includes('bed')) {
      return this.buildBed(iteration);
    }
    if (p.includes('bookshelf') || p.includes('shelf') || p.includes('bookcase')) {
      return this.buildBookshelf(iteration);
    }
    if (p.includes('sofa') || p.includes('couch')) {
      return this.buildSofa(iteration);
    }
    if (p.includes('lamp') || p.includes('lantern') || p.includes('streetlight')) {
      return this.buildStreetLamp(iteration);
    }

    // 5. PROPS & NATURE
    if (p.includes('chest') || p.includes('treasure')) {
      return this.buildTreasureChest(iteration);
    }
    if (p.includes('crate') || p.includes('box')) {
      return this.buildCrate(iteration);
    }
    if (p.includes('barrel')) {
      return this.buildBarrel(iteration);
    }
    if (p.includes('campfire') || p.includes('fire')) {
      return this.buildCampfire(iteration);
    }
    if (p.includes('tree') || p.includes('plant') || p.includes('palm')) {
      return this.buildTree(iteration, p.includes('palm'));
    }
    if (p.includes('crystal') || p.includes('gem') || p.includes('core')) {
      return this.buildCrystalCore(iteration);
    }

    // 6. CHARACTERS & CREATURES
    if (p.includes('robot') || p.includes('mech') || p.includes('cyborg')) {
      return this.buildMech(iteration);
    }
    if (p.includes('character') || p.includes('human') || p.includes('npc') || p.includes('dummy')) {
      return this.buildHumanoid(iteration);
    }
    if (p.includes('golem') || p.includes('monster')) {
      return this.buildGolem(iteration);
    }

    // 7. EXPANDED DOMAIN PROPS
    if (p.includes('fountain')) {
      return ExtraBuilders.buildFountain(iteration);
    }
    if (p.includes('anvil')) {
      return ExtraBuilders.buildAnvil(iteration);
    }
    if (p.includes('cannon')) {
      return ExtraBuilders.buildCannon(iteration);
    }
    if (p.includes('fence')) {
      return ExtraBuilders.buildFence(iteration);
    }
    if (p.includes('torch')) {
      return ExtraBuilders.buildTorch(iteration);
    }
    if (p.includes('cauldron')) {
      return ExtraBuilders.buildCauldron(iteration);
    }
    if (p.includes('potion') || p.includes('bottle') || p.includes('flask')) {
      return ExtraBuilders.buildPotion(iteration);
    }
    if (p.includes('crown') || p.includes('circlet') || p.includes('tiara')) {
      return ExtraBuilders.buildCrown(iteration);
    }

    // 8. Dynamic Parametric Synthesis for any other prompt!
    return this.buildParametricAsset(prompt, iteration);
  }

  // ============================================================
  // WEAPONS
  // ============================================================

  private static buildSword(iteration: number, isKatana: boolean): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];
    const name = isKatana ? 'StylizedKatana' : 'KnightBroadsword';

    // Handle / Grip
    const grip: RobloxPartIR = {
      id: 'sw_grip',
      name: 'HandleGrip',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.35, 1.4, 0.35],
      position: [0, 0.7, 0],
      rotation: [0, 0, 0],
      color: isKatana ? [35, 35, 40] : [90, 55, 35],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    };
    instances.push(grip);

    // Pommel
    instances.push({
      id: 'sw_pommel',
      name: 'Pommel',
      className: 'Part',
      shape: 'Ball',
      size: [0.6, 0.6, 0.6],
      position: [0, -0.1, 0],
      rotation: [0, 0, 0],
      color: [220, 180, 50],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Crossguard
    const guardWidth = isKatana ? 0.9 : 1.8;
    instances.push({
      id: 'sw_guard',
      name: 'Crossguard',
      className: 'Part',
      shape: isKatana ? 'Cylinder' : 'Block',
      size: [guardWidth, 0.25, 0.6],
      position: [0, 1.5, 0],
      rotation: [0, 0, 0],
      color: [220, 180, 50],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Blade Lower & Main
    instances.push({
      id: 'sw_blade_main',
      name: 'BladeMain',
      className: 'Part',
      shape: 'Block',
      size: [0.55, 4.2, 0.12],
      position: [0, 3.7, 0],
      rotation: [0, 0, 0],
      color: [210, 215, 225],
      material: 'Metal',
      reflectance: 0.4,
      anchored: true,
      canCollide: true,
    });

    // Blade Tip (Wedge)
    instances.push({
      id: 'sw_blade_tip',
      name: 'BladeTip',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [0.55, 0.8, 0.12],
      position: [0, 6.2, 0],
      rotation: [0, 0, 0],
      color: [210, 215, 225],
      material: 'Metal',
      reflectance: 0.4,
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Fuller Groove
      instances.push({
        id: 'sw_fuller',
        name: 'FullerGroove',
        className: 'Part',
        shape: 'Block',
        size: [0.15, 3.2, 0.14],
        position: [0, 3.4, 0],
        rotation: [0, 0, 0],
        color: [70, 75, 85],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
      // Guard Quillons
      instances.push({
        id: 'sw_quillon_l',
        name: 'QuillonLeft',
        className: 'Part',
        shape: 'Ball',
        size: [0.35, 0.35, 0.35],
        position: [-guardWidth / 2, 1.5, 0],
        rotation: [0, 0, 0],
        color: [240, 200, 60],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
      instances.push({
        id: 'sw_quillon_r',
        name: 'QuillonRight',
        className: 'Part',
        shape: 'Ball',
        size: [0.35, 0.35, 0.35],
        position: [guardWidth / 2, 1.5, 0],
        rotation: [0, 0, 0],
        color: [240, 200, 60],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Inlaid Gemstone / Rune
      instances.push({
        id: 'sw_gem',
        name: 'GuardGemstone',
        className: 'Part',
        shape: 'Ball',
        size: [0.3, 0.3, 0.35],
        position: [0, 1.5, 0.25],
        rotation: [0, 0, 0],
        color: [0, 210, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name, instances, primaryPartId: 'sw_grip' };
  }

  private static buildShield(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Shield Body (Slightly curved face)
    const body: RobloxPartIR = {
      id: 'sh_body',
      name: 'ShieldPlate',
      className: 'Part',
      shape: 'Block',
      size: [3.4, 4.4, 0.35],
      position: [0, 2.6, 0],
      rotation: [0, 0, 0],
      color: [140, 45, 45], // Crimson field
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    };
    instances.push(body);

    // Iron Rim Outer
    instances.push({
      id: 'sh_rim_top',
      name: 'RimTop',
      className: 'Part',
      shape: 'Block',
      size: [3.6, 0.3, 0.45],
      position: [0, 4.8, 0],
      rotation: [0, 0, 0],
      color: [75, 80, 90],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Central Umbo / Boss
    instances.push({
      id: 'sh_boss',
      name: 'ShieldBoss',
      className: 'Part',
      shape: 'Ball',
      size: [1.2, 1.2, 0.7],
      position: [0, 2.6, 0.25],
      rotation: [0, 0, 0],
      color: [220, 180, 50],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Boss Center Spike
      instances.push({
        id: 'sh_spike',
        name: 'BossSpike',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.6, 0.3, 0.3],
        position: [0, 2.6, 0.7],
        rotation: [90, 0, 0],
        color: [240, 200, 60],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });

      // Side Steel Bands
      instances.push({
        id: 'sh_band_l',
        name: 'SteelBandLeft',
        className: 'Part',
        shape: 'Block',
        size: [0.25, 4.4, 0.42],
        position: [-1.75, 2.6, 0],
        rotation: [0, 0, 0],
        color: [75, 80, 90],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'sh_band_r',
        name: 'SteelBandRight',
        className: 'Part',
        shape: 'Block',
        size: [0.25, 4.4, 0.42],
        position: [1.75, 2.6, 0],
        rotation: [0, 0, 0],
        color: [75, 80, 90],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Rear Leather Arm Strap & Handle
      instances.push({
        id: 'sh_grip',
        name: 'ShieldGrip',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.2, 1.2, 0.2],
        position: [0, 2.6, -0.4],
        rotation: [0, 0, 90],
        color: [85, 50, 30],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'KnightKiteShield', instances, primaryPartId: 'sh_body' };
  }

  private static buildWarHammer(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Shaft
    instances.push({
      id: 'wh_shaft',
      name: 'WarhammerShaft',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.35, 4.6, 0.35],
      position: [0, 2.3, 0],
      rotation: [0, 0, 0],
      color: [95, 60, 35],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    // Hammer Head Block
    instances.push({
      id: 'wh_head',
      name: 'HammerHead',
      className: 'Part',
      shape: 'Block',
      size: [1.6, 1.1, 1.1],
      position: [0, 4.4, 0],
      rotation: [0, 0, 0],
      color: [75, 80, 90],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Striking Face
    instances.push({
      id: 'wh_face',
      name: 'StrikingFace',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.4, 1.2, 1.2],
      position: [0.9, 4.4, 0],
      rotation: [0, 0, 90],
      color: [90, 95, 105],
      material: 'DiamondPlate',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Rear Armor-Piercing Spike (Wedge)
      instances.push({
        id: 'wh_spike',
        name: 'RearSpike',
        className: 'WedgePart',
        shape: 'Wedge',
        size: [0.9, 1.0, 0.8],
        position: [-1.2, 4.4, 0],
        rotation: [0, 0, 90],
        color: [75, 80, 90],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Top Crown Spike
      instances.push({
        id: 'wh_top_spike',
        name: 'TopSpike',
        className: 'WedgePart',
        shape: 'Wedge',
        size: [0.5, 0.8, 0.5],
        position: [0, 5.2, 0],
        rotation: [0, 0, 0],
        color: [75, 80, 90],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Gold Filigree Reinforcements
      instances.push({
        id: 'wh_gold_collar',
        name: 'GoldShaftCollar',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.45, 0.4, 0.45],
        position: [0, 3.8, 0],
        rotation: [0, 0, 0],
        color: [239, 184, 56],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'ForgedWarhammer', instances, primaryPartId: 'wh_shaft' };
  }

  private static buildMagicStaff(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Long Staff
    instances.push({
      id: 'st_shaft',
      name: 'StaffShaft',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.35, 5.8, 0.35],
      position: [0, 2.9, 0],
      rotation: [0, 0, 0],
      color: [85, 50, 30],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    // Top Socket Crown
    instances.push({
      id: 'st_socket',
      name: 'CrystalSocket',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.9, 0.7, 0.9],
      position: [0, 5.8, 0],
      rotation: [0, 0, 0],
      color: [220, 180, 50],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Floating / Nested Glowing Crystal
    instances.push({
      id: 'st_crystal',
      name: 'ArcaneCrystal',
      className: 'Part',
      shape: 'Ball',
      size: [1.2, 1.6, 1.2],
      position: [0, 6.7, 0],
      rotation: [0, 0, 0],
      color: [0, 230, 255],
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    if (iteration >= 2) {
      // Orbital Ring 1
      instances.push({
        id: 'st_ring_1',
        name: 'OrbitalRing1',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.15, 2.0, 2.0],
        position: [0, 6.7, 0],
        rotation: [25, 45, 0],
        color: [240, 200, 60],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });

      // Bottom Spear Point
      instances.push({
        id: 'st_bottom_tip',
        name: 'BottomSpearPoint',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.4, 0.8, 0.4],
        position: [0, 0.2, 0],
        rotation: [0, 0, 0],
        color: [220, 180, 50],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Floating Magic Runes
      instances.push({
        id: 'st_rune_orbit',
        name: 'FloatingRuneGem',
        className: 'Part',
        shape: 'Ball',
        size: [0.35, 0.35, 0.35],
        position: [0.8, 7.3, 0.4],
        rotation: [0, 0, 0],
        color: [180, 70, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'ArcaneStaff', instances, primaryPartId: 'st_shaft' };
  }

  private static buildSciFiBlaster(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Receiver / Main Body
    instances.push({
      id: 'bl_receiver',
      name: 'ReceiverBody',
      className: 'Part',
      shape: 'Block',
      size: [0.6, 0.9, 2.2],
      position: [0, 1.8, 0],
      rotation: [0, 0, 0],
      color: [35, 38, 45],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Barrel
    instances.push({
      id: 'bl_barrel',
      name: 'LaserBarrel',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.4, 0.4, 1.8],
      position: [0, 1.9, 1.6],
      rotation: [90, 0, 0],
      color: [55, 60, 70],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Pistol Grip
    instances.push({
      id: 'bl_grip',
      name: 'PistolGrip',
      className: 'Part',
      shape: 'Block',
      size: [0.45, 1.1, 0.6],
      position: [0, 1.1, -0.6],
      rotation: [-18, 0, 0],
      color: [25, 25, 30],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Neon Energy Cell Magazine
      instances.push({
        id: 'bl_mag',
        name: 'EnergyCell',
        className: 'Part',
        shape: 'Block',
        size: [0.5, 0.8, 0.6],
        position: [0, 1.1, 0.3],
        rotation: [0, 0, 0],
        color: [0, 230, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });

      // Holographic Sight / Scope
      instances.push({
        id: 'bl_scope',
        name: 'HoloSight',
        className: 'Part',
        shape: 'Block',
        size: [0.35, 0.4, 0.7],
        position: [0, 2.4, -0.2],
        rotation: [0, 0, 0],
        color: [0, 255, 120],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Muzzle Heat Sink Fins
      instances.push({
        id: 'bl_heat_sink',
        name: 'MuzzleFlashSuppressor',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.55, 0.55, 0.4],
        position: [0, 1.9, 2.6],
        rotation: [90, 0, 0],
        color: [240, 100, 30],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'PlasmaBlaster', instances, primaryPartId: 'bl_receiver' };
  }

  // ============================================================
  // VEHICLES
  // ============================================================

  private static buildBattleTank(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Hull
    const hull: RobloxPartIR = {
      id: 'tk_hull',
      name: 'TankHull',
      className: 'Part',
      shape: 'Block',
      size: [5.2, 1.6, 7.4],
      position: [0, 1.4, 0],
      rotation: [0, 0, 0],
      color: [75, 85, 65], // Camo Olive
      material: 'Metal',
      anchored: true,
      canCollide: true,
    };
    instances.push(hull);

    // Left & Right Treads
    instances.push({
      id: 'tk_tread_l',
      name: 'TreadLeft',
      className: 'Part',
      shape: 'Block',
      size: [1.2, 1.4, 8.0],
      position: [-2.9, 1.1, 0],
      rotation: [0, 0, 0],
      color: [35, 35, 40],
      material: 'DiamondPlate',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'tk_tread_r',
      name: 'TreadRight',
      className: 'Part',
      shape: 'Block',
      size: [1.2, 1.4, 8.0],
      position: [2.9, 1.1, 0],
      rotation: [0, 0, 0],
      color: [35, 35, 40],
      material: 'DiamondPlate',
      anchored: true,
      canCollide: true,
    });

    // Turret
    instances.push({
      id: 'tk_turret',
      name: 'RotatingTurret',
      className: 'Part',
      shape: 'Block',
      size: [3.4, 1.2, 3.8],
      position: [0, 2.7, -0.4],
      rotation: [0, 0, 0],
      color: [75, 85, 65],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Cannon Barrel
    instances.push({
      id: 'tk_barrel',
      name: 'MainCannonBarrel',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.55, 0.55, 5.4],
      position: [0, 2.8, 3.8],
      rotation: [90, 0, 0],
      color: [55, 60, 50],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Commander Hatch
      instances.push({
        id: 'tk_hatch',
        name: 'CommanderHatch',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.9, 0.3, 0.9],
        position: [0.9, 3.4, -0.6],
        rotation: [0, 0, 0],
        color: [60, 65, 55],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });

      // Front Glacis Armor Slope (Wedge)
      instances.push({
        id: 'tk_glacis',
        name: 'FrontGlacisWedge',
        className: 'WedgePart',
        shape: 'Wedge',
        size: [5.2, 1.2, 1.6],
        position: [0, 1.6, 4.2],
        rotation: [0, 180, 0],
        color: [75, 85, 65],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Muzzle Brake
      instances.push({
        id: 'tk_muzzle_brake',
        name: 'MuzzleBrake',
        className: 'Part',
        shape: 'Block',
        size: [0.9, 0.7, 0.6],
        position: [0, 2.8, 6.4],
        rotation: [0, 0, 0],
        color: [40, 45, 38],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
      // Rear Fuel Drum
      instances.push({
        id: 'tk_fuel_drum',
        name: 'ExternalFuelDrum',
        className: 'Part',
        shape: 'Cylinder',
        size: [1.2, 2.8, 1.2],
        position: [0, 1.8, -4.1],
        rotation: [0, 0, 90],
        color: [140, 40, 35],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    return { name: 'MainBattleTank', instances, primaryPartId: 'tk_hull' };
  }

  private static buildFighterJet(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Fuselage
    const fuselage: RobloxPartIR = {
      id: 'fj_fuse',
      name: 'MainFuselage',
      className: 'Part',
      shape: 'Block',
      size: [1.8, 1.4, 9.6],
      position: [0, 2.0, 0],
      rotation: [0, 0, 0],
      color: [190, 195, 205],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    };
    instances.push(fuselage);

    // Nose Cone
    instances.push({
      id: 'fj_nose',
      name: 'NoseCone',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [1.8, 1.2, 2.8],
      position: [0, 1.9, 5.8],
      rotation: [0, 180, 0],
      color: [45, 50, 60],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    // Delta Wings (Left & Right)
    instances.push({
      id: 'fj_wing_l',
      name: 'WingLeft',
      className: 'Part',
      shape: 'Block',
      size: [4.6, 0.15, 3.8],
      position: [-3.0, 1.9, -0.6],
      rotation: [0, 15, 0],
      color: [190, 195, 205],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'fj_wing_r',
      name: 'WingRight',
      className: 'Part',
      shape: 'Block',
      size: [4.6, 0.15, 3.8],
      position: [3.0, 1.9, -0.6],
      rotation: [0, -15, 0],
      color: [190, 195, 205],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Glass Cockpit Canopy
    instances.push({
      id: 'fj_cockpit',
      name: 'CockpitCanopy',
      className: 'Part',
      shape: 'Ball',
      size: [1.3, 1.2, 3.4],
      position: [0, 2.8, 2.2],
      rotation: [0, 0, 0],
      color: [80, 180, 240],
      material: 'Glass',
      transparency: 0.45,
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Twin Vertical Stabilizer Fins
      instances.push({
        id: 'fj_fin_l',
        name: 'VerticalFinLeft',
        className: 'Part',
        shape: 'Block',
        size: [0.15, 2.2, 1.8],
        position: [-1.1, 3.5, -3.8],
        rotation: [0, 0, -15],
        color: [190, 195, 205],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'fj_fin_r',
        name: 'VerticalFinRight',
        className: 'Part',
        shape: 'Block',
        size: [0.15, 2.2, 1.8],
        position: [1.1, 3.5, -3.8],
        rotation: [0, 0, 15],
        color: [190, 195, 205],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Jet Afterburner Thrusters (Glowing Neon)
      instances.push({
        id: 'fj_thrust_l',
        name: 'AfterburnerLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.8, 0.8, 0.4],
        position: [-0.65, 2.0, -5.0],
        rotation: [90, 0, 0],
        color: [255, 120, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
      instances.push({
        id: 'fj_thrust_r',
        name: 'AfterburnerRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.8, 0.8, 0.4],
        position: [0.65, 2.0, -5.0],
        rotation: [90, 0, 0],
        color: [255, 120, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'SupersonicJet', instances, primaryPartId: 'fj_fuse' };
  }

  private static buildSpaceship(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Core Command Hull
    instances.push({
      id: 'sp_core',
      name: 'CommandHull',
      className: 'Part',
      shape: 'Block',
      size: [3.4, 2.2, 7.8],
      position: [0, 2.4, 0],
      rotation: [0, 0, 0],
      color: [40, 45, 55],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Angled Wing Nacelles
    instances.push({
      id: 'sp_wing_l',
      name: 'NacelleLeft',
      className: 'Part',
      shape: 'Block',
      size: [3.2, 0.8, 4.4],
      position: [-3.6, 2.0, -1.0],
      rotation: [0, 0, -15],
      color: [0, 162, 255],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'sp_wing_r',
      name: 'NacelleRight',
      className: 'Part',
      shape: 'Block',
      size: [3.2, 0.8, 4.4],
      position: [3.6, 2.0, -1.0],
      rotation: [0, 0, 15],
      color: [0, 162, 255],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    // Cockpit Glass
    instances.push({
      id: 'sp_cockpit',
      name: 'HexCockpitGlass',
      className: 'WedgePart',
      shape: 'Wedge',
      size: [2.6, 1.4, 2.4],
      position: [0, 3.4, 2.0],
      rotation: [0, 180, 0],
      color: [0, 240, 255],
      material: 'Neon',
      transparency: 0.2,
      anchored: true,
      canCollide: false,
    });

    if (iteration >= 2) {
      // Twin Plasma Ion Engines
      instances.push({
        id: 'sp_eng_l',
        name: 'IonEngineLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [1.2, 1.2, 1.0],
        position: [-1.3, 2.4, -4.2],
        rotation: [90, 0, 0],
        color: [0, 210, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
      instances.push({
        id: 'sp_eng_r',
        name: 'IonEngineRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [1.2, 1.2, 1.0],
        position: [1.3, 2.4, -4.2],
        rotation: [90, 0, 0],
        color: [0, 210, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Dual Wingtip Pulse Cannons
      instances.push({
        id: 'sp_cannon_l',
        name: 'PulseLaserLeft',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.35, 0.35, 2.4],
        position: [-5.4, 1.7, 0.6],
        rotation: [90, 0, 0],
        color: [255, 60, 50],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
      instances.push({
        id: 'sp_cannon_r',
        name: 'PulseLaserRight',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.35, 0.35, 2.4],
        position: [5.4, 1.7, 0.6],
        rotation: [90, 0, 0],
        color: [255, 60, 50],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'StarfighterCruiser', instances, primaryPartId: 'sp_core' };
  }

  // ============================================================
  // ARCHITECTURE & STRUCTURES
  // ============================================================

  private static buildCastle(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Main Keep / Gatehouse Wall
    const mainKeep: RobloxPartIR = {
      id: 'cs_keep',
      name: 'MainCastleKeep',
      className: 'Part',
      shape: 'Block',
      size: [8.0, 6.0, 4.0],
      position: [0, 3.0, 0],
      rotation: [0, 0, 0],
      color: [120, 125, 130],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    };
    instances.push(mainKeep);

    // Left & Right Corner Turrets
    instances.push({
      id: 'cs_turret_l',
      name: 'TurretLeft',
      className: 'Part',
      shape: 'Cylinder',
      size: [2.6, 7.8, 2.6],
      position: [-4.6, 3.9, 0],
      rotation: [0, 0, 0],
      color: [100, 105, 110],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'cs_turret_r',
      name: 'TurretRight',
      className: 'Part',
      shape: 'Cylinder',
      size: [2.6, 7.8, 2.6],
      position: [4.6, 3.9, 0],
      rotation: [0, 0, 0],
      color: [100, 105, 110],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Central Archway Gate
    instances.push({
      id: 'cs_gate',
      name: 'PortcullisGate',
      className: 'Part',
      shape: 'Block',
      size: [2.8, 3.6, 0.4],
      position: [0, 1.8, 1.9],
      rotation: [0, 0, 0],
      color: [80, 50, 30],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Crenellations / Battlements along keep top
      for (const x of [-3.0, -1.0, 1.0, 3.0]) {
        instances.push({
          id: `cs_cren_${x}`,
          name: 'BattlementCrenel',
          className: 'Part',
          shape: 'Block',
          size: [1.0, 1.0, 0.8],
          position: [x, 6.5, 1.8],
          rotation: [0, 0, 0],
          color: [120, 125, 130],
          material: 'Cobblestone',
          anchored: true,
          canCollide: true,
        });
      }
      // Conical Turret Roofs
      instances.push({
        id: 'cs_roof_l',
        name: 'TurretRoofLeft',
        className: 'Part',
        shape: 'Ball',
        size: [3.0, 2.4, 3.0],
        position: [-4.6, 8.8, 0],
        rotation: [0, 0, 0],
        color: [140, 45, 45],
        material: 'Brick',
        anchored: true,
        canCollide: true,
      });
      instances.push({
        id: 'cs_roof_r',
        name: 'TurretRoofRight',
        className: 'Part',
        shape: 'Ball',
        size: [3.0, 2.4, 3.0],
        position: [4.6, 8.8, 0],
        rotation: [0, 0, 0],
        color: [140, 45, 45],
        material: 'Brick',
        anchored: true,
        canCollide: true,
      });
    }

    if (iteration >= 3) {
      // Sconce Torches with Neon Flames
      instances.push({
        id: 'cs_torch_l',
        name: 'TorchLeftFlame',
        className: 'Part',
        shape: 'Ball',
        size: [0.4, 0.6, 0.4],
        position: [-2.0, 3.2, 2.2],
        rotation: [0, 0, 0],
        color: [255, 150, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
      instances.push({
        id: 'cs_torch_r',
        name: 'TorchRightFlame',
        className: 'Part',
        shape: 'Ball',
        size: [0.4, 0.6, 0.4],
        position: [2.0, 3.2, 2.2],
        rotation: [0, 0, 0],
        color: [255, 150, 20],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'MedievalCastleKeep', instances, primaryPartId: 'cs_keep' };
  }

  private static buildPortal(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Stone Pedestal
    instances.push({
      id: 'pt_pedestal',
      name: 'PortalPedestal',
      className: 'Part',
      shape: 'Block',
      size: [6.4, 0.8, 4.2],
      position: [0, 0.4, 0],
      rotation: [0, 0, 0],
      color: [80, 85, 95],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Left Arch Pillar
    instances.push({
      id: 'pt_pillar_l',
      name: 'ArchPillarLeft',
      className: 'Part',
      shape: 'Block',
      size: [1.2, 6.2, 1.2],
      position: [-2.4, 3.9, 0],
      rotation: [0, 0, 0],
      color: [60, 65, 75],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });
    // Right Arch Pillar
    instances.push({
      id: 'pt_pillar_r',
      name: 'ArchPillarRight',
      className: 'Part',
      shape: 'Block',
      size: [1.2, 6.2, 1.2],
      position: [2.4, 3.9, 0],
      rotation: [0, 0, 0],
      color: [60, 65, 75],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Top Lintel Header
    instances.push({
      id: 'pt_lintel',
      name: 'ArchLintel',
      className: 'Part',
      shape: 'Block',
      size: [6.0, 1.2, 1.4],
      position: [0, 7.3, 0],
      rotation: [0, 0, 0],
      color: [60, 65, 75],
      material: 'Cobblestone',
      anchored: true,
      canCollide: true,
    });

    // Swirling Glowing Neon Portal Event Horizon
    instances.push({
      id: 'pt_core',
      name: 'EventHorizonCore',
      className: 'Part',
      shape: 'Cylinder',
      size: [0.2, 4.4, 4.4],
      position: [0, 4.2, 0],
      rotation: [0, 0, 90],
      color: [140, 40, 255], // Arcane Purple
      material: 'Neon',
      transparency: 0.15,
      anchored: true,
      canCollide: false,
    });

    if (iteration >= 2) {
      // Keystone Emblem
      instances.push({
        id: 'pt_keystone',
        name: 'ArchKeystone',
        className: 'Part',
        shape: 'Ball',
        size: [1.4, 1.4, 1.6],
        position: [0, 7.3, 0.4],
        rotation: [0, 0, 0],
        color: [0, 220, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'DimensionalPortal', instances, primaryPartId: 'pt_pedestal' };
  }

  // ============================================================
  // HUMAN RIGS & ROBOTS
  // ============================================================

  private static buildHumanoid(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Roblox R6 Rig Standard Proportions
    // Torso (2 x 2 x 1 studs)
    const torso: RobloxPartIR = {
      id: 'hr_torso',
      name: 'Torso',
      className: 'Part',
      shape: 'Block',
      size: [2.0, 2.0, 1.0],
      position: [0, 3.0, 0],
      rotation: [0, 0, 0],
      color: [0, 162, 255], // Classic Blue Shirt
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    };
    instances.push(torso);

    // Head (1.2 x 1.2 x 1.2)
    instances.push({
      id: 'hr_head',
      name: 'Head',
      className: 'Part',
      shape: 'Block',
      size: [1.2, 1.2, 1.2],
      position: [0, 4.6, 0],
      rotation: [0, 0, 0],
      color: [245, 205, 47], // Classic Yellow Skin
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    // Left Arm (1 x 2 x 1)
    instances.push({
      id: 'hr_arm_l',
      name: 'LeftArm',
      className: 'Part',
      shape: 'Block',
      size: [1.0, 2.0, 1.0],
      position: [-1.5, 3.0, 0],
      rotation: [0, 0, 0],
      color: [245, 205, 47],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    // Right Arm (1 x 2 x 1)
    instances.push({
      id: 'hr_arm_r',
      name: 'RightArm',
      className: 'Part',
      shape: 'Block',
      size: [1.0, 2.0, 1.0],
      position: [1.5, 3.0, 0],
      rotation: [0, 0, 0],
      color: [245, 205, 47],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    // Left Leg (1 x 2 x 1)
    instances.push({
      id: 'hr_leg_l',
      name: 'LeftLeg',
      className: 'Part',
      shape: 'Block',
      size: [1.0, 2.0, 1.0],
      position: [-0.5, 1.0, 0],
      rotation: [0, 0, 0],
      color: [40, 127, 71], // Classic Green Pants
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    // Right Leg (1 x 2 x 1)
    instances.push({
      id: 'hr_leg_r',
      name: 'RightLeg',
      className: 'Part',
      shape: 'Block',
      size: [1.0, 2.0, 1.0],
      position: [0.5, 1.0, 0],
      rotation: [0, 0, 0],
      color: [40, 127, 71],
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Hair / Hat Brim
      instances.push({
        id: 'hr_hat',
        name: 'CharacterHat',
        className: 'Part',
        shape: 'Block',
        size: [1.6, 0.4, 1.6],
        position: [0, 5.3, 0],
        rotation: [0, 0, 0],
        color: [60, 40, 30],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });
    }

    if (iteration >= 3) {
      // Belt and Buckle
      instances.push({
        id: 'hr_buckle',
        name: 'BeltBuckle',
        className: 'Part',
        shape: 'Block',
        size: [0.5, 0.35, 0.2],
        position: [0, 2.05, 0.55],
        rotation: [0, 0, 0],
        color: [240, 200, 50],
        material: 'Metal',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'RobloxHumanoidRig', instances, primaryPartId: 'hr_torso' };
  }

  private static buildMech(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Mech Torso Core
    instances.push({
      id: 'mc_torso',
      name: 'MechCockpitTorso',
      className: 'Part',
      shape: 'Block',
      size: [3.6, 2.8, 3.2],
      position: [0, 4.2, 0],
      rotation: [0, 0, 0],
      color: [50, 55, 65],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Glowing Visor / Optic Eye
    instances.push({
      id: 'mc_visor',
      name: 'OpticVisor',
      className: 'Part',
      shape: 'Block',
      size: [2.2, 0.5, 0.3],
      position: [0, 4.6, 1.65],
      rotation: [0, 0, 0],
      color: [255, 30, 40],
      material: 'Neon',
      anchored: true,
      canCollide: false,
    });

    // Heavy Shoulders
    instances.push({
      id: 'mc_sh_l',
      name: 'ShoulderLeft',
      className: 'Part',
      shape: 'Ball',
      size: [1.6, 1.6, 1.6],
      position: [-2.6, 4.8, 0],
      rotation: [0, 0, 0],
      color: [215, 140, 30],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'mc_sh_r',
      name: 'ShoulderRight',
      className: 'Part',
      shape: 'Ball',
      size: [1.6, 1.6, 1.6],
      position: [2.6, 4.8, 0],
      rotation: [0, 0, 0],
      color: [215, 140, 30],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    // Heavy Legs
    instances.push({
      id: 'mc_leg_l',
      name: 'PistonLegLeft',
      className: 'Part',
      shape: 'Block',
      size: [1.2, 3.0, 1.4],
      position: [-1.4, 1.5, 0],
      rotation: [0, 0, 0],
      color: [40, 45, 52],
      material: 'DiamondPlate',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'mc_leg_r',
      name: 'PistonLegRight',
      className: 'Part',
      shape: 'Block',
      size: [1.2, 3.0, 1.4],
      position: [1.4, 1.5, 0],
      rotation: [0, 0, 0],
      color: [40, 45, 52],
      material: 'DiamondPlate',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Right Arm Mounted Rotary Cannon
      instances.push({
        id: 'mc_cannon',
        name: 'ArmRotaryCannon',
        className: 'Part',
        shape: 'Cylinder',
        size: [0.8, 0.8, 3.2],
        position: [3.4, 3.4, 1.2],
        rotation: [90, 0, 0],
        color: [30, 30, 35],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
    }

    return { name: 'HeavyBattleMech', instances, primaryPartId: 'mc_torso' };
  }

  // ============================================================
  // DOMESTIC / FURNITURE
  // ============================================================

  private static buildBed(iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];

    // Mattress
    instances.push({
      id: 'bd_mattress',
      name: 'Mattress',
      className: 'Part',
      shape: 'Block',
      size: [4.4, 0.9, 6.8],
      position: [0, 1.3, 0],
      rotation: [0, 0, 0],
      color: [240, 240, 245],
      material: 'Fabric',
      anchored: true,
      canCollide: true,
    });

    // Bedframe Base
    instances.push({
      id: 'bd_frame',
      name: 'WoodBedframe',
      className: 'Part',
      shape: 'Block',
      size: [4.8, 0.7, 7.2],
      position: [0, 0.45, 0],
      rotation: [0, 0, 0],
      color: [95, 60, 35],
      material: 'Wood',
      anchored: true,
      canCollide: true,
    });

    // Headboard
    instances.push({
      id: 'bd_headboard',
      name: 'Headboard',
      className: 'Part',
      shape: 'Block',
      size: [4.8, 3.0, 0.5],
      position: [0, 2.2, -3.4],
      rotation: [0, 0, 0],
      color: [95, 60, 35],
      material: 'WoodPlanks',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Pillows
      instances.push({
        id: 'bd_pillow_l',
        name: 'PillowLeft',
        className: 'Part',
        shape: 'Block',
        size: [1.6, 0.35, 1.2],
        position: [-1.1, 1.9, -2.4],
        rotation: [10, 0, 0],
        color: [255, 255, 255],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });
      instances.push({
        id: 'bd_pillow_r',
        name: 'PillowRight',
        className: 'Part',
        shape: 'Block',
        size: [1.6, 0.35, 1.2],
        position: [1.1, 1.9, -2.4],
        rotation: [10, 0, 0],
        color: [255, 255, 255],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });
      // Blanket Fold
      instances.push({
        id: 'bd_blanket',
        name: 'BlanketCover',
        className: 'Part',
        shape: 'Block',
        size: [4.45, 0.2, 4.4],
        position: [0, 1.85, 1.1],
        rotation: [0, 0, 0],
        color: [35, 80, 140],
        material: 'Fabric',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: 'MasterBed', instances, primaryPartId: 'bd_frame' };
  }

  // ============================================================
  // DYNAMIC PARAMETRIC ASSET GENERATOR (FOR ANY ARBITRARY PROMPT)
  // ============================================================

  private static buildParametricAsset(prompt: string, iteration: number): AssetGeneratorResult {
    const instances: RobloxInstanceIR[] = [];
    const words = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
    const cleanName = words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') || 'CustomRobloxAsset';

    // Semantic Material & Color Inference
    const p = prompt.toLowerCase();
    let mat: any = 'SmoothPlastic';
    let baseColor: [number, number, number] = [0, 162, 255]; // Roblox Blue default

    if (p.includes('wood') || p.includes('rustic') || p.includes('log') || p.includes('timber')) {
      mat = 'WoodPlanks';
      baseColor = [110, 68, 42];
    } else if (p.includes('metal') || p.includes('iron') || p.includes('steel') || p.includes('armor')) {
      mat = 'Metal';
      baseColor = [85, 90, 100];
    } else if (p.includes('stone') || p.includes('rock') || p.includes('cobble')) {
      mat = 'Cobblestone';
      baseColor = [120, 125, 130];
    } else if (p.includes('gold') || p.includes('brass')) {
      mat = 'Metal';
      baseColor = [239, 184, 56];
    } else if (p.includes('neon') || p.includes('cyber') || p.includes('glow')) {
      mat = 'Neon';
      baseColor = [0, 230, 255];
    }

    // 1. Foundation / Base Core
    const core: RobloxPartIR = {
      id: 'pa_core',
      name: `${cleanName}_Foundation`,
      className: 'Part',
      shape: 'Block',
      size: [3.8, 1.8, 3.8],
      position: [0, 0.9, 0],
      rotation: [0, 0, 0],
      color: baseColor,
      material: mat,
      anchored: true,
      canCollide: true,
    };
    instances.push(core);

    // 2. Mid Section Structure
    instances.push({
      id: 'pa_mid',
      name: `${cleanName}_MainSuperstructure`,
      className: 'Part',
      shape: 'Block',
      size: [3.2, 2.6, 3.2],
      position: [0, 3.1, 0],
      rotation: [0, 0, 0],
      color: [Math.min(255, baseColor[0] + 25), Math.min(255, baseColor[1] + 25), Math.min(255, baseColor[2] + 25)],
      material: mat,
      anchored: true,
      canCollide: true,
    });

    // 3. Side Sponson Wings / Supports
    instances.push({
      id: 'pa_sponson_l',
      name: `${cleanName}_PylonLeft`,
      className: 'Part',
      shape: 'Cylinder',
      size: [0.8, 3.4, 0.8],
      position: [-2.1, 2.2, 0],
      rotation: [0, 0, 0],
      color: [70, 75, 85],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });
    instances.push({
      id: 'pa_sponson_r',
      name: `${cleanName}_PylonRight`,
      className: 'Part',
      shape: 'Cylinder',
      size: [0.8, 3.4, 0.8],
      position: [2.1, 2.2, 0],
      rotation: [0, 0, 0],
      color: [70, 75, 85],
      material: 'Metal',
      anchored: true,
      canCollide: true,
    });

    if (iteration >= 2) {
      // Crown Finial / Top Spire
      instances.push({
        id: 'pa_spire',
        name: `${cleanName}_SpireCrown`,
        className: 'WedgePart',
        shape: 'Wedge',
        size: [2.2, 1.6, 2.2],
        position: [0, 5.2, 0],
        rotation: [0, 0, 0],
        color: [240, 200, 50],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      });
      // 4 Corner Reinforcements
      for (const [x, z] of [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]]) {
        instances.push({
          id: `pa_bracket_${x}_${z}`,
          name: `ReinforcementBracket`,
          className: 'Part',
          shape: 'Block',
          size: [0.4, 1.2, 0.4],
          position: [x, 1.2, z],
          rotation: [0, 0, 0],
          color: [50, 55, 65],
          material: 'Metal',
          anchored: true,
          canCollide: true,
        });
      }
    }

    if (iteration >= 3) {
      // Glowing Core Reactor / Power Indicator
      instances.push({
        id: 'pa_glow_orb',
        name: `${cleanName}_PowerCore`,
        className: 'Part',
        shape: 'Ball',
        size: [1.4, 1.4, 1.4],
        position: [0, 3.1, 1.7],
        rotation: [0, 0, 0],
        color: [0, 240, 255],
        material: 'Neon',
        anchored: true,
        canCollide: false,
      });
    }

    return { name: cleanName, instances, primaryPartId: 'pa_core' };
  }

  // Delegations to comprehensive CatalogBuilders
  private static buildTreasureChest(iteration: number) {
    return CatalogBuilders.buildTreasureChest(iteration);
  }
  private static buildChair(iteration: number) {
    return CatalogBuilders.buildChair(iteration);
  }
  private static buildTable(iteration: number) {
    return CatalogBuilders.buildTable(iteration);
  }
  private static buildVehicle(iteration: number, isTruck: boolean) {
    return CatalogBuilders.buildVehicle(iteration, isTruck);
  }
  private static buildTree(iteration: number, isPalm: boolean) {
    return CatalogBuilders.buildTree(iteration, isPalm);
  }
  private static buildTower(iteration: number) {
    return CatalogBuilders.buildTower(iteration);
  }
  private static buildHouse(iteration: number) {
    return CatalogBuilders.buildHouse(iteration);
  }
  private static buildBridge(iteration: number) {
    return CatalogBuilders.buildBridge(iteration);
  }
  private static buildFortifiedDoor(iteration: number) {
    return CatalogBuilders.buildFortifiedDoor(iteration);
  }
  private static buildCrate(iteration: number) {
    return CatalogBuilders.buildCrate(iteration);
  }
  private static buildBarrel(iteration: number) {
    return CatalogBuilders.buildBarrel(iteration);
  }
  private static buildCampfire(iteration: number) {
    return CatalogBuilders.buildCampfire(iteration);
  }
  private static buildCrystalCore(iteration: number) {
    return CatalogBuilders.buildCrystalCore(iteration);
  }
  private static buildBookshelf(iteration: number) {
    return CatalogBuilders.buildBookshelf(iteration);
  }
  private static buildSofa(iteration: number) {
    return CatalogBuilders.buildSofa(iteration);
  }
  private static buildStreetLamp(iteration: number) {
    return CatalogBuilders.buildStreetLamp(iteration);
  }
  private static buildPirateShip(iteration: number) {
    return CatalogBuilders.buildPirateShip(iteration);
  }
  private static buildHelicopter(iteration: number) {
    return CatalogBuilders.buildHelicopter(iteration);
  }
  private static buildMotorcycle(iteration: number) {
    return CatalogBuilders.buildMotorcycle(iteration);
  }
  private static buildGolem(iteration: number) {
    return CatalogBuilders.buildGolem(iteration);
  }
}

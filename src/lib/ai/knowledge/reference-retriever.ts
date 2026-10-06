// ============================================================
// Roblox Asset AI - Intelligent 3D Reference Knowledge Engine
// Provides high-fidelity, in-context 3D reference blueprints
// so the neural AI model "sees" authentic Roblox studio standards
// for proportions, part decomposition, materials, and rigging.
// ============================================================

import { RobloxModelIR, RobloxPartIR, RobloxInstanceIR } from '../../types/roblox';

export interface ReferenceBlueprint {
  id: string;
  name: string;
  category: 'characters' | 'weapons' | 'vehicles' | 'furniture' | 'architecture' | 'props' | 'nature';
  keywords: string[];
  description: string;
  model: RobloxModelIR;
}

export class ReferenceRetriever {
  private static blueprints: ReferenceBlueprint[] = [
    // ------------------------------------------------------------
    // 1. ZOMBIE BUSINESSMAN (Character with Layered Suit & Held Briefcase)
    // ------------------------------------------------------------
    {
      id: 'ref_zombie_businessman',
      name: 'BusinessZombieWithBriefcase',
      category: 'characters',
      keywords: ['zombie', 'businessman', 'suit', 'briefcase', 'undead', 'infected', 'ghoul', 'office', 'corrupt'],
      description: 'Hunched decaying zombie in a shredded charcoal business suit, torn red tie, sunken neon eyes, holding a weathered leather briefcase.',
      model: {
        assetType: 'model',
        name: 'BusinessZombie',
        primaryPartId: 'zb_torso',
        instances: [
          // Core R6 Torso
          { id: 'zb_torso', name: 'Torso', className: 'Part', shape: 'Block', size: [2.0, 2.0, 1.0], position: [0, 3.0, 0], rotation: [8, 4, -3], color: [45, 48, 55], material: 'Fabric', anchored: true, canCollide: true },
          // Layered Clothing: Undershirt & Lapels
          { id: 'zb_shirt', name: 'Undershirt', className: 'Part', shape: 'Block', size: [0.8, 1.5, 0.15], position: [0, 3.2, 0.52], rotation: [8, 4, -3], color: [220, 225, 220], material: 'Fabric', anchored: true, canCollide: false },
          { id: 'zb_tie', name: 'TornNecktie', className: 'Part', shape: 'Block', size: [0.25, 1.2, 0.12], position: [0.05, 3.1, 0.6], rotation: [8, 4, -8], color: [175, 40, 40], material: 'Fabric', anchored: true, canCollide: false },
          { id: 'zb_lapel_l', name: 'SuitLapelLeft', className: 'Part', shape: 'Block', size: [0.4, 1.6, 0.12], position: [-0.55, 3.2, 0.55], rotation: [8, 4, -15], color: [38, 40, 48], material: 'Fabric', anchored: true, canCollide: false },
          { id: 'zb_lapel_r', name: 'SuitLapelRight', className: 'Part', shape: 'Block', size: [0.4, 1.6, 0.12], position: [0.55, 3.2, 0.55], rotation: [8, 4, 15], color: [38, 40, 48], material: 'Fabric', anchored: true, canCollide: false },
          { id: 'zb_belt', name: 'LeatherBelt', className: 'Part', shape: 'Block', size: [2.05, 0.25, 1.05], position: [0, 2.1, 0], rotation: [8, 4, -3], color: [30, 25, 22], material: 'SmoothPlastic', anchored: true, canCollide: false },
          { id: 'zb_buckle', name: 'BrassBuckle', className: 'Part', shape: 'Block', size: [0.35, 0.3, 0.12], position: [0, 2.1, 0.55], rotation: [8, 4, -3], color: [215, 175, 55], material: 'Metal', anchored: true, canCollide: false },
          // Head & Facial Details
          { id: 'zb_head', name: 'Head', className: 'Part', shape: 'Block', size: [1.2, 1.2, 1.2], position: [0, 4.6, 0.1], rotation: [6, 12, -8], color: [85, 125, 75], material: 'SmoothPlastic', anchored: true, canCollide: true },
          { id: 'zb_eye_l', name: 'LeftEye', className: 'Part', shape: 'Block', size: [0.24, 0.24, 0.1], position: [-0.3, 4.75, 0.72], rotation: [6, 12, -8], color: [255, 50, 40], material: 'Neon', anchored: true, canCollide: false },
          { id: 'zb_eye_r', name: 'RightEye', className: 'Part', shape: 'Block', size: [0.22, 0.22, 0.1], position: [0.3, 4.65, 0.72], rotation: [6, 12, -8], color: [230, 215, 110], material: 'SmoothPlastic', anchored: true, canCollide: false },
          { id: 'zb_jaw', name: 'ZombieJaw', className: 'Part', shape: 'Block', size: [0.65, 0.22, 0.12], position: [0, 4.22, 0.72], rotation: [6, 12, -8], color: [35, 25, 20], material: 'SmoothPlastic', anchored: true, canCollide: false },
          // Arms with shredded sleeves
          { id: 'zb_arm_l', name: 'LeftArm', className: 'Part', shape: 'Block', size: [1.0, 2.0, 1.0], position: [-1.5, 3.1, 0.7], rotation: [82, 8, -5], color: [85, 125, 75], material: 'SmoothPlastic', anchored: true, canCollide: true },
          { id: 'zb_sleeve_l', name: 'TornSleeveLeft', className: 'Part', shape: 'Block', size: [1.1, 1.2, 1.1], position: [-1.5, 3.4, 0.4], rotation: [82, 8, -5], color: [45, 48, 55], material: 'Fabric', anchored: true, canCollide: false },
          { id: 'zb_arm_r', name: 'RightArm', className: 'Part', shape: 'Block', size: [1.0, 2.0, 1.0], position: [1.5, 2.8, 0.3], rotation: [35, -12, 10], color: [85, 125, 75], material: 'SmoothPlastic', anchored: true, canCollide: true },
          { id: 'zb_sleeve_r', name: 'TornSleeveRight', className: 'Part', shape: 'Block', size: [1.1, 1.3, 1.1], position: [1.5, 3.1, 0.1], rotation: [35, -12, 10], color: [45, 48, 55], material: 'Fabric', anchored: true, canCollide: false },
          // Held Accessory: Weathered Briefcase attached to Right Arm
          { id: 'zb_case_body', name: 'Briefcase', className: 'Part', shape: 'Block', size: [0.6, 1.8, 2.4], position: [1.8, 1.4, 0.5], rotation: [10, -5, 0], color: [85, 45, 25], material: 'WoodPlanks', anchored: true, canCollide: false },
          { id: 'zb_case_handle', name: 'BriefcaseHandle', className: 'Part', shape: 'Cylinder', size: [0.15, 0.8, 0.15], position: [1.8, 2.35, 0.5], rotation: [0, 0, 90], color: [215, 175, 55], material: 'Metal', anchored: true, canCollide: false },
          { id: 'zb_case_latch_l', name: 'BrassLatchLeft', className: 'Part', shape: 'Block', size: [0.65, 0.2, 0.3], position: [1.8, 1.4, -0.3], rotation: [10, -5, 0], color: [225, 185, 60], material: 'Metal', anchored: true, canCollide: false },
          { id: 'zb_case_latch_r', name: 'BrassLatchRight', className: 'Part', shape: 'Block', size: [0.65, 0.2, 0.3], position: [1.8, 1.4, 1.3], rotation: [10, -5, 0], color: [225, 185, 60], material: 'Metal', anchored: true, canCollide: false },
          // Legs & Suit Trousers
          { id: 'zb_leg_l', name: 'LeftLeg', className: 'Part', shape: 'Block', size: [1.0, 2.0, 1.0], position: [-0.5, 1.0, 0.1], rotation: [14, 0, 0], color: [38, 40, 48], material: 'Fabric', anchored: true, canCollide: true },
          { id: 'zb_leg_r', name: 'RightLeg', className: 'Part', shape: 'Block', size: [1.0, 2.0, 1.0], position: [0.5, 1.0, -0.1], rotation: [-12, 0, 0], color: [38, 40, 48], material: 'Fabric', anchored: true, canCollide: true },
          { id: 'zb_shoe_l', name: 'LeftShoe', className: 'Part', shape: 'Block', size: [1.05, 0.4, 1.3], position: [-0.5, 0.2, 0.25], rotation: [14, 0, 0], color: [20, 18, 18], material: 'SmoothPlastic', anchored: true, canCollide: false },
          { id: 'zb_shoe_r', name: 'RightShoe', className: 'Part', shape: 'Block', size: [1.05, 0.4, 1.3], position: [0.5, 0.2, 0.05], rotation: [-12, 0, 0], color: [20, 18, 18], material: 'SmoothPlastic', anchored: true, canCollide: false },
        ]
      }
    },

    // ------------------------------------------------------------
    // 2. KNIGHT IN ARMOR (Humanoid with Plated Armor, Sword, Shield)
    // ------------------------------------------------------------
    {
      id: 'ref_armored_knight',
      name: 'ArmoredPaladinKnight',
      category: 'characters',
      keywords: ['knight', 'paladin', 'warrior', 'armor', 'sword', 'shield', 'soldier', 'medieval', 'guard'],
      description: 'Fully armored royal knight with plated helm, shoulder pauldrons, broadsword, and emblazoned heater shield.',
      model: {
        assetType: 'model',
        name: 'ArmoredPaladinKnight',
        primaryPartId: 'kt_torso',
        instances: [
          // Torso & Breastplate
          { id: 'kt_torso', name: 'Torso', className: 'Part', shape: 'Block', size: [2.0, 2.0, 1.0], position: [0, 3.0, 0], rotation: [0, 0, 0], color: [160, 165, 175], material: 'Metal', anchored: true, canCollide: true },
          { id: 'kt_plate', name: 'SteelBreastplate', className: 'Part', shape: 'Block', size: [1.8, 1.7, 0.2], position: [0, 3.1, 0.55], rotation: [0, 0, 0], color: [190, 195, 205], material: 'Metal', anchored: true, canCollide: false },
          { id: 'kt_gold_crest', name: 'GoldHeraldryCrest', className: 'Part', shape: 'Block', size: [0.5, 0.5, 0.1], position: [0, 3.3, 0.68], rotation: [0, 0, 45], color: [230, 185, 45], material: 'Metal', anchored: true, canCollide: false },
          // Helm & Visor
          { id: 'kt_head', name: 'Head', className: 'Part', shape: 'Block', size: [1.2, 1.2, 1.2], position: [0, 4.6, 0], rotation: [0, 0, 0], color: [170, 175, 185], material: 'Metal', anchored: true, canCollide: true },
          { id: 'kt_visor', name: 'HelmVisorSlit', className: 'Part', shape: 'Block', size: [0.9, 0.2, 0.15], position: [0, 4.65, 0.62], rotation: [0, 0, 0], color: [25, 25, 30], material: 'SmoothPlastic', anchored: true, canCollide: false },
          { id: 'kt_plume', name: 'RoyalRedPlume', className: 'Part', shape: 'Block', size: [0.3, 0.8, 1.2], position: [0, 5.4, -0.2], rotation: [10, 0, 0], color: [195, 35, 35], material: 'Fabric', anchored: true, canCollide: false },
          // Left Arm & Shield
          { id: 'kt_arm_l', name: 'LeftArm', className: 'Part', shape: 'Block', size: [1.0, 2.0, 1.0], position: [-1.5, 3.0, 0], rotation: [30, 0, 0], color: [150, 155, 165], material: 'Metal', anchored: true, canCollide: true },
          { id: 'kt_pauldron_l', name: 'PauldronLeft', className: 'Part', shape: 'Block', size: [1.3, 0.6, 1.3], position: [-1.6, 3.8, 0], rotation: [0, 0, -15], color: [220, 180, 50], material: 'Metal', anchored: true, canCollide: false },
          { id: 'kt_shield', name: 'KnightShield', className: 'Part', shape: 'Block', size: [2.2, 3.0, 0.25], position: [-1.8, 2.8, 0.8], rotation: [20, 25, 0], color: [180, 40, 40], material: 'WoodPlanks', anchored: true, canCollide: false },
          { id: 'kt_shield_boss', name: 'ShieldBoss', className: 'Part', shape: 'Ball', size: [0.8, 0.8, 0.5], position: [-1.8, 2.8, 0.95], rotation: [20, 25, 0], color: [230, 185, 45], material: 'Metal', anchored: true, canCollide: false },
          // Right Arm & Sword
          { id: 'kt_arm_r', name: 'RightArm', className: 'Part', shape: 'Block', size: [1.0, 2.0, 1.0], position: [1.5, 3.0, 0], rotation: [-25, 0, 0], color: [150, 155, 165], material: 'Metal', anchored: true, canCollide: true },
          { id: 'kt_pauldron_r', name: 'PauldronRight', className: 'Part', shape: 'Block', size: [1.3, 0.6, 1.3], position: [1.6, 3.8, 0], rotation: [0, 0, 15], color: [220, 180, 50], material: 'Metal', anchored: true, canCollide: false },
          { id: 'kt_sword_grip', name: 'SwordHilt', className: 'Part', shape: 'Cylinder', size: [0.3, 1.2, 0.3], position: [1.6, 2.0, 0.8], rotation: [70, 0, 0], color: [90, 55, 35], material: 'Fabric', anchored: true, canCollide: false },
          { id: 'kt_sword_guard', name: 'SwordCrossguard', className: 'Part', shape: 'Block', size: [1.4, 0.25, 0.4], position: [1.6, 2.4, 1.2], rotation: [70, 0, 0], color: [220, 180, 50], material: 'Metal', anchored: true, canCollide: false },
          { id: 'kt_sword_blade', name: 'SwordBlade', className: 'Part', shape: 'Block', size: [0.45, 3.6, 0.12], position: [1.6, 3.8, 2.4], rotation: [70, 0, 0], color: [225, 230, 240], material: 'Metal', anchored: true, canCollide: false },
          // Legs & Greaves
          { id: 'kt_leg_l', name: 'LeftLeg', className: 'Part', shape: 'Block', size: [1.0, 2.0, 1.0], position: [-0.5, 1.0, 0], rotation: [0, 0, 0], color: [140, 145, 155], material: 'Metal', anchored: true, canCollide: true },
          { id: 'kt_leg_r', name: 'RightLeg', className: 'Part', shape: 'Block', size: [1.0, 2.0, 1.0], position: [0.5, 1.0, 0], rotation: [0, 0, 0], color: [140, 145, 155], material: 'Metal', anchored: true, canCollide: true },
        ]
      }
    },

    // ------------------------------------------------------------
    // 3. SCI-FI OFF-ROAD BUGGY (Vehicle with Suspension, Rollcage, Wheels)
    // ------------------------------------------------------------
    {
      id: 'ref_offroad_buggy',
      name: 'CyberOffroadBuggy',
      category: 'vehicles',
      keywords: ['car', 'buggy', 'vehicle', 'truck', 'offroad', 'cyber', 'scifi car', 'rover'],
      description: 'Rugged cyber off-road buggy with heavy suspension, chunky all-terrain tires, roll cage, and neon headlights.',
      model: {
        assetType: 'model',
        name: 'CyberOffroadBuggy',
        primaryPartId: 'bg_chassis',
        instances: [
          // Chassis & Seat
          { id: 'bg_chassis', name: 'Chassis', className: 'Part', shape: 'Block', size: [4.4, 0.8, 7.6], position: [0, 1.4, 0], rotation: [0, 0, 0], color: [35, 38, 45], material: 'Metal', anchored: true, canCollide: true },
          { id: 'bg_seat', name: 'VehicleSeat', className: 'VehicleSeat', shape: 'Block', size: [2.0, 0.6, 2.0], position: [0, 1.8, 0], rotation: [0, 0, 0], color: [25, 25, 30], material: 'Fabric', anchored: true, canCollide: true },
          // Wheels (Front & Rear)
          { id: 'bg_wh_fl', name: 'Wheel_FL', className: 'Part', shape: 'Cylinder', size: [2.2, 0.8, 2.2], position: [-2.5, 1.1, 2.5], rotation: [0, 0, 90], color: [20, 20, 22], material: 'SmoothPlastic', anchored: true, canCollide: true },
          { id: 'bg_wh_fr', name: 'Wheel_FR', className: 'Part', shape: 'Cylinder', size: [2.2, 0.8, 2.2], position: [2.5, 1.1, 2.5], rotation: [0, 0, 90], color: [20, 20, 22], material: 'SmoothPlastic', anchored: true, canCollide: true },
          { id: 'bg_wh_rl', name: 'Wheel_RL', className: 'Part', shape: 'Cylinder', size: [2.4, 1.0, 2.4], position: [-2.6, 1.2, -2.5], rotation: [0, 0, 90], color: [20, 20, 22], material: 'SmoothPlastic', anchored: true, canCollide: true },
          { id: 'bg_wh_rr', name: 'Wheel_RR', className: 'Part', shape: 'Cylinder', size: [2.4, 1.0, 2.4], position: [2.6, 1.2, -2.5], rotation: [0, 0, 90], color: [20, 20, 22], material: 'SmoothPlastic', anchored: true, canCollide: true },
          // Hood & Windshield
          { id: 'bg_hood', name: 'FrontHood', className: 'WedgePart', shape: 'Wedge', size: [4.2, 0.9, 2.4], position: [0, 2.0, 2.4], rotation: [0, 180, 0], color: [220, 60, 45], material: 'Metal', anchored: true, canCollide: true },
          { id: 'bg_windshield', name: 'CockpitWindshield', className: 'Part', shape: 'Block', size: [3.8, 1.4, 0.15], position: [0, 2.8, 1.1], rotation: [-35, 0, 0], color: [160, 220, 255], material: 'Glass', transparency: 0.45, anchored: true, canCollide: false },
          // Roll Cage Tubing
          { id: 'bg_cage_l', name: 'RollCageBarLeft', className: 'Part', shape: 'Cylinder', size: [0.25, 3.2, 0.25], position: [-1.9, 3.2, -0.2], rotation: [25, 0, 0], color: [230, 190, 40], material: 'Metal', anchored: true, canCollide: false },
          { id: 'bg_cage_r', name: 'RollCageBarRight', className: 'Part', shape: 'Cylinder', size: [0.25, 3.2, 0.25], position: [1.9, 3.2, -0.2], rotation: [25, 0, 0], color: [230, 190, 40], material: 'Metal', anchored: true, canCollide: false },
          // Neon Headlights & Front Bullbar
          { id: 'bg_light_l', name: 'HeadlightLeft', className: 'Part', shape: 'Cylinder', size: [0.6, 0.2, 0.6], position: [-1.6, 1.8, 3.8], rotation: [90, 0, 0], color: [80, 220, 255], material: 'Neon', anchored: true, canCollide: false },
          { id: 'bg_light_r', name: 'HeadlightRight', className: 'Part', shape: 'Cylinder', size: [0.6, 0.2, 0.6], position: [1.6, 1.8, 3.8], rotation: [90, 0, 0], color: [80, 220, 255], material: 'Neon', anchored: true, canCollide: false },
          { id: 'bg_bumper', name: 'FrontBumperBullbar', className: 'Part', shape: 'Block', size: [4.6, 0.5, 0.6], position: [0, 1.2, 4.0], rotation: [0, 0, 0], color: [25, 25, 28], material: 'Metal', anchored: true, canCollide: true },
        ]
      }
    },

    // ------------------------------------------------------------
    // 4. MAGICAL FLOATING CRYSTAL CORE (Sci-Fi / Fantasy Prop)
    // ------------------------------------------------------------
    {
      id: 'ref_crystal_core',
      name: 'MagicCrystalCore',
      category: 'props',
      keywords: ['crystal', 'core', 'gem', 'magic', 'energy', 'floating', 'portal', 'runes'],
      description: 'Luminous cyan crystal obelisk hovering above an ancient runic cobblestone pedestal with orbiting golden rings.',
      model: {
        assetType: 'model',
        name: 'MagicCrystalCore',
        primaryPartId: 'cc_pedestal',
        instances: [
          // Base Pedestal
          { id: 'cc_pedestal', name: 'StonePedestal', className: 'Part', shape: 'Cylinder', size: [3.6, 1.4, 3.6], position: [0, 0.7, 0], rotation: [0, 0, 0], color: [90, 92, 98], material: 'Cobblestone', anchored: true, canCollide: true },
          { id: 'cc_rune_ring', name: 'RunicGlowRing', className: 'Part', shape: 'Cylinder', size: [3.4, 0.05, 3.4], position: [0, 1.43, 0], rotation: [0, 0, 0], color: [0, 240, 255], material: 'Neon', anchored: true, canCollide: false },
          // Floating Primary Crystal (rotated 45 deg)
          { id: 'cc_main_crystal', name: 'CentralCrystal', className: 'Part', shape: 'Block', size: [1.8, 3.4, 1.8], position: [0, 4.2, 0], rotation: [15, 45, 10], color: [0, 230, 255], material: 'Neon', anchored: true, canCollide: true },
          // Orbiting Shards
          { id: 'cc_shard_1', name: 'OrbitShardTop', className: 'Part', shape: 'Block', size: [0.6, 1.4, 0.6], position: [1.6, 4.8, 1.0], rotation: [25, 30, -20], color: [160, 60, 255], material: 'Neon', anchored: true, canCollide: false },
          { id: 'cc_shard_2', name: 'OrbitShardBottom', className: 'Part', shape: 'Block', size: [0.6, 1.2, 0.6], position: [-1.4, 3.2, -1.2], rotation: [-15, 60, 25], color: [160, 60, 255], material: 'Neon', anchored: true, canCollide: false },
          // Gold Containment Ring
          { id: 'cc_gold_ring', name: 'ContainmentRing', className: 'Part', shape: 'Cylinder', size: [4.4, 0.25, 4.4], position: [0, 4.2, 0], rotation: [30, 0, 0], color: [235, 185, 45], material: 'Metal', anchored: true, canCollide: false },
        ]
      }
    },

    // ------------------------------------------------------------
    // 5. MEDIEVAL STONE WATCHTOWER (Architecture)
    // ------------------------------------------------------------
    {
      id: 'ref_stone_watchtower',
      name: 'MedievalStoneWatchtower',
      category: 'architecture',
      keywords: ['tower', 'watchtower', 'castle', 'fortress', 'lighthouse', 'stone', 'defense'],
      description: 'Tall defensive stone watchtower with arched entrance, battlements, observation platform, and beacon torch.',
      model: {
        assetType: 'model',
        name: 'MedievalWatchtower',
        primaryPartId: 'tw_foundation',
        instances: [
          // Foundation & Tower Shaft
          { id: 'tw_foundation', name: 'FoundationBase', className: 'Part', shape: 'Cylinder', size: [6.4, 1.2, 6.4], position: [0, 0.6, 0], rotation: [0, 0, 0], color: [75, 78, 85], material: 'Cobblestone', anchored: true, canCollide: true },
          { id: 'tw_shaft', name: 'TowerShaft', className: 'Part', shape: 'Cylinder', size: [5.2, 9.0, 5.2], position: [0, 5.7, 0], rotation: [0, 0, 0], color: [110, 114, 122], material: 'Cobblestone', anchored: true, canCollide: true },
          // Platform Rim & Floor
          { id: 'tw_platform_rim', name: 'PlatformRim', className: 'Part', shape: 'Cylinder', size: [6.6, 0.8, 6.6], position: [0, 10.6, 0], rotation: [0, 0, 0], color: [85, 88, 96], material: 'Cobblestone', anchored: true, canCollide: true },
          { id: 'tw_floor', name: 'PlatformFloor', className: 'Part', shape: 'Cylinder', size: [5.8, 0.2, 5.8], position: [0, 11.1, 0], rotation: [0, 0, 0], color: [120, 80, 45], material: 'WoodPlanks', anchored: true, canCollide: true },
          // Crenellations (4 Merlon Blocks)
          { id: 'tw_merlon_n', name: 'MerlonNorth', className: 'Part', shape: 'Block', size: [1.6, 1.4, 0.6], position: [0, 11.8, 3.0], rotation: [0, 0, 0], color: [100, 104, 112], material: 'Cobblestone', anchored: true, canCollide: true },
          { id: 'tw_merlon_s', name: 'MerlonSouth', className: 'Part', shape: 'Block', size: [1.6, 1.4, 0.6], position: [0, 11.8, -3.0], rotation: [0, 0, 0], color: [100, 104, 112], material: 'Cobblestone', anchored: true, canCollide: true },
          { id: 'tw_merlon_e', name: 'MerlonEast', className: 'Part', shape: 'Block', size: [0.6, 1.4, 1.6], position: [3.0, 11.8, 0], rotation: [0, 0, 0], color: [100, 104, 112], material: 'Cobblestone', anchored: true, canCollide: true },
          { id: 'tw_merlon_w', name: 'MerlonWest', className: 'Part', shape: 'Block', size: [0.6, 1.4, 1.6], position: [-3.0, 11.8, 0], rotation: [0, 0, 0], color: [100, 104, 112], material: 'Cobblestone', anchored: true, canCollide: true },
          // Beacon Flame
          { id: 'tw_beacon', name: 'BeaconFlame', className: 'Part', shape: 'Ball', size: [1.2, 1.6, 1.2], position: [0, 12.2, 0], rotation: [0, 0, 0], color: [255, 140, 20], material: 'Neon', anchored: true, canCollide: false },
        ]
      }
    },

    // ------------------------------------------------------------
    // 6. STYLIZED ARMCHAIR (Furniture)
    // ------------------------------------------------------------
    {
      id: 'ref_stylized_armchair',
      name: 'RoyalVelvetArmchair',
      category: 'furniture',
      keywords: ['chair', 'armchair', 'throne', 'seat', 'sofa', 'furniture'],
      description: 'Gilded regal armchair with thick crimson velvet cushions, curved backrest, and gold lion-claw feet.',
      model: {
        assetType: 'model',
        name: 'RoyalVelvetArmchair',
        primaryPartId: 'ch_seat',
        instances: [
          // Seat & Cushion
          { id: 'ch_seat', name: 'SeatFrame', className: 'Part', shape: 'Block', size: [2.8, 0.4, 2.6], position: [0, 1.4, 0], rotation: [0, 0, 0], color: [80, 50, 30], material: 'WoodPlanks', anchored: true, canCollide: true },
          { id: 'ch_cushion', name: 'VelvetCushion', className: 'Part', shape: 'Block', size: [2.5, 0.6, 2.3], position: [0, 1.8, 0.05], rotation: [0, 0, 0], color: [160, 25, 35], material: 'Fabric', anchored: true, canCollide: true },
          // Backrest
          { id: 'ch_back', name: 'BackrestPanel', className: 'Part', shape: 'Block', size: [2.8, 3.2, 0.4], position: [0, 3.3, -1.2], rotation: [-5, 0, 0], color: [160, 25, 35], material: 'Fabric', anchored: true, canCollide: true },
          { id: 'ch_crest', name: 'BackrestGoldCrest', className: 'Part', shape: 'Ball', size: [0.8, 0.8, 0.6], position: [0, 5.0, -1.3], rotation: [0, 0, 0], color: [225, 185, 45], material: 'Metal', anchored: true, canCollide: false },
          // Armrests
          { id: 'ch_arm_l', name: 'ArmrestLeft', className: 'Part', shape: 'Block', size: [0.4, 1.2, 2.4], position: [-1.4, 2.3, 0], rotation: [0, 0, 0], color: [90, 55, 35], material: 'Wood', anchored: true, canCollide: true },
          { id: 'ch_arm_r', name: 'ArmrestRight', className: 'Part', shape: 'Block', size: [0.4, 1.2, 2.4], position: [1.4, 2.3, 0], rotation: [0, 0, 0], color: [90, 55, 35], material: 'Wood', anchored: true, canCollide: true },
          // 4 Turned Legs
          { id: 'ch_leg_fl', name: 'Leg_FL', className: 'Part', shape: 'Cylinder', size: [0.35, 1.3, 0.35], position: [-1.2, 0.65, 1.1], rotation: [0, 0, 0], color: [80, 50, 30], material: 'Wood', anchored: true, canCollide: true },
          { id: 'ch_leg_fr', name: 'Leg_FR', className: 'Part', shape: 'Cylinder', size: [0.35, 1.3, 0.35], position: [1.2, 0.65, 1.1], rotation: [0, 0, 0], color: [80, 50, 30], material: 'Wood', anchored: true, canCollide: true },
          { id: 'ch_leg_rl', name: 'Leg_RL', className: 'Part', shape: 'Cylinder', size: [0.35, 1.3, 0.35], position: [-1.2, 0.65, -1.1], rotation: [0, 0, 0], color: [80, 50, 30], material: 'Wood', anchored: true, canCollide: true },
          { id: 'ch_leg_rr', name: 'Leg_RR', className: 'Part', shape: 'Cylinder', size: [0.35, 1.3, 0.35], position: [1.2, 0.65, -1.1], rotation: [0, 0, 0], color: [80, 50, 30], material: 'Wood', anchored: true, canCollide: true },
        ]
      }
    }
  ];

  /**
   * Retrieves the most semantically relevant 3D reference blueprint(s) for a given prompt.
   */
  public static getRelevantReferences(prompt: string, maxRefs = 2): ReferenceBlueprint[] {
    const p = prompt.toLowerCase();
    const scored = this.blueprints.map((bp) => {
      let score = 0;
      // Exact keyword matches
      for (const kw of bp.keywords) {
        if (p.includes(kw)) {
          score += kw.length > 4 ? 3 : 2;
        }
      }
      // Category match
      if (
        (bp.category === 'characters' && (p.includes('zombie') || p.includes('undead') || p.includes('character') || p.includes('knight') || p.includes('npc') || p.includes('warrior'))) ||
        (bp.category === 'vehicles' && (p.includes('car') || p.includes('truck') || p.includes('buggy') || p.includes('vehicle') || p.includes('ship') || p.includes('helicopter'))) ||
        (bp.category === 'furniture' && (p.includes('chair') || p.includes('table') || p.includes('desk') || p.includes('sofa') || p.includes('throne'))) ||
        (bp.category === 'architecture' && (p.includes('tower') || p.includes('castle') || p.includes('house') || p.includes('bridge') || p.includes('building'))) ||
        (bp.category === 'props' && (p.includes('crystal') || p.includes('chest') || p.includes('crate') || p.includes('sword') || p.includes('weapon')))
      ) {
        score += 2;
      }
      return { bp, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // If top score is > 0, return top matches
    if (scored[0] && scored[0].score > 0) {
      return scored.slice(0, maxRefs).map((s) => s.bp);
    }

    // Default fallback reference: return the most versatile character/prop blueprint
    return [this.blueprints[0]];
  }

  /**
   * Formats retrieved references into an instructional string block for LLM prompts.
   */
  public static formatReferenceForPrompt(prompt: string): string {
    const refs = this.getRelevantReferences(prompt, 1);
    if (refs.length === 0) return '';

    const ref = refs[0];
    const compactModel = {
      name: ref.model.name,
      primaryPartId: ref.model.primaryPartId,
      instances: ref.model.instances.map((inst: any) => ({
        id: inst.id,
        name: inst.name,
        className: inst.className,
        shape: inst.shape,
        size: inst.size,
        position: inst.position,
        rotation: inst.rotation,
        color: inst.color,
        material: inst.material,
        ...(inst.transparency ? { transparency: inst.transparency } : {}),
      })),
    };

    return `
=============================================================================
HIGH-FIDELITY ARCHITECTURAL REFERENCE BLUEPRINT:
Category: ${ref.category.toUpperCase()} | Model: "${ref.name}"
Description: ${ref.description}

STUDY THIS REFERENCE EXAMPLE CAREFULLY:
- Notice how parts are decomposed into R6 limbs, layered clothing panels, and held accessories.
- Notice how offset positions (+0.02 to +0.05 studs) are used to prevent texture z-fighting.
- Notice the authentic Roblox stud scale (Torso 2x2x1 at Y=3, Head 1.2x1.2x1.2 at Y=4.6, Limbs 1x2x1).
- Notice multi-material contrast: Fabric for garments, SmoothPlastic for skin/surfaces, Metal for hardware, Neon for glowing eyes/energy.

REFERENCE JSON:
${JSON.stringify(compactModel, null, 2)}
=============================================================================
`;
  }
}

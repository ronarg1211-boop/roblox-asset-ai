// ============================================================
// Roblox Asset AI - Material & Palette Specifications
// ============================================================

import { RobloxMaterial } from '../types/roblox';

export interface MaterialProperties {
  roughness: number;
  metalness: number;
  emissive?: boolean;
  transparentDefault?: number;
  textureHint: string;
  defaultHex: string;
}

export const ROBLOX_MATERIALS: Record<RobloxMaterial, MaterialProperties> = {
  Plastic: { roughness: 0.5, metalness: 0.0, textureHint: 'smooth', defaultHex: '#A3A2A5' },
  SmoothPlastic: { roughness: 0.15, metalness: 0.0, textureHint: 'glossy', defaultHex: '#E5E4DE' },
  Neon: { roughness: 0.1, metalness: 0.0, emissive: true, textureHint: 'emissive', defaultHex: '#FFF587' },
  Wood: { roughness: 0.8, metalness: 0.0, textureHint: 'wood_grain', defaultHex: '#6B4423' },
  WoodPlanks: { roughness: 0.75, metalness: 0.0, textureHint: 'wood_planks', defaultHex: '#8A5A36' },
  Metal: { roughness: 0.35, metalness: 0.85, textureHint: 'brushed_metal', defaultHex: '#7C828D' },
  CorrodedMetal: { roughness: 0.9, metalness: 0.4, textureHint: 'rust', defaultHex: '#5B4031' },
  DiamondPlate: { roughness: 0.3, metalness: 0.9, textureHint: 'diamond_plate', defaultHex: '#9BA3AF' },
  Foil: { roughness: 0.1, metalness: 0.95, textureHint: 'foil', defaultHex: '#DCE1E9' },
  Grass: { roughness: 0.85, metalness: 0.0, textureHint: 'grass_blades', defaultHex: '#4B752C' },
  Ice: { roughness: 0.05, metalness: 0.1, transparentDefault: 0.25, textureHint: 'ice', defaultHex: '#AFDBF5' },
  Brick: { roughness: 0.9, metalness: 0.0, textureHint: 'bricks', defaultHex: '#993D3D' },
  Sand: { roughness: 0.95, metalness: 0.0, textureHint: 'sand_grains', defaultHex: '#D7C49E' },
  Fabric: { roughness: 0.9, metalness: 0.0, textureHint: 'cloth_weave', defaultHex: '#4A5568' },
  Granite: { roughness: 0.7, metalness: 0.05, textureHint: 'granite_stone', defaultHex: '#4A4E53' },
  Glass: { roughness: 0.05, metalness: 0.1, transparentDefault: 0.6, textureHint: 'clear_glass', defaultHex: '#D6EAF8' },
  Pebble: { roughness: 0.8, metalness: 0.0, textureHint: 'pebbles', defaultHex: '#5C564C' },
  Cobblestone: { roughness: 0.85, metalness: 0.0, textureHint: 'cobblestone', defaultHex: '#69645E' },
  Slate: { roughness: 0.8, metalness: 0.05, textureHint: 'slate_rock', defaultHex: '#52555A' },
  Marble: { roughness: 0.2, metalness: 0.0, textureHint: 'polished_marble', defaultHex: '#EAEAEA' },
  Concrete: { roughness: 0.9, metalness: 0.0, textureHint: 'rough_concrete', defaultHex: '#7F8287' },
  ForceField: { roughness: 0.0, metalness: 0.0, emissive: true, transparentDefault: 0.4, textureHint: 'forcefield', defaultHex: '#00D4FF' },
};

/**
 * Standard Roblox Color Palette (BrickColor presets mapping to sRGB)
 */
export const ROBLOX_PRESET_COLORS: Record<string, [number, number, number]> = {
  BrightRed: [196, 40, 28],
  BrightBlue: [13, 105, 172],
  BrightYellow: [245, 205, 47],
  BrightGreen: [75, 151, 75],
  DarkStoneGrey: [99, 95, 98],
  MediumStoneGrey: [161, 165, 162],
  Black: [27, 42, 53],
  White: [242, 243, 243],
  ReddishBrown: [105, 64, 40],
  DarkOrange: [160, 85, 37],
  Nougat: [204, 142, 105],
  InstitutionalWhite: [248, 248, 248],
  Gold: [239, 184, 56],
  SandBlue: [116, 134, 157],
};

/**
 * Normalizes color representation to 0-1 range for WebGL rendering
 */
export function normalizeColor(c: [number, number, number]): [number, number, number] {
  if (c[0] > 1 || c[1] > 1 || c[2] > 1) {
    return [c[0] / 255, c[1] / 255, c[2] / 255];
  }
  return [c[0], c[1], c[2]];
}

/**
 * Normalizes color representation to 0-255 range for Roblox XML
 */
export function toRgb255(c: [number, number, number]): [number, number, number] {
  if (c[0] <= 1 && c[1] <= 1 && c[2] <= 1) {
    return [Math.round(c[0] * 255), Math.round(c[1] * 255), Math.round(c[2] * 255)];
  }
  return [Math.round(c[0]), Math.round(c[1]), Math.round(c[2])];
}

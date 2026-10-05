// ============================================================
// Roblox Asset AI - Server-Side 3D Preview Renderer
// Generates isometric visual renders of Roblox IR for the Vision Evaluator
// ============================================================

import { RobloxModelIR, RobloxPartIR, RobloxInstanceIR } from '../types/roblox';
import { ROBLOX_MATERIALS, toRgb255 } from '../roblox/materials';

interface ProjectedFace {
  points: [number, number][];
  depth: number;
  color: string;
  stroke: string;
}

export class ServerPreviewRenderer {
  /**
   * Renders a Roblox Model IR into a base64 SVG dataURL simulating a 3D isometric studio render
   */
  public renderToDataUrl(model: RobloxModelIR, width = 640, height = 480): string {
    const parts: RobloxPartIR[] = [];

    function collectParts(inst: RobloxInstanceIR) {
      if (inst.className === 'Part' || inst.className === 'WedgePart' || inst.className === 'MeshPart') {
        parts.push(inst as RobloxPartIR);
      }
      if (inst.children) {
        for (const child of inst.children) {
          collectParts(child);
        }
      }
    }

    for (const inst of model.instances) {
      collectParts(inst);
    }

    // Compute bounding box for centering
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (const p of parts) {
      const [px, py, pz] = p.position;
      const [sx, sy, sz] = p.size;
      minX = Math.min(minX, px - sx / 2);
      maxX = Math.max(maxX, px + sx / 2);
      minY = Math.min(minY, py - sy / 2);
      maxY = Math.max(maxY, py + sy / 2);
      minZ = Math.min(minZ, pz - sz / 2);
      maxZ = Math.max(maxZ, pz + sz / 2);
    }

    if (parts.length === 0) {
      minX = -2; maxX = 2; minY = 0; maxY = 4; minZ = -2; maxZ = 2;
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const spanX = Math.max(1, maxX - minX);
    const spanY = Math.max(1, maxY - minY);
    const spanZ = Math.max(1, maxZ - minZ);
    const maxSpan = Math.max(spanX, spanY, spanZ);

    // Isometric projection angle (35.264° pitch, 45° yaw)
    const scale = Math.min(width, height) / (maxSpan * 2.8);
    const originX = width / 2;
    const originY = height / 2 + (spanY * scale) * 0.15;

    // Isometric projection function
    const project = (x: number, y: number, z: number): [number, number, number] => {
      const rx = x - centerX;
      const ry = y - centerY;
      const rz = z - centerZ;

      // Rotate 45 deg around Y
      const cos45 = Math.SQRT1_2;
      const sin45 = Math.SQRT1_2;
      const xRot = rx * cos45 - rz * sin45;
      const zRot = rx * sin45 + rz * cos45;

      // Project isometric: screenX = xRot, screenY = -ry * cos30 + zRot * sin30
      const screenX = originX + xRot * scale;
      const screenY = originY - ry * scale * 0.9 + zRot * scale * 0.5;
      const depth = zRot; // for Painter's algorithm depth sorting

      return [screenX, screenY, depth];
    };

    const faces: ProjectedFace[] = [];

    // Render each part as 6 box faces with directional shading
    for (const part of parts) {
      const [px, py, pz] = part.position;
      const [sx, sy, sz] = part.size;
      const hx = sx / 2, hy = sy / 2, hz = sz / 2;

      const [r, g, b] = toRgb255(part.color);
      const isNeon = part.material === 'Neon';

      // 8 Vertices of the Part bounding box
      const v000 = project(px - hx, py - hy, pz - hz);
      const v100 = project(px + hx, py - hy, pz - hz);
      const v110 = project(px + hx, py + hy, pz - hz);
      const v010 = project(px - hx, py + hy, pz - hz);
      const v001 = project(px - hx, py - hy, pz + hz);
      const v101 = project(px + hx, py - hy, pz + hz);
      const v111 = project(px + hx, py + hy, pz + hz);
      const v011 = project(px - hx, py + hy, pz + hz);

      // Top Face (Light source from above)
      const topColor = isNeon
        ? `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`
        : `rgb(${Math.min(255, Math.round(r * 1.15))}, ${Math.min(255, Math.round(g * 1.15))}, ${Math.min(255, Math.round(b * 1.15))})`;
      faces.push({
        points: [[v010[0], v010[1]], [v110[0], v110[1]], [v111[0], v111[1]], [v011[0], v011[1]]],
        depth: (v010[2] + v110[2] + v111[2] + v011[2]) / 4,
        color: topColor,
        stroke: `rgba(0, 0, 0, 0.25)`,
      });

      // Front-Right Face
      const rightColor = isNeon
        ? `rgb(${r}, ${g}, ${b})`
        : `rgb(${Math.round(r * 0.9)}, ${Math.round(g * 0.9)}, ${Math.round(b * 0.9)})`;
      faces.push({
        points: [[v100[0], v100[1]], [v110[0], v110[1]], [v111[0], v111[1]], [v101[0], v101[1]]],
        depth: (v100[2] + v110[2] + v111[2] + v101[2]) / 4,
        color: rightColor,
        stroke: `rgba(0, 0, 0, 0.25)`,
      });

      // Front-Left Face (Shaded)
      const frontColor = isNeon
        ? `rgb(${r}, ${g}, ${b})`
        : `rgb(${Math.round(r * 0.72)}, ${Math.round(g * 0.72)}, ${Math.round(b * 0.72)})`;
      faces.push({
        points: [[v001[0], v001[1]], [v011[0], v011[1]], [v111[0], v111[1]], [v101[0], v101[1]]],
        depth: (v001[2] + v011[2] + v111[2] + v101[2]) / 4,
        color: frontColor,
        stroke: `rgba(0, 0, 0, 0.25)`,
      });
    }

    // Depth sort faces back to front
    faces.sort((a, b) => a.depth - b.depth);

    // Build SVG document
    const svgParts: string[] = [];
    svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`);
    
    // Background studio gradient
    svgParts.push(`
      <defs>
        <radialGradient id="studioBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#1e2430" />
          <stop offset="100%" stop-color="#0c0e12" />
        </radialGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#studioBg)" />
    `);

    // Ground Grid Lines
    const gridLines: string[] = [];
    const gridRange = Math.ceil(maxSpan / 2) + 2;
    const baseFloorY = minY - 0.05;

    for (let gx = -gridRange; gx <= gridRange; gx += 2) {
      const p1 = project(gx, baseFloorY, -gridRange);
      const p2 = project(gx, baseFloorY, gridRange);
      gridLines.push(`<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="#283244" stroke-width="1" opacity="0.6" />`);
    }
    for (let gz = -gridRange; gz <= gridRange; gz += 2) {
      const p1 = project(-gridRange, baseFloorY, gz);
      const p2 = project(gridRange, baseFloorY, gz);
      gridLines.push(`<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="#283244" stroke-width="1" opacity="0.6" />`);
    }
    svgParts.push(`<g id="grid">${gridLines.join('\n')}</g>`);

    // Render Model Faces
    for (const face of faces) {
      const pointsStr = face.points.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
      svgParts.push(`<polygon points="${pointsStr}" fill="${face.color}" stroke="${face.stroke}" stroke-width="0.8" stroke-linejoin="round" />`);
    }

    // Overlay Watermark / Asset Info
    svgParts.push(`
      <text x="16" y="28" fill="#8A99B5" font-family="system-ui, sans-serif" font-size="12" font-weight="600">ROBLOX ASSET AI - VISION INSPECTION RENDER</text>
      <text x="16" y="46" fill="#46536A" font-family="system-ui, sans-serif" font-size="11">Model: ${model.name} (${parts.length} Parts)</text>
    `);

    svgParts.push('</svg>');

    const svgString = svgParts.join('\n');
    const base64 = Buffer.from(svgString, 'utf-8').toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }
}

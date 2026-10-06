// ============================================================
// POST /api/export
// Exports Roblox IR to .rbxmx (XML) or .rbxm (Binary) with pre-export validation
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { RbxmxExporter } from '@/lib/roblox/rbxmx-exporter';
import { RbxmExporter } from '@/lib/roblox/rbxm-exporter';
import { validateRbxmxXml, validateRbxmBinary } from '@/lib/roblox/validator';
import { validateModelIR, validateAnimationIR } from '@/lib/schema/validation';
import { RobloxModelIR, RobloxAnimationIR } from '@/lib/types/roblox';
import { autoRigModel } from '@/lib/roblox/auto-rigger';

export async function POST(req: NextRequest) {
  try {
    const { modelIR, animationIR, format = 'rbxmx', target } = await req.json();

    if (!modelIR && !animationIR) {
      return NextResponse.json(
        { error: 'Either modelIR or animationIR must be provided' },
        { status: 400 }
      );
    }

    const xmlExporter = new RbxmxExporter();
    const binaryExporter = new RbxmExporter();

    const isAnimationExport = target === 'animation' || (!modelIR && Boolean(animationIR));

    // Export Animation
    if (isAnimationExport && animationIR) {
      const animVal = validateAnimationIR(animationIR as RobloxAnimationIR);
      if (!animVal.valid) {
        return NextResponse.json(
          { error: 'Animation IR failed schema validation', details: animVal.errors },
          { status: 422 }
        );
      }

      const safeName = (animationIR.name || 'RobloxAnimation').replace(/[^a-zA-Z0-9_-]/g, '_');

      if (format === 'json') {
        return new NextResponse(JSON.stringify(animationIR, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${safeName}.json"`,
          },
        });
      }

      const xml = xmlExporter.exportAnimation(animationIR);
      const valReport = validateRbxmxXml(xml);
      if (!valReport.valid) {
        return NextResponse.json(
          { error: 'Exported XML failed Roblox validation', details: valReport.errors },
          { status: 422 }
        );
      }

      return new NextResponse(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Content-Disposition': `attachment; filename="${safeName}.rbxmx"`,
          'X-Validation-Valid': 'true',
          'X-Validation-Instances': String(valReport.totalInstances),
        },
      });
    }

    // Export Model
    let model = modelIR as RobloxModelIR;
    // Auto-rig if joints/welds are not yet present
    const hasRig = model.instances.some((i) => i.className === 'Motor6D' || i.className === 'WeldConstraint');
    if (!hasRig) {
      model = autoRigModel(model).model;
    }

    const modelVal = validateModelIR(model);
    if (!modelVal.valid) {
      return NextResponse.json(
        { error: 'Model IR failed schema validation', details: modelVal.errors },
        { status: 422 }
      );
    }

    const safeName = (model.name || 'RobloxAsset').replace(/[^a-zA-Z0-9_-]/g, '_');

    if (format === 'rbxm') {
      const binary = binaryExporter.exportModel(model);
      const valReport = validateRbxmBinary(binary);
      if (!valReport.valid) {
        return NextResponse.json(
          { error: 'Exported Roblox binary failed validation', details: valReport.errors },
          { status: 422 }
        );
      }

      return new NextResponse(new Uint8Array(binary), {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${safeName}.rbxm"`,
          'X-Validation-Valid': 'true',
          'X-Validation-Instances': String(valReport.totalInstances),
        },
      });
    }

    if (format === 'json') {
      return new NextResponse(JSON.stringify(model, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${safeName}.json"`,
        },
      });
    }

    // Default .rbxmx (XML)
    const xml = xmlExporter.exportModel(model);
    const valReport = validateRbxmxXml(xml);
    if (!valReport.valid) {
      return NextResponse.json(
        { error: 'Exported Roblox XML failed validation', details: valReport.errors },
        { status: 422 }
      );
    }

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="${safeName}.rbxmx"`,
        'X-Validation-Valid': 'true',
        'X-Validation-Instances': String(valReport.totalInstances),
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during export' },
      { status: 500 }
    );
  }
}

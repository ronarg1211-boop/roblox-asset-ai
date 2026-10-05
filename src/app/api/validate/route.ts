// ============================================================
// POST /api/validate
// Validates an uploaded .rbxmx XML or .rbxm binary asset
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { validateRbxmxXml, validateRbxmBinary } from '@/lib/roblox/validator';
import { validateModelIR } from '@/lib/schema/validation';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body.instances && body.name) {
        const result = validateModelIR(body);
        return NextResponse.json({
          format: 'json_ir',
          valid: result.valid,
          errors: result.errors,
          warnings: result.warnings,
        });
      }
      if (body.xmlContent) {
        const report = validateRbxmxXml(body.xmlContent);
        return NextResponse.json(report);
      }
    }

    const text = await req.text();
    if (text.startsWith('<roblox')) {
      const report = validateRbxmxXml(text);
      return NextResponse.json(report);
    }

    return NextResponse.json(
      { error: 'Unsupported validation payload. Send .rbxmx XML or JSON IR.' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Validation error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q');

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleHindi: { contains: search } },
        { eligibilitySummary: { contains: search } },
      ];
    }

    const schemes = await prisma.welfareScheme.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: schemes.length, schemes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch welfare schemes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      title,
      titleHindi,
      category,
      targetAudience,
      eligibilitySummary,
      benefitsSummary,
      documentsNeeded,
      officialPortalUrl,
    } = body;

    if (!code || !title || !titleHindi || !category) {
      return NextResponse.json(
        { error: 'Fields code, title, titleHindi, and category are required.' },
        { status: 400 }
      );
    }

    const scheme = await prisma.welfareScheme.create({
      data: {
        code,
        title,
        titleHindi,
        category,
        targetAudience: targetAudience || 'सभी श्रमिक',
        eligibilitySummary: eligibilitySummary || '',
        benefitsSummary: benefitsSummary || '',
        documentsNeeded: documentsNeeded || 'आधार कार्ड, बैंक खाता',
        officialPortalUrl: officialPortalUrl || null,
      },
    });

    return NextResponse.json({ success: true, scheme }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create welfare scheme' },
      { status: 500 }
    );
  }
}


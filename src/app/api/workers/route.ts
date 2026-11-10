import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const uan = searchParams.get('uan');
    const id = searchParams.get('id');

    if (id) {
      const worker = await prisma.worker.findUnique({
        where: { id },
        include: {
          grievances: { take: 5, orderBy: { createdAt: 'desc' } },
          wageEntries: { take: 10, orderBy: { date: 'desc' } },
        },
      });
      return NextResponse.json({ success: true, worker });
    }

    if (phone) {
      const worker = await prisma.worker.findUnique({
        where: { phone },
        include: {
          grievances: { take: 5, orderBy: { createdAt: 'desc' } },
          wageEntries: { take: 10, orderBy: { date: 'desc' } },
        },
      });
      return NextResponse.json({ success: true, worker });
    }

    if (uan) {
      const worker = await prisma.worker.findFirst({
        where: { eShramCardNumber: uan },
        include: {
          grievances: { take: 5, orderBy: { createdAt: 'desc' } },
          wageEntries: { take: 10, orderBy: { date: 'desc' } },
        },
      });
      return NextResponse.json({ success: true, worker });
    }

    // List recent workers (up to 20)
    const workers = await prisma.worker.findMany({
      take: 20,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        occupation: true,
        state: true,
        district: true,
        dailyWage: true,
        eShramCardNumber: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, count: workers.length, workers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to query worker records.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      occupation,
      state,
      district,
      dailyWage,
      eShramCardNumber,
      language = 'hi',
    } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Worker name is required.' },
        { status: 400 }
      );
    }

    const wage = dailyWage !== undefined && dailyWage !== null ? parseFloat(dailyWage) : null;

    let worker;

    if (phone && phone.trim() !== '') {
      // Upsert by phone
      worker = await prisma.worker.upsert({
        where: { phone: phone.trim() },
        update: {
          name: name.trim(),
          occupation: occupation?.trim() || null,
          state: state?.trim() || null,
          district: district?.trim() || null,
          dailyWage: isNaN(wage as number) ? null : wage,
          eShramCardNumber: eShramCardNumber?.trim() || null,
          language,
        },
        create: {
          name: name.trim(),
          phone: phone.trim(),
          occupation: occupation?.trim() || null,
          state: state?.trim() || null,
          district: district?.trim() || null,
          dailyWage: isNaN(wage as number) ? null : wage,
          eShramCardNumber: eShramCardNumber?.trim() || null,
          language,
        },
      });
    } else {
      // Create without unique phone
      worker = await prisma.worker.create({
        data: {
          name: name.trim(),
          occupation: occupation?.trim() || null,
          state: state?.trim() || null,
          district: district?.trim() || null,
          dailyWage: isNaN(wage as number) ? null : wage,
          eShramCardNumber: eShramCardNumber?.trim() || null,
          language,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Worker profile successfully saved and synced with Prisma database.',
      worker,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save worker record.' },
      { status: 500 }
    );
  }
}

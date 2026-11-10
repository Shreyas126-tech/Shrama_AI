import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const workerPhone = searchParams.get('phone');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (workerPhone) {
      where.workerPhone = workerPhone;
    }

    const grievances = await prisma.grievance.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        worker: {
          select: {
            name: true,
            phone: true,
            state: true,
            occupation: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, count: grievances.length, grievances });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch grievances' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      workerName,
      workerPhone,
      category,
      title,
      description,
      employerName,
      workplaceLocation,
      urgency = 'MEDIUM',
    } = body;

    if (!workerName || !workerPhone || !category || !title || !description) {
      return NextResponse.json(
        { error: 'Fields workerName, workerPhone, category, title, and description are required.' },
        { status: 400 }
      );
    }

    // Find or create worker profile
    let worker = await prisma.worker.findUnique({
      where: { phone: workerPhone },
    });

    if (!worker) {
      worker = await prisma.worker.create({
        data: {
          name: workerName,
          phone: workerPhone,
          state: workplaceLocation || 'Not Specified',
        },
      });
    }

    const grievance = await prisma.grievance.create({
      data: {
        workerId: worker.id,
        workerName,
        workerPhone,
        category,
        title,
        description,
        employerName: employerName || null,
        workplaceLocation: workplaceLocation || null,
        urgency,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, grievance }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to file grievance' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, resolutionNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Grievance id is required' }, { status: 400 });
    }

    const updated = await prisma.grievance.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(resolutionNotes !== undefined ? { resolutionNotes } : {}),
      },
    });

    return NextResponse.json({ success: true, grievance: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update grievance' },
      { status: 500 }
    );
  }
}


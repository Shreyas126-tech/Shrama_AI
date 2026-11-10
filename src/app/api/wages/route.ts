import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workerPhone = searchParams.get('phone');

    const where: any = {};
    if (workerPhone) {
      where.worker = { phone: workerPhone };
    }

    const wageEntries = await prisma.wageEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        worker: {
          select: {
            name: true,
            phone: true,
            occupation: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, count: wageEntries.length, wageEntries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch wage entries' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      workerName = 'श्रमिक साथी (Worker)',
      workerPhone = '9876543210',
      workHours = 8.0,
      standardRate = 600.0,
      overtimeHours = 0.0,
      applyEPF = false,
      applyESIC = false,
      notes = '',
    } = body;

    const rate = Number(standardRate) || 0;
    const hours = Number(workHours) || 8.0;
    const otHours = Math.max(0, Number(overtimeHours) || 0);

    // Statutory Calculation Grounded in Section 14 of Indian Code on Wages 2019:
    // Base hourly rate = Daily rate / 8
    const hourlyBaseRate = rate > 0 ? rate / 8.0 : 0;
    // Overtime must be at least 200% (double the normal rate)
    const otHourlyRate = hourlyBaseRate * 2.0;
    const otPay = otHours * otHourlyRate;
    const gross = rate + otPay;

    // Optional deductions (EPF: 12%, ESIC: 0.75%)
    const epf = applyEPF ? gross * 0.12 : 0.0;
    const esic = applyESIC ? gross * 0.0075 : 0.0;
    const net = gross - (epf + esic);

    // Find or create worker
    let worker = await prisma.worker.findUnique({
      where: { phone: workerPhone },
    });

    if (!worker) {
      worker = await prisma.worker.create({
        data: {
          name: workerName,
          phone: workerPhone,
          dailyWage: rate,
        },
      });
    }

    const entry = await prisma.wageEntry.create({
      data: {
        workerId: worker.id,
        workHours: hours,
        standardRate: rate,
        overtimeHours: otHours,
        overtimeRate: otHourlyRate,
        grossWage: parseFloat(gross.toFixed(2)),
        epfDeduction: parseFloat(epf.toFixed(2)),
        esicDeduction: parseFloat(esic.toFixed(2)),
        netWage: parseFloat(net.toFixed(2)),
        paymentStatus: 'PENDING',
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      entry,
      breakdown: {
        standardWage: rate,
        hourlyBaseRate: parseFloat(hourlyBaseRate.toFixed(2)),
        overtimeHours: otHours,
        overtimeRate: parseFloat(otHourlyRate.toFixed(2)),
        overtimeEarnings: parseFloat(otPay.toFixed(2)),
        grossTotal: parseFloat(gross.toFixed(2)),
        epfDeduction: parseFloat(epf.toFixed(2)),
        esicDeduction: parseFloat(esic.toFixed(2)),
        netPayable: parseFloat(net.toFixed(2)),
        legalNote: 'धारा 14, मजदूरी संहिता 2019: 8 घंटे से अधिक कार्य पर साधारण दर से दोगुना (2x) ओवरटाइम देय है।',
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to calculate and store wage record' },
      { status: 500 }
    );
  }
}


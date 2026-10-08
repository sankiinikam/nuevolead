import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/calendar - Fetch scheduled follow-up events and leads for interactive calendar
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignedToId = searchParams.get('assignedToId');

    const leadWhere: any = {
      nextFollowUpDate: { not: null },
    };

    if (assignedToId && assignedToId !== 'all') {
      leadWhere.assignedToId = assignedToId;
    }

    // Fetch leads with scheduled nextFollowUpDate
    const scheduledLeads = await prisma.lead.findMany({
      where: leadWhere,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        contacts: true,
        followUps: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { nextFollowUpDate: 'asc' },
    });

    // Also fetch all logged follow-ups for historical calendar plotting
    const loggedFollowUps = await prisma.followUp.findMany({
      include: {
        lead: {
          select: {
            id: true,
            leadNumber: true,
            customerName: true,
            status: true,
            dealValue: true,
            assignedTo: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { followUpDate: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      scheduled: scheduledLeads,
      logged: loggedFollowUps,
    });
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch calendar data' }, { status: 500 });
  }
}

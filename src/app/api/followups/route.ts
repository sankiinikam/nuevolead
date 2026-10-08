import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/followups - Log a new follow-up and update lead status / next follow-up
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const followUp = await prisma.followUp.create({
      data: {
        leadId: body.leadId,
        followUpDate: new Date(body.followUpDate || Date.now()),
        followUpTime: body.followUpTime || '14:30',
        followUpType: body.followUpType || 'Call Follow up',
        leadStatus: body.leadStatus || 'Hot',
        contactPerson: body.contactPerson,
        discussionSummary: body.discussionSummary,
        nextFollowUpDate: body.nextFollowUpDate ? new Date(body.nextFollowUpDate) : null,
        nextAction: body.nextAction,
        smsAlert: body.smsAlert || false,
      },
    });

    // Also update parent lead's next follow-up and status
    await prisma.lead.update({
      where: { id: body.leadId },
      data: {
        status: body.leadStatus,
        nextFollowUpDate: body.nextFollowUpDate ? new Date(body.nextFollowUpDate) : undefined,
      },
    });

    return NextResponse.json(followUp, { status: 201 });
  } catch (error: any) {
    console.error('Error logging follow-up:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


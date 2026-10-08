import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/leads/[id] - Fetch single lead details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        contacts: true,
        addresses: true,
        products: true,
        followUps: { orderBy: { createdAt: 'desc' } },
        tasks: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/leads/[id] - Update an existing lead
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const isWon = body.status === 'Close-Won';
    const products = body.products || [];
    const productTotal = products.reduce(
      (acc: number, p: any) => acc + (Number(p.offeredPrice || 0) * Number(p.unitQuantity || 0)),
      0
    );
    const orderValue = isWon ? productTotal : (Number(body.orderValue) || 0);

    // Delete and recreate line items / relations if supplied
    if (body.products) {
      await prisma.leadProduct.deleteMany({ where: { leadId: params.id } });
    }

    const updated = await prisma.lead.update({
      where: { id: params.id },
      data: {
        customerName: body.customerName,
        visitDate: body.visitDate ? new Date(body.visitDate) : undefined,
        visitType: body.visitType,
        industry: body.industry,
        source: body.source,
        status: body.status,
        dealValue: Number(body.dealValue) || 0,
        probability: Number(body.probability) || 5,
        discussionSummary: body.discussionSummary,
        requirements: body.requirements,
        nextStep: body.nextStep,
        nextFollowUpDate: body.nextFollowUpDate ? new Date(body.nextFollowUpDate) : null,
        expectedClosingDate: body.expectedClosingDate ? new Date(body.expectedClosingDate) : null,
        orderValue,
        managerRemarks: body.managerRemarks,
        contactName: body.contactName,
        designation: body.designation,
        mobile: body.mobile,
        email: body.email,
        city: body.city,
        state: body.state,
        products: body.products ? {
          create: products.map((p: any) => ({
            productName: p.productName,
            category: p.category,
            subCategory: p.subCategory,
            mrp: Number(p.mrp) || 0,
            offeredPrice: Number(p.offeredPrice) || 0,
            unitQuantity: Number(p.unitQuantity) || 1,
            totalAmount: Number(p.offeredPrice || 0) * Number(p.unitQuantity || 1),
          }))
        } : undefined,
      },
      include: {
        contacts: true,
        addresses: true,
        products: true,
        followUps: { orderBy: { createdAt: 'desc' } },
        tasks: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/leads/[id] - Delete a lead
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lead.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

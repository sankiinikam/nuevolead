import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/leads - Fetch all leads with relations and search/filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { leadNumber: { contains: search } },
        { city: { contains: search } },
        { contactName: { contains: search } },
        { enteredBy: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        contacts: true,
        addresses: true,
        products: true,
        followUps: { orderBy: { createdAt: 'desc' } },
        tasks: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Calculate product total
    const products = body.products || [];
    const productTotal = products.reduce(
      (acc: number, p: any) => acc + (Number(p.offeredPrice || 0) * Number(p.unitQuantity || 0)),
      0
    );

    // Close-Won rule from manual: locks order value to product total
    const isWon = body.status === 'Close-Won';
    const orderValue = isWon ? productTotal : (Number(body.orderValue) || 0);
    const expectedClosingDate = isWon && !body.expectedClosingDate
      ? new Date()
      : body.expectedClosingDate ? new Date(body.expectedClosingDate) : null;

    const newLead = await prisma.lead.create({
      data: {
        leadNumber: body.leadNumber || `LD-${Math.floor(100 + Math.random() * 900)}`,
        customerName: body.customerName,
        visitDate: body.visitDate ? new Date(body.visitDate) : new Date(),
        visitType: body.visitType || 'New Prospect',
        industry: body.industry,
        source: body.source,
        status: body.status || 'Hot',
        dealValue: Number(body.dealValue) || 0,
        probability: Number(body.probability) || 7,
        discussionSummary: body.discussionSummary,
        requirements: body.requirements,
        nextStep: body.nextStep,
        nextFollowUpDate: body.nextFollowUpDate ? new Date(body.nextFollowUpDate) : null,
        expectedClosingDate,
        orderValue,
        managerRemarks: body.managerRemarks,
        enteredBy: body.enteredBy || 'Sales Executive',
        contactName: body.contactName,
        designation: body.designation,
        mobile: body.mobile,
        email: body.email,
        city: body.city,
        state: body.state,
        contacts: {
          create: (body.contacts || []).map((c: any) => ({
            title: c.title,
            name: c.name,
            designation: c.designation,
            department: c.department,
            mobile: c.mobile,
            email: c.email,
            linkedin: c.linkedin,
          })),
        },
        addresses: {
          create: (body.addresses || []).map((a: any) => ({
            type: a.type || 'Primary',
            address1: a.address1 || '',
            address2: a.address2 || '',
            city: a.city || '',
            state: a.state || '',
            pin: a.pin || '',
            country: a.country || 'India',
          })),
        },
        products: {
          create: products.map((p: any) => ({
            productName: p.productName,
            category: p.category,
            subCategory: p.subCategory,
            mrp: Number(p.mrp) || 0,
            offeredPrice: Number(p.offeredPrice) || 0,
            unitQuantity: Number(p.unitQuantity) || 1,
            totalAmount: Number(p.offeredPrice || 0) * Number(p.unitQuantity || 1),
          })),
        },
        tasks: {
          create: (body.tasks || []).map((t: any) => ({
            title: typeof t === 'string' ? t : t.title,
            isCompleted: t.isCompleted || false,
          })),
        },
      },
      include: {
        contacts: true,
        addresses: true,
        products: true,
        followUps: true,
        tasks: true,
      },
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: error.message || 'Failed to create lead' }, { status: 500 });
  }
}

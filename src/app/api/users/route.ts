import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users - Fetch all sales employees with hierarchy and sales metrics
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        reportingTo: {
          select: { id: true, name: true, role: true, designation: true },
        },
        subordinates: {
          select: { id: true, name: true, role: true, designation: true },
        },
        assignedLeads: {
          select: {
            id: true,
            status: true,
            dealValue: true,
            orderValue: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Compute sales performance metrics for each employee
    const usersWithStats = users.map((u) => {
      const leads = u.assignedLeads || [];
      const totalLeads = leads.length;
      const hotLeads = leads.filter((l) => l.status === 'Hot').length;
      const wonLeads = leads.filter((l) => l.status === 'Close-Won');
      const wonRevenue = wonLeads.reduce(
        (sum, l) => sum + (Number(l.orderValue) || Number(l.dealValue) || 0),
        0
      );
      const pipelineValue = leads
        .filter((l) => !['Close-Won', 'Close-Lost'].includes(l.status))
        .reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);

      const { assignedLeads, ...userFields } = u;

      return {
        ...userFields,
        stats: {
          totalLeads,
          hotLeads,
          pipelineValue,
          wonRevenue,
        },
      };
    });

    return NextResponse.json(usersWithStats);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create new sales employee
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password = 'password123',
      role = 'SALES_EXECUTIVE',
      designation = 'Sales Executive',
      department = 'Field Sales',
      phone,
      targetRevenue = 1000000,
      reportingToId,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } }
    });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: password || 'password123',
        role,
        designation,
        department,
        phone,
        targetRevenue: Number(targetRevenue) || 1000000,
        reportingToId: reportingToId || null,
      },
      include: {
        reportingTo: {
          select: { id: true, name: true, role: true, designation: true },
        },
      },
    });

    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/users/[id] - Update user details or role
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.role && { role: body.role }),
        ...(body.designation !== undefined && { designation: body.designation }),
        ...(body.department !== undefined && { department: body.department }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.targetRevenue !== undefined && { targetRevenue: Number(body.targetRevenue) }),
        ...(body.reportingToId !== undefined && { reportingToId: body.reportingToId || null }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
      include: {
        reportingTo: {
          select: { id: true, name: true, role: true, designation: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Remove employee
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Unassign leads first
    await prisma.lead.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null },
    });

    // Unassign subordinates
    await prisma.user.updateMany({
      where: { reportingToId: id },
      data: { reportingToId: null },
    });

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'User removed successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}


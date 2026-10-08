import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/export - Generate dynamic CSV from selected fields
export async function POST(request: Request) {
  try {
    const { fields = ['leadNumber', 'customerName', 'status', 'dealValue'], status } = await request.json();

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: { contacts: true, addresses: true, products: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = fields.join(',');
    const rows = leads.map((l) => {
      return fields
        .map((f: string) => {
          switch (f) {
            case 'leadNumber':
            case 'Lead_No':
              return `"${l.leadNumber || ''}"`;

            case 'customerName':
            case 'Customer_Name':
              return `"${(l.customerName || '').replace(/"/g, '""')}"`;

            case 'enteredBy':
            case 'Entered_By':
              return `"${(l.enteredBy || '').replace(/"/g, '""')}"`;

            case 'visitDate':
            case 'Visit_Date':
              return `"${l.visitDate ? l.visitDate.toISOString().slice(0, 10) : ''}"`;

            case 'visitType':
            case 'Visit_Type':
              return `"${l.visitType || ''}"`;

            case 'industry':
            case 'Industry':
              return `"${(l.industry || '').replace(/"/g, '""')}"`;

            case 'source':
            case 'Source':
              return `"${(l.source || '').replace(/"/g, '""')}"`;

            case 'status':
            case 'Status':
              return `"${l.status || ''}"`;

            case 'dealValue':
            case 'Anticipated_Value':
              return l.dealValue || 0;

            case 'probability':
            case 'Probability':
              return l.probability || 0;

            case 'orderValue':
            case 'Order_Value':
              return l.orderValue || 0;

            case 'contactName':
            case 'Contact_Person':
              return `"${(l.contactName || l.contacts?.[0]?.name || '').replace(/"/g, '""')}"`;

            case 'designation':
            case 'Designation':
              return `"${(l.designation || l.contacts?.[0]?.designation || '').replace(/"/g, '""')}"`;

            case 'mobile':
            case 'Phone':
              return `"${l.mobile || l.contacts?.[0]?.mobile || ''}"`;

            case 'email':
            case 'Email':
              return `"${l.email || l.contacts?.[0]?.email || ''}"`;

            case 'city':
            case 'City':
              return `"${(l.city || l.addresses?.[0]?.city || '').replace(/"/g, '""')}"`;

            case 'state':
            case 'State':
              return `"${(l.state || l.addresses?.[0]?.state || '').replace(/"/g, '""')}"`;

            case 'products':
              const productSummary = l.products.map(p => `${p.productName} (Qty: ${p.unitQuantity})`).join('; ');
              return `"${productSummary.replace(/"/g, '""')}"`;

            case 'requirements':
            case 'Requirements':
              return `"${(l.requirements || '').replace(/"/g, '""')}"`;

            case 'discussionSummary':
            case 'Discussion':
              return `"${(l.discussionSummary || '').replace(/"/g, '""')}"`;

            case 'managerRemarks':
            case 'Remarks':
              return `"${(l.managerRemarks || '').replace(/"/g, '""')}"`;

            case 'nextFollowUpDate':
              return `"${l.nextFollowUpDate ? l.nextFollowUpDate.toISOString().slice(0, 10) : ''}"`;

            default:
              return '""';
          }
        })
        .join(',');
    });

    const csv = [headers, ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=ApexPulse_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

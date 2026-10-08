import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ApexPulse CRM database...');

  // Clean old
  await prisma.followUp.deleteMany({});
  await prisma.leadProduct.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.lead.deleteMany({});

  // 1. Lead 1 (Hot) - SRM Industries
  const l1 = await prisma.lead.create({
    data: {
      leadNumber: 'LD-101',
      customerName: 'SRM Industries Pvt Ltd',
      visitDate: new Date('2026-06-14'),
      visitType: 'New Prospect',
      industry: 'Retail',
      source: 'Telecalling',
      status: 'Hot',
      dealValue: 500000,
      probability: 8,
      discussionSummary: 'Discussion held with Managing Director to evaluate high-volume supply requirements. Company profile submitted.',
      requirements: 'Requires high-tensile fasteners and precision engineering mounting components.',
      nextStep: 'Final negotiation meeting scheduled for 17th June.',
      nextFollowUpDate: new Date('2026-06-17'),
      expectedClosingDate: new Date('2026-06-30'),
      orderValue: 0,
      managerRemarks: 'Strong enterprise account. Approved for volume discount tier.',
      enteredBy: 'Rohan Varma',
      contactName: 'Mr. Rajnish Verma',
      designation: 'CEO',
      mobile: '+91 9168746688',
      email: 'rajnish@srmindustries.example',
      city: 'Pune',
      state: 'Maharashtra',
      contacts: {
        create: [
          {
            title: 'Mr.',
            name: 'Rajnish Verma',
            designation: 'Chief Executive Officer',
            department: 'Corporate',
            mobile: '+91 9168746688',
            email: 'rajnish@srmindustries.example',
          },
          {
            title: 'Ms.',
            name: 'Pooja Kulkarni',
            designation: 'Procurement Manager',
            department: 'Supply Chain',
            mobile: '+91 9168746690',
            email: 'pooja.k@srmindustries.example',
          }
        ]
      },
      addresses: {
        create: [
          {
            type: 'Primary',
            address1: 'Plot 42, MIDC Industrial Area',
            address2: 'Bhosari',
            city: 'Pune',
            state: 'Maharashtra',
            pin: '411026',
            country: 'India'
          }
        ]
      },
      products: {
        create: [
          {
            productName: 'Heavy-Duty Flange Bushing M16',
            category: 'Fasteners',
            subCategory: 'Flanges',
            mrp: 300,
            offeredPrice: 250,
            unitQuantity: 2000,
            totalAmount: 500000
          }
        ]
      },
      followUps: {
        create: [
          {
            followUpDate: new Date('2026-06-14'),
            followUpTime: '13:45',
            followUpType: 'Call Follow up',
            leadStatus: 'Hot',
            contactPerson: 'Rajnish Verma',
            discussionSummary: 'Reviewed technical drawing tolerances. Client requested sample inspection report.',
            nextFollowUpDate: new Date('2026-06-17'),
            nextAction: 'Deliver CMM inspection report and commercial proposal.',
            smsAlert: true
          }
        ]
      },
      tasks: {
        create: [
          { title: 'Submit audited company profile', isCompleted: true },
          { title: 'Send First Article sample pieces', isCompleted: false }
        ]
      }
    }
  });

  // 2. Lead 2 (Warm) - Vaishali Industries
  const l2 = await prisma.lead.create({
    data: {
      leadNumber: 'LD-102',
      customerName: 'Vaishali Engineering Works',
      visitDate: new Date('2026-05-18'),
      visitType: 'Follow-Up',
      industry: 'Manufacturing',
      source: 'Website',
      status: 'Warm',
      dealValue: 740000,
      probability: 7,
      discussionSummary: 'Client reviewed online product catalog. Requested quotation for 1,000 units of precision shafts.',
      requirements: 'CNC turned shafts conforming to EN8D specification.',
      nextStep: 'Commercial proposal under internal review.',
      nextFollowUpDate: new Date('2026-06-19'),
      expectedClosingDate: new Date('2026-07-15'),
      orderValue: 0,
      managerRemarks: 'Ensure raw material lead time is accounted for in quote.',
      enteredBy: 'Anjali Sahu',
      contactName: 'Miss Misha Jadhav',
      designation: 'Managing Director',
      mobile: '+91 9878032456',
      email: 'misha@vaishali.example',
      city: 'Mumbai',
      state: 'Maharashtra',
      contacts: {
        create: [
          {
            title: 'Miss',
            name: 'Misha Jadhav',
            designation: 'Managing Director',
            department: 'Executive',
            mobile: '+91 9878032456',
            email: 'misha@vaishali.example',
          }
        ]
      },
      products: {
        create: [
          {
            productName: 'CNC Ground Pinion Shaft',
            category: 'Transmission',
            subCategory: 'Shafts',
            mrp: 850,
            offeredPrice: 740,
            unitQuantity: 1000,
            totalAmount: 740000
          }
        ]
      }
    }
  });

  // 3. Lead 3 (Close-Won) - Electronics Enterprises
  const l3 = await prisma.lead.create({
    data: {
      leadNumber: 'LD-103',
      customerName: 'Electronics Enterprises Ltd',
      visitDate: new Date('2026-05-20'),
      visitType: 'Repeat Order',
      industry: 'Distributor',
      source: 'Advertising',
      status: 'Close-Won',
      dealValue: 485000,
      orderValue: 485000, // Locked on Close-Won as per manual
      probability: 10,
      discussionSummary: 'Commercial terms accepted. Client issued confirmed Purchase Order #PO-2026-8819.',
      requirements: 'Deliver 1,000 units within 30 days under Net-30 credit terms.',
      nextStep: 'Production order released to assembly cell.',
      nextFollowUpDate: new Date('2026-06-25'),
      expectedClosingDate: new Date('2026-05-20'),
      managerRemarks: 'Order confirmed and verified against customer PO.',
      enteredBy: 'Nitin Roy',
      contactName: 'Mr. Amit Joshi',
      designation: 'Procurement Head',
      mobile: '+91 9822011223',
      email: 'amit@electronics.example',
      city: 'Nagpur',
      state: 'Maharashtra',
      products: {
        create: [
          {
            productName: 'Automated Control Assembly Kit',
            category: 'Control Systems',
            subCategory: 'Assemblies',
            mrp: 550,
            offeredPrice: 485,
            unitQuantity: 1000,
            totalAmount: 485000
          }
        ]
      }
    }
  });

  console.log('Seeding complete! 3 sample leads created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

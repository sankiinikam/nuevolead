import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nuevo Lead CRM database with hierarchy and follow-ups...');

  // Clean old
  await prisma.followUp.deleteMany({});
  await prisma.leadProduct.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Seed Hierarchy Users
  const admin = await prisma.user.create({
    data: {
      name: 'Rajesh Singhania',
      email: 'admin@nuevolead.com',
      password: 'password123',
      role: 'ADMIN',
      designation: 'Managing Director & Global Sales Head',
      department: 'Executive Leadership',
      phone: '+91 9820011000',
      targetRevenue: 50000000,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Vikram Malhotra',
      email: 'manager@nuevolead.com',
      password: 'password123',
      role: 'MANAGER',
      designation: 'Regional Sales Director (West India)',
      department: 'Enterprise Sales',
      phone: '+91 9820022000',
      targetRevenue: 25000000,
      reportingToId: admin.id,
    },
  });

  const rep1 = await prisma.user.create({
    data: {
      name: 'Sanket Deshmukh',
      email: 'sanket@nuevolead.com',
      password: 'password123',
      role: 'SALES_EXECUTIVE',
      designation: 'Sr. Corporate Account Executive',
      department: 'Field Sales',
      phone: '+91 9820033000',
      targetRevenue: 10000000,
      reportingToId: manager.id,
    },
  });

  const rep2 = await prisma.user.create({
    data: {
      name: 'Rohan Varma',
      email: 'rohan@nuevolead.com',
      password: 'password123',
      role: 'SALES_EXECUTIVE',
      designation: 'Field Sales Executive',
      department: 'Field Sales',
      phone: '+91 9820044000',
      targetRevenue: 7500000,
      reportingToId: manager.id,
    },
  });

  const rep3 = await prisma.user.create({
    data: {
      name: 'Anjali Sahu',
      email: 'anjali@nuevolead.com',
      password: 'password123',
      role: 'SALES_EXECUTIVE',
      designation: 'Inbound Sales Specialist',
      department: 'Inside Sales',
      phone: '+91 9820055000',
      targetRevenue: 6000000,
      reportingToId: manager.id,
    },
  });

  // Dates for active calendar follow-ups
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const in3Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
  const in5Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const in10Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10);

  // 2. Lead 1 (Hot) - SRM Industries (Assigned to Sanket)
  const l1 = await prisma.lead.create({
    data: {
      leadNumber: 'LD-101',
      customerName: 'SRM Industries Pvt Ltd',
      visitDate: new Date('2026-06-14'),
      visitType: 'Direct Visit',
      industry: 'Automotive & Engineering',
      source: 'Direct Visit',
      status: 'Hot',
      dealValue: 500000,
      probability: 85,
      discussionSummary: 'Discussion held with Managing Director to evaluate high-volume supply requirements. Company profile submitted.',
      requirements: 'Requires high-tensile fasteners and precision engineering mounting components.',
      nextStep: 'Final negotiation meeting scheduled to close contract.',
      nextFollowUpDate: today,
      expectedClosingDate: in5Days,
      orderValue: 0,
      managerRemarks: 'Approved for 5% special corporate discount tier. Ensure technical warranty document is attached.',
      enteredBy: rep1.name,
      assignedToId: rep1.id,
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
          },
        ],
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
            country: 'India',
          },
        ],
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
            totalAmount: 500000,
          },
        ],
      },
      followUps: {
        create: [
          {
            followUpDate: yesterday,
            followUpTime: '11:00',
            followUpType: 'Direct Visit',
            leadStatus: 'Hot',
            contactPerson: 'Rajnish Verma',
            discussionSummary: 'Visited plant facility in Bhosari. Finalized technical tolerances and inspected batch sample.',
            nextFollowUpDate: today,
            nextAction: 'Final commercial negotiation and contract sign-off.',
            smsAlert: true,
          },
        ],
      },
      tasks: {
        create: [
          { title: 'Submit audited company profile', isCompleted: true },
          { title: 'Send First Article sample pieces', isCompleted: false, dueDate: in3Days },
        ],
      },
    },
  });

  // 3. Lead 2 (Warm) - Vaishali Engineering (Assigned to Anjali)
  const l2 = await prisma.lead.create({
    data: {
      leadNumber: 'LD-102',
      customerName: 'Vaishali Engineering Works',
      visitDate: new Date('2026-05-18'),
      visitType: 'Virtual Meeting / Demo',
      industry: 'Manufacturing',
      source: 'Website / Inbound',
      status: 'Warm',
      dealValue: 740000,
      probability: 65,
      discussionSummary: 'Client reviewed online product catalog. Requested quotation for 1,000 units of precision shafts.',
      requirements: 'CNC turned shafts conforming to EN8D specification.',
      nextStep: 'Commercial proposal under internal review by client board.',
      nextFollowUpDate: tomorrow,
      expectedClosingDate: in10Days,
      orderValue: 0,
      managerRemarks: 'Ensure raw material lead time is accounted for in quote.',
      enteredBy: rep3.name,
      assignedToId: rep3.id,
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
          },
        ],
      },
      addresses: {
        create: [
          {
            type: 'Primary',
            address1: 'Unit 12, Wagle Industrial Estate',
            city: 'Thane',
            state: 'Maharashtra',
            pin: '400604',
            country: 'India',
          },
        ],
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
            totalAmount: 740000,
          },
        ],
      },
      followUps: {
        create: [
          {
            followUpDate: yesterday,
            followUpTime: '15:30',
            followUpType: 'Virtual Meeting / Demo',
            leadStatus: 'Warm',
            contactPerson: 'Misha Jadhav',
            discussionSummary: 'Walked through 3D CAD models over video conference. Client agreed on technical specs.',
            nextFollowUpDate: tomorrow,
            nextAction: 'Follow up on board budget sanction.',
            smsAlert: true,
          },
        ],
      },
    },
  });

  // 4. Lead 3 (Close-Won) - Electronics Enterprises (Assigned to Rohan)
  const l3 = await prisma.lead.create({
    data: {
      leadNumber: 'LD-103',
      customerName: 'Electronics Enterprises Ltd',
      visitDate: new Date('2026-04-10'),
      visitType: 'Cold Call',
      industry: 'Electronics & Semiconductors',
      source: 'Cold Call',
      status: 'Close-Won',
      dealValue: 485000,
      probability: 100,
      discussionSummary: 'Customer confirmed purchase order following successful sample trials.',
      requirements: 'Supply of 1,000 automated control assembly kits.',
      nextStep: 'Dispatch shipment as per PO release schedule.',
      nextFollowUpDate: in10Days,
      expectedClosingDate: new Date('2026-05-02'),
      orderValue: 485000, // Locked rule
      managerRemarks: 'Order confirmed and verified against customer PO.',
      enteredBy: rep2.name,
      assignedToId: rep2.id,
      contactName: 'Mr. Amit Joshi',
      designation: 'Procurement Head',
      mobile: '+91 9822011223',
      email: 'amit@electronics.example',
      city: 'Nagpur',
      state: 'Maharashtra',
      contacts: {
        create: [
          {
            title: 'Mr.',
            name: 'Amit Joshi',
            designation: 'Procurement Head',
            department: 'Procurement',
            mobile: '+91 9822011223',
            email: 'amit@electronics.example',
          },
        ],
      },
      products: {
        create: [
          {
            productName: 'Automated Control Assembly Kit',
            category: 'Control Systems',
            subCategory: 'Assemblies',
            mrp: 550,
            offeredPrice: 485,
            unitQuantity: 1000,
            totalAmount: 485000,
          },
        ],
      },
    },
  });

  // 5. Lead 4 (Future-Prospect) - Kalyani Solar Technologies (Assigned to Sanket)
  const l4 = await prisma.lead.create({
    data: {
      leadNumber: 'LD-104',
      customerName: 'Kalyani Solar Technologies Ltd',
      visitDate: new Date('2026-09-20'),
      visitType: 'Exhibition & Trade Fair',
      industry: 'Energy & Renewable',
      source: 'Exhibition & Trade Fair',
      status: 'Future-Prospect',
      dealValue: 1250000,
      probability: 40,
      discussionSummary: 'Met VP at Renewable Energy Expo. Expansion project scheduled for Q4.',
      requirements: 'Galvanized mounting structures for 5MW utility plant.',
      nextStep: 'Present customized proposal for Phase 2 bidding.',
      nextFollowUpDate: in3Days,
      expectedClosingDate: new Date('2026-12-15'),
      orderValue: 0,
      managerRemarks: 'Keep warm with bi-weekly case studies and technology updates.',
      enteredBy: rep1.name,
      assignedToId: rep1.id,
      contactName: 'Dr. Ramesh Kalyani',
      designation: 'VP Projects',
      mobile: '+91 9822119988',
      email: 'r.kalyani@kalyanisolar.example',
      city: 'Ahmedabad',
      state: 'Gujarat',
      products: {
        create: [
          {
            productName: 'Heavy Galvanized Module Structure 350W',
            category: 'Structural Fabrication',
            mrp: 1400,
            offeredPrice: 1250,
            unitQuantity: 1000,
            totalAmount: 1250000,
          },
        ],
      },
      followUps: {
        create: [
          {
            followUpDate: yesterday,
            followUpTime: '14:00',
            followUpType: 'Phone Call',
            leadStatus: 'Future-Prospect',
            contactPerson: 'Dr. Ramesh Kalyani',
            discussionSummary: 'Detailed phone review of technical specs. Client requested revised structural load calculations.',
            nextFollowUpDate: in3Days,
            nextAction: 'Submit revised structural engineering drawings.',
            smsAlert: true,
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
  console.log(`Users seeded: Admin (Rajesh), Manager (Vikram), Reps (Sanket, Rohan, Anjali)`);
  console.log(`Leads seeded: ${l1.customerName}, ${l2.customerName}, ${l3.customerName}, ${l4.customerName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

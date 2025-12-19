import { PrismaClient, Role, OpportunityStage, ProjectStatus, TaskStatus, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@nukleo.com" },
    update: {},
    create: {
      email: "admin@nukleo.com",
      name: "Admin User",
      role: Role.ADMIN,
    },
  });

  console.log("✅ Created admin user:", adminUser.email);

  // Create a manager user
  const managerUser = await prisma.user.upsert({
    where: { email: "manager@nukleo.com" },
    update: {},
    create: {
      email: "manager@nukleo.com",
      name: "Manager User",
      role: Role.MANAGER,
    },
  });

  console.log("✅ Created manager user:", managerUser.email);

  // Create a regular user
  const regularUser = await prisma.user.upsert({
    where: { email: "user@nukleo.com" },
    update: {},
    create: {
      email: "user@nukleo.com",
      name: "Regular User",
      role: Role.USER,
    },
  });

  console.log("✅ Created regular user:", regularUser.email);

  // Create sample companies
  const company1 = await prisma.company.upsert({
    where: { id: "company-1" },
    update: {},
    create: {
      id: "company-1",
      name: "Acme Corporation",
      industry: "Technology",
      website: "https://acme.com",
      phone: "+33 1 23 45 67 89",
      address: "123 Tech Street",
      city: "Paris",
      country: "France",
      ownerId: adminUser.id,
    },
  });

  const company2 = await prisma.company.upsert({
    where: { id: "company-2" },
    update: {},
    create: {
      id: "company-2",
      name: "Global Solutions Inc",
      industry: "Consulting",
      website: "https://globalsolutions.com",
      phone: "+33 1 98 76 54 32",
      address: "456 Business Avenue",
      city: "Lyon",
      country: "France",
      ownerId: managerUser.id,
    },
  });

  console.log("✅ Created companies:", company1.name, company2.name);

  // Create sample contacts
  const contact1 = await prisma.contact.upsert({
    where: { id: "contact-1" },
    update: {},
    create: {
      id: "contact-1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@acme.com",
      phone: "+33 6 12 34 56 78",
      position: "CEO",
      companyId: company1.id,
      ownerId: adminUser.id,
    },
  });

  const contact2 = await prisma.contact.upsert({
    where: { id: "contact-2" },
    update: {},
    create: {
      id: "contact-2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@globalsolutions.com",
      phone: "+33 6 87 65 43 21",
      position: "CTO",
      companyId: company2.id,
      ownerId: managerUser.id,
    },
  });

  console.log("✅ Created contacts:", `${contact1.firstName} ${contact1.lastName}`, `${contact2.firstName} ${contact2.lastName}`);

  // Create sample opportunities
  const opportunity1 = await prisma.opportunity.upsert({
    where: { id: "opp-1" },
    update: {},
    create: {
      id: "opp-1",
      title: "New Enterprise Contract",
      description: "Large enterprise contract for software implementation",
      value: 500000,
      stage: OpportunityStage.QUALIFIED,
      probability: 75,
      expectedCloseDate: new Date("2025-03-31"),
      companyId: company1.id,
      contactId: contact1.id,
      ownerId: adminUser.id,
    },
  });

  const opportunity2 = await prisma.opportunity.upsert({
    where: { id: "opp-2" },
    update: {},
    create: {
      id: "opp-2",
      title: "Consulting Project",
      description: "Strategic consulting project",
      value: 150000,
      stage: OpportunityStage.PROPOSAL,
      probability: 50,
      expectedCloseDate: new Date("2025-02-28"),
      companyId: company2.id,
      contactId: contact2.id,
      ownerId: managerUser.id,
    },
  });

  const opportunity3 = await prisma.opportunity.upsert({
    where: { id: "opp-3" },
    update: {},
    create: {
      id: "opp-3",
      title: "Won Deal",
      description: "Successfully closed deal",
      value: 250000,
      stage: OpportunityStage.WON,
      probability: 100,
      expectedCloseDate: new Date("2024-12-15"),
      actualCloseDate: new Date("2024-12-15"),
      companyId: company1.id,
      contactId: contact1.id,
      ownerId: adminUser.id,
    },
  });

  console.log("✅ Created opportunities:", opportunity1.title, opportunity2.title, opportunity3.title);

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: "project-1" },
    update: {},
    create: {
      id: "project-1",
      name: "Website Redesign",
      description: "Complete redesign of company website",
      status: ProjectStatus.IN_PROGRESS,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-06-30"),
      budget: 100000,
      companyId: company1.id,
      managerId: managerUser.id,
    },
  });

  console.log("✅ Created project:", project1.name);

  // Create sample tasks
  const task1 = await prisma.task.upsert({
    where: { id: "task-1" },
    update: {},
    create: {
      id: "task-1",
      title: "Design mockups",
      description: "Create initial design mockups for the website",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date("2025-02-15"),
      projectId: project1.id,
      assigneeId: regularUser.id,
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: "task-2" },
    update: {},
    create: {
      id: "task-2",
      title: "Frontend development",
      description: "Implement frontend components",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date("2025-03-31"),
      projectId: project1.id,
      assigneeId: regularUser.id,
    },
  });

  console.log("✅ Created tasks:", task1.title, task2.title);

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from "../src/index";

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@nukleo.com" },
    update: {},
    create: {
      email: "admin@nukleo.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create manager user
  const manager = await prisma.user.upsert({
    where: { email: "manager@nukleo.com" },
    update: {},
    create: {
      email: "manager@nukleo.com",
      name: "Manager User",
      role: "MANAGER",
    },
  });

  console.log("✅ Created manager user:", manager.email);

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: "user@nukleo.com" },
    update: {},
    create: {
      email: "user@nukleo.com",
      name: "Regular User",
      role: "USER",
    },
  });

  console.log("✅ Created regular user:", user.email);

  // Create company
  const company = await prisma.company.create({
    data: {
      name: "Acme Corporation",
      industry: "Technology",
      website: "https://acme.com",
      phone: "+1-555-0100",
      address: "123 Tech Street",
      city: "San Francisco",
      country: "USA",
      ownerId: manager.id,
    },
  });

  console.log("✅ Created company:", company.name);

  // Create contact
  const contact = await prisma.contact.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@acme.com",
      phone: "+1-555-0101",
      position: "CEO",
      companyId: company.id,
      ownerId: manager.id,
    },
  });

  console.log("✅ Created contact:", `${contact.firstName} ${contact.lastName}`);

  // Create opportunity
  const opportunity = await prisma.opportunity.create({
    data: {
      title: "Enterprise License Deal",
      description: "Large enterprise customer interested in annual license",
      value: 50000.0,
      stage: "QUALIFIED",
      probability: 60,
      expectedCloseDate: new Date("2024-12-31"),
      companyId: company.id,
      contactId: contact.id,
      ownerId: manager.id,
    },
  });

  console.log("✅ Created opportunity:", opportunity.title);

  // Create project
  const project = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Complete redesign of company website",
      status: "IN_PROGRESS",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-30"),
      budget: 25000.0,
      companyId: company.id,
      managerId: manager.id,
    },
  });

  console.log("✅ Created project:", project.name);

  // Create tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: "Design mockups",
        description: "Create initial design mockups for homepage",
        status: "DONE",
        priority: "HIGH",
        dueDate: new Date("2024-01-15"),
        projectId: project.id,
        assigneeId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Frontend development",
        description: "Implement frontend components",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date("2024-03-01"),
        projectId: project.id,
        assigneeId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Backend API integration",
        description: "Integrate with backend APIs",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: new Date("2024-04-01"),
        projectId: project.id,
        assigneeId: user.id,
      },
    }),
  ]);

  console.log(`✅ Created ${tasks.length} tasks`);

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


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear una organización
  const organization = await prisma.organization.create({
    data: {
      name: 'Tech Corp',
    },
  });

  // Crear usuarios asociados a la organización
  const [user1, user2] = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: 'john.doe@mail.com',
        password: 'securepassword',
        organizationId: organization.name,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.doe@mail.com',
        password: 'securepassword',
        organizationId: organization.name,
      },
    }),
  ]);

  // Crear tareas para el usuario 1
  const [task1, task2] = await prisma.$transaction([
    prisma.task.create({
      data: {
        title: 'Complete project documentation',
        description: 'Write detailed documentation for the new project',
        dueDate: new Date('2025-05-01'),
        authorUser: {
          connect: { id: user1.id },
        },
        organization: {
          connect: { id: organization.id },
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Fix bugs in the application',
        description: 'Resolve all critical bugs reported in the last sprint',
        dueDate: new Date('2025-04-30'),
        authorUser: {
          connect: { id: user1.id },
        },
        organization: {
          connect: { id: organization.id },
        },
      },
    }),
  ]);

  // Crear historial de cambios para las tareas
  await prisma.$transaction([
    prisma.taskHistory.create({
      data: {
        taskId: task1.id,
        oldValue: 'Draft',
        newValue: 'Reviewed',
      },
    }),
    prisma.taskHistory.create({
      data: {
        taskId: task2.id,
        oldValue: 'Pending',
        newValue: 'In Progress',
      },
    }),
  ]);

  console.log('Seed data has been successfully created!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
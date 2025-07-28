// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'admin@admin.com',
      password: 'Admin123!',
      role: 'ADMIN',
    },
    {
      email: 'manager@manager.com',
      password: 'Manager123!',
      role: 'MANAGER',
    },
    {
      email: 'customer@customer.com',
      password: 'Customer123!',
      role: 'CUSTOMER',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        role: user.role,
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLogin: null,
        previousLogin: null,
      },
    });
  }

  console.log('Seeded users: admin, manager, customer');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
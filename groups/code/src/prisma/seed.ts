import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear existing data in correct order
  await prisma.battlepassProgress.deleteMany();
  await prisma.battlepass.deleteMany();
  await prisma.groupStudent.deleteMany();
  // await prisma.user.deleteMany();
  await prisma.student.deleteMany();
  await prisma.group.deleteMany();
  await prisma.teacher.deleteMany();

  console.log('✅ Cleared existing data');

  // Create battlepass
  const battlepass = await prisma.battlepass.create({
    data: {
      name: "Season 1",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-06-01")
    }
  });

  console.log('✅ Created battlepass');

  // Create teacher
  const teacher = await prisma.teacher.create({
    data: {
      name: "Alice Johnson"
    }
  });

  // Create teacher user - use 'teacher' relation, not 'teacherId'
  // await prisma.user.create({
  //   data: {
  //     email: "alice@example.com",
  //     password: hashedPassword,
  //     name: "Alice Johnson",
  //     role: "teacher",
  //     teacher: {
  //       connect: { id: teacher.id }
  //     }
  //   }
  // });

  console.log('✅ Created teacher');

  // Create groups
  const group1 = await prisma.group.create({
    data: {
      name: "Math Group",
      teacherId: teacher.id
    }
  });

  const group2 = await prisma.group.create({
    data: {
      name: "Science Group",
      teacherId: teacher.id
    }
  });

  console.log('✅ Created groups');

  // Create students WITHOUT user relation
  const student1 = await prisma.student.create({
    data: {
      name: "John Doe",
      groupId: group1.id
    }
  });

  const student2 = await prisma.student.create({
    data: {
      name: "Jane Smith",
      groupId: group1.id
    }
  });

  const student3 = await prisma.student.create({
    data: {
      name: "Tom Brown",
      groupId: group2.id
    }
  });

  const student4 = await prisma.student.create({
    data: {
      name: "Sara White",
      groupId: group2.id
    }
  });

  console.log('✅ Created students');

  // NOW create user accounts - use 'student' relation, not 'studentId'
  // await prisma.user.create({
  //   data: {
  //     email: "john@example.com",
  //     password: hashedPassword,
  //     name: "John Doe",
  //     role: "student",
  //     student: {
  //       connect: { id: student1.id }
  //     }
  //   }
  // });

  // await prisma.user.create({
  //   data: {
  //     email: "jane@example.com",
  //     password: hashedPassword,
  //     name: "Jane Smith",
  //     role: "student",
  //     student: {
  //       connect: { id: student2.id }
  //     }
  //   }
  // });

  // await prisma.user.create({
  //   data: {
  //     email: "tom@example.com",
  //     password: hashedPassword,
  //     name: "Tom Brown",
  //     role: "student",
  //     student: {
  //       connect: { id: student3.id }
  //     }
  //   }
  // });

  // await prisma.user.create({
  //   data: {
  //     email: "sara@example.com",
  //     password: hashedPassword,
  //     name: "Sara White",
  //     role: "student",
  //     student: {
  //       connect: { id: student4.id }
  //     }
  //   }
  // });

  console.log('✅ Created user accounts');

  // Create unassigned students
  await prisma.student.createMany({
    data: [
      { name: "Emma Wilson" },
      { name: "Oliver Davis" },
      { name: "Sophia Martinez" },
      { name: "Lucas Garcia" },
      { name: "Mia Rodriguez" }
    ]
  });

  console.log('✅ Created unassigned students');

  // Create admin user
  // await prisma.user.create({
  //   data: {
  //     email: "admin@example.com",
  //     password: hashedPassword,
  //     name: "Admin User",
  //     role: "teacher"
  //   }
  // });

  console.log('✅ Created admin user');

  // Get all students for battlepass progress
  const allStudents = await prisma.student.findMany();

  // Create battlepass progress
  await prisma.battlepassProgress.createMany({
    data: allStudents.map((student, index) => ({
      studentId: student.id,
      battlepassId: battlepass.id,
      level: Math.floor(index / 2) + 1,
      xp: 100 + index * 50
    }))
  });

  console.log('✅ Created battlepass progress');

  const studentCount = await prisma.student.count();
  const groupCount = await prisma.group.count();
  const teacherCount = await prisma.teacher.count();
  // const userCount = await prisma.user.count();

  console.log('\n📊 Seed Summary:');
  console.log(`   Teachers: ${teacherCount}`);
  console.log(`   Groups: ${groupCount}`);
  console.log(`   Students: ${studentCount}`);
  // console.log(`   Users: ${userCount}`);
  console.log(`   Battlepass: ${battlepass.name}`);
  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
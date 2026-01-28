import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Check if teacher user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: "alice@example.com" },
    include: {
      teacher: {
        include: {
          groups: {
            include: {
              students: true
            }
          }
        }
      }
    }
  });

  if (existingUser && existingUser.teacher) {
    console.log('Seeded teacher with groups and students:', existingUser);
    return;
  }

  // Create a teacher user with linked Teacher record
  const teacherUser = await prisma.user.create({
    data: {
      email: "alice@example.com",
      password: hashedPassword,
      name: "Alice Johnson",
      role: "teacher",
      teacher: {
        create: {
          name: "Alice Johnson",
          groups: {
            create: [
              {
                name: "Math Group",
                students: {
                  create: [
                    { name: "John Doe" },
                    { name: "Jane Smith" }
                  ]
                }
              },
              {
                name: "Science Group",
                students: {
                  create: [
                    { name: "Tom Brown" },
                    { name: "Sara White" }
                  ]
                }
              }
            ]
          }
        }
      }
    },
    include: {
      teacher: {
        include: {
          groups: {
            include: {
              students: true
            }
          }
        }
      }
    }
  });

  const teacher = teacherUser.teacher!;

  // Check if task already exists
  const existingTask = await prisma.task.findFirst({
    where: { name: 'kan je koppen??' }
  });

  if (!existingTask) {
    const task = await prisma.task.create({
      data: {
        name: 'kan je koppen??',
        description: 'rode kaart pakken',
        date: new Date(2025, 6, 4),
        icon: '🫃🟥',
        xp: 67,
        teacherId: teacher.id,
        tasksteps: {
          create: [
            {
              text: 'Ga naar het veld',
              completed: false
            },
            {
              text: 'Pak de rode kaart',
              completed: false
            },
            {
              text: 'Koppen',
              completed: false
            }
          ]
        },
        x: 150,
        y: 300
      },
    });

    const studentsToAssign = [
      teacher.groups[0].students[0],
      teacher.groups[0].students[1],
      teacher.groups[1].students[0]
    ];

    for (const student of studentsToAssign) {
      await prisma.taskStudent.create({
        data: {
          taskId: task.id,
          studentId: student.id
        }
      });
    }
  }

  // Check how many unassigned students exist
  const unassignedCount = await prisma.student.count({
    where: { groupId: null }
  });

  // Only create unassigned students if none exist
  if (unassignedCount < 5) {
    await prisma.student.createMany({
      data: [
        { name: "Emma Wilson" },
        { name: "Oliver Davis" },
        { name: "Sophia Martinez" },
        { name: "Lucas Garcia" },
        { name: "Mia Rodriguez" }
      ]
    });
  }

  // Check if admin user already exists
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@example.com" }
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin User",
        role: "teacher"
      }
    });
  }
  
  // Check if battlepass already exists
  let battlepass = await prisma.battlepass.findFirst({
    where: { name: 'Season 1' }
  });

  if (!battlepass) {
    battlepass = await prisma.battlepass.create({
      data: { name: 'Season 1', startDate: new Date(), endDate: new Date() }
    });
  }

  // Fetch all students after teacher creation
  const students = await prisma.student.findMany();

  // Create battlepassProgress only for students who don't have one
  for (let i = 0; i < students.length; i++) {
    const existingProgress = await prisma.battlepassProgress.findFirst({
      where: {
        studentId: students[i].id,
        battlepassId: battlepass.id
      }
    });

    if (!existingProgress) {
      await prisma.battlepassProgress.create({
        data: {
          studentId: students[i].id,
          battlepassId: battlepass.id,
          level: Math.floor(i / 2) + 1,
          xp: 100 + i * 5
        }
      });
    }
  }

  console.log("Seeded teacher with groups and students:", teacherUser);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
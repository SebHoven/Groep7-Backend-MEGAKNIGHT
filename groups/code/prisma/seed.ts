import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

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

  // Create some unassigned students (not in any group)
  await prisma.student.createMany({
    data: [
      { name: "Emma Wilson" },
      { name: "Oliver Davis" },
      { name: "Sophia Martinez" },
      { name: "Lucas Garcia" },
      { name: "Mia Rodriguez" }
    ]
  });

  // Create an admin user (without teacher/student)
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "teacher"
    }
  });
  
  // Create battlepass
  const battlepass = await prisma.battlepass.create({
    data: { name: 'Season 1', startDate: new Date(), endDate: new Date() }
  });

  // Fetch all students after teacher creation
  const students = await prisma.student.findMany();

  // Create battlepassProgress for all students
  for (let i = 0; i < students.length; i++) {
    await prisma.battlepassProgress.create({
      data: {
        studentId: students[i].id,
        battlepassId: battlepass.id,
        level: Math.floor(i / 2) + 1,
        xp: 100 + i * 5
      }
    });
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
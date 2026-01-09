import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'

async function main() {

  // Create a battlepass
  const battlepass = await prisma.battlepass.create({
    data: {
      name: "Season 1",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-06-01")
    }
  });

  // Create a teacher
  const teacher = await prisma.teacher.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "password123",
      groups: {
        create: [
          {
            name: "Math Group",
            students: {
              create: [
                { name: "John Doe", loginCode: "JD123" },
                { name: "Jane Smith", loginCode: "JS456" }
              ]
            }
          },
          {
            name: "Science Group",
            students: {
              create: [
                { name: "Tom Brown", loginCode: "TB789" },
                { name: "Sara White", loginCode: "SW101" }
              ]
            }
          }
        ]
      }
    },
    include: {
      groups: {
        include: {
          students: true
        }
      }
    }
  })

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
  })

  const studentsToAssign = [
    teacher.groups[0].students[0],
    teacher.groups[0].students[1],
    teacher.groups[1].students[0]
  ]

  for (const student of studentsToAssign) {
    await prisma.taskStudent.create({
      data: {
        taskId: task.id,
        studentId: student.id
      }
    })
  }

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create a user for login
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User"
    }
  })

  const unassignedStudents: { id: number; name: string; loginCode: string; groupId: number | null }[] = [];

  const unassignedData = [
    { name: "Emma Wilson", loginCode: "EW111", groupId: null },
    { name: "Oliver Davis", loginCode: "OD222", groupId: null },
    { name: "Sophia Martinez", loginCode: "SM333", groupId: null },
    { name: "Lucas Garcia", loginCode: "LG444", groupId: null },
    { name: "Mia Rodriguez", loginCode: "MR555", groupId: null }
  ];

  for (const s of unassignedData) {
    const student = await prisma.student.create({ data: s });
    unassignedStudents.push(student);
  }
  
  const allStudents = [
    ...teacher.groups.flatMap(g => g.students),
    ...unassignedStudents
  ];

  for (let i = 0; i < allStudents.length; i++) {
    const student = allStudents[i];
    await prisma.battlepassProgress.create({
      data: {
        studentId: student.id!,
        battlepassId: battlepass.id,
        level: Math.floor(i / 2) + 1,
        xp: 100 + i * 50
      }
    });
  }

  console.log("Seeded teacher with groups and students:", teacher)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })